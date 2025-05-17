const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

exports.getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const filter = req.query.filter;
    const start = req.query.start;
    const end = req.query.end;

    let query = {};

    if (filter) {
      // Đặt múi giờ Việt Nam (UTC+7)
      const now = new Date();
      const offset = 7;
      now.setHours(now.getHours() + offset);
      now.setHours(0, 0, 0, 0);

      switch (filter) {
        case 'today': {
          const startOfDay = new Date(now);
          const endOfDay = new Date(now);
          endOfDay.setHours(23, 59, 59, 999);
          query.createdAt = {
            $gte: startOfDay,
            $lte: endOfDay
          };
          break;
        }
        case 'yesterday': {
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          const endOfYesterday = new Date(yesterday);
          endOfYesterday.setHours(23, 59, 59, 999);
          query.createdAt = {
            $gte: yesterday,
            $lte: endOfYesterday
          };
          break;
        }
        case 'week': {
          const startOfWeek = new Date(now);
          // Đặt về đầu tuần (thứ 2)
          startOfWeek.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          endOfWeek.setHours(23, 59, 59, 999);
          query.createdAt = {
            $gte: startOfWeek,
            $lte: endOfWeek
          };
          break;
        }
        case 'month': {
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          endOfMonth.setHours(23, 59, 59, 999);
          query.createdAt = {
            $gte: startOfMonth,
            $lte: endOfMonth
          };
          break;
        }
        case 'range': {
          if (start && end) {
            const startDate = new Date(start);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(end);
            endDate.setHours(23, 59, 59, 999);
            query.createdAt = {
              $gte: startDate,
              $lte: endDate
            };
          }
          break;
        }
      }
    }

    
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'fullname email');

    const total = await Order.countDocuments(query);
    const totalPages = Math.ceil(total / limit);


    res.json({
      orders,
      page,
      totalPages,
      total
    });
  } catch (err) {
    console.error('Error in getAllOrders:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user').populate('products.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    // Validate status
    const validStatuses = ['PENDING', 'COMPLETED', 'CANCELLED'];
    if (req.body.status && !validStatuses.includes(req.body.status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id, 
      { 
        ...req.body,
        updatedAt: Date.now()
      },
      { new: true }
    ).populate('user').populate('products.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    console.error('Error updating order:', err);
    res.status(400).json({ message: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};