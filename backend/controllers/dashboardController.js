const Order = require('../models/Order');
const Product = require('../models/Product');
const Category = require('../models/Category');

// Hàm helper để lấy khoảng thời gian
const getDateRange = (timeframe, startDate, endDate) => {
  const now = new Date();
  let start, end;

  switch (timeframe) {
    case 'year':
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      break;
    case 'quarter':
      const quarter = Math.floor(now.getMonth() / 3);
      start = new Date(now.getFullYear(), quarter * 3, 1);
      end = new Date(now.getFullYear(), (quarter + 1) * 3, 0, 23, 59, 59, 999);
      break;
    case 'month':
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      break;
    case 'week':
      const day = now.getDay();
      start = new Date(now);
      start.setDate(now.getDate() - day + (day === 0 ? -6 : 1));
      start.setHours(0, 0, 0, 0);
      end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      break;
    case 'custom':
      start = startDate ? new Date(startDate) : new Date(now.getFullYear(), 0, 1);
      end = endDate ? new Date(endDate) : new Date();
      end.setHours(23, 59, 59, 999);
      break;
    default:
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
  }

  return { start, end };
};

exports.getDashboardStats = async (req, res) => {
  try {
    const { timeframe = 'year', startDate, endDate } = req.query;
    const { start, end } = getDateRange(timeframe, startDate, endDate);

    // Lấy tổng số đơn hàng và doanh thu
    const orderStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: 'COMPLETED'
        }
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$total' },
          orders: { $push: '$$ROOT' }
        }
      }
    ]);

    // Thống kê theo thời gian
    const timeStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: 'COMPLETED'
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          orders: { $sum: 1 },
          revenue: { $sum: '$total' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      },
      {
        $project: {
          _id: 1,
          date: {
            $dateFromParts: {
              'year': '$_id.year',
              'month': '$_id.month',
              'day': '$_id.day'
            }
          },
          orders: 1,
          revenue: 1
        }
      }
    ]);

    // Top sản phẩm bán chạy
    const topProducts = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: 'COMPLETED'
        }
      },
      { $unwind: '$products' },
      {
        $group: {
          _id: '$products.product',
          totalQuantity: { $sum: '$products.quantity' },
          totalRevenue: { $sum: { $multiply: ['$products.quantity', '$products.price'] } }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      { $unwind: '$productDetails' },
      {
        $project: {
          name: '$productDetails.name',
          quantity: '$totalQuantity',
          revenue: '$totalRevenue'
        }
      },
      { $sort: { quantity: -1 } },
      { $limit: 10 }
    ]);

    // Thống kê theo danh mục
    const categoryStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: 'COMPLETED'
        }
      },
      { $unwind: '$products' },
      {
        $lookup: {
          from: 'products',
          localField: 'products.product',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      { $unwind: '$productDetails' },
      {
        $lookup: {
          from: 'categories',
          localField: 'productDetails.category',
          foreignField: '_id',
          as: 'categoryDetails'
        }
      },
      { $unwind: { path: '$categoryDetails', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: {
            categoryId: '$productDetails.category',
            categoryName: { $ifNull: ['$categoryDetails.description', 'Uncategorized'] }
          },
          quantity: { $sum: '$products.quantity' },
          revenue: { $sum: { $multiply: ['$products.quantity', '$products.price'] } }
        }
      },
      {
        $project: {
          _id: '$_id.categoryId',
          category: '$_id.categoryName',
          quantity: 1,
          revenue: 1
        }
      },
      {
        $match: {
          revenue: { $gt: 0 }
        }
      },
      {
        $sort: { revenue: -1 }
      }
    ]);

    // Tổng hợp kết quả
    const stats = {
      summary: {
        totalOrders: orderStats[0]?.totalOrders || 0,
        totalRevenue: orderStats[0]?.totalRevenue || 0,
        avgOrderValue: orderStats[0] ? orderStats[0].totalRevenue / orderStats[0].totalOrders : 0
      },
      timeStats,
      topProducts,
      categoryStats
    };

    res.json(stats);
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ message: err.message });
  }
};
