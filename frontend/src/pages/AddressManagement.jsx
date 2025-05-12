import React, { useState, useEffect } from 'react';
//import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../styles/AddressManagement.css';

const AddressManagement = () => {
  //const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage({ type: 'error', text: 'Vui lòng đăng nhập lại' });
        return;
      }

      const response = await axios.get('/api/user/account', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setAddresses(response.data.addresses || []);
      setMessage({ type: '', text: '' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Không thể tải danh sách địa chỉ' });
      setAddresses([]);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newAddress.trim()) {
      setMessage({ type: 'error', text: 'Vui lòng nhập địa chỉ' });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage({ type: 'error', text: 'Vui lòng đăng nhập lại' });
        return;
      }

      // Create new address object
      const newAddressObj = {
        address: newAddress.trim(),
        isDefault: addresses.length === 0 // Set as default if it's the first address
      };

      // Update addresses array
      const updatedAddresses = editingIndex !== null
        ? addresses.map((addr, idx) => 
            idx === editingIndex ? newAddressObj : addr
          )
        : [...addresses, newAddressObj];

      const response = await axios.put('/api/user/account', 
        { addresses: updatedAddresses },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setMessage({ 
        type: 'success', 
        text: editingIndex !== null 
          ? 'Địa chỉ đã được cập nhật' 
          : 'Địa chỉ đã được thêm thành công'
      });
      setNewAddress('');
      setEditingIndex(null);
      setAddresses(response.data.user.addresses || []);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Có lỗi xảy ra khi lưu địa chỉ'
      });
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
  };

  const handleSetDefault = async (index) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage({ type: 'error', text: 'Vui lòng đăng nhập lại' });
        return;
      }

      const updatedAddresses = addresses.map((addr, idx) => ({
        ...addr,
        isDefault: idx === index
      }));

      const response = await axios.put('/api/user/account',
        { addresses: updatedAddresses },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setMessage({ type: 'success', text: 'Đã cập nhật địa chỉ mặc định' });
      setAddresses(response.data.user.addresses || []);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Không thể cập nhật địa chỉ mặc định'
      });
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
  };

  const handleEdit = (address, index) => {
    setNewAddress(address.address);
    setEditingIndex(index);
  };

  const handleCancel = () => {
    setNewAddress('');
    setEditingIndex(null);
  };

  const handleDelete = async (index) => {
    if (!window.confirm('Bạn có chắc muốn xóa địa chỉ này?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage({ type: 'error', text: 'Vui lòng đăng nhập lại' });
        return;
      }

      const updatedAddresses = addresses.filter((_, idx) => idx !== index);
      
      // If we're deleting the default address and there are other addresses,
      // make the first remaining address the default
      if (addresses[index].isDefault && updatedAddresses.length > 0) {
        updatedAddresses[0].isDefault = true;
      }

      const response = await axios.put('/api/user/account',
        { addresses: updatedAddresses },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setMessage({ type: 'success', text: 'Địa chỉ đã được xóa' });
      setAddresses(response.data.user.addresses || []);
      if (editingIndex === index) {
        setNewAddress('');
        setEditingIndex(null);
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Không thể xóa địa chỉ'
      });
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
  };

  const styles = {
    addressManagementContainer: {
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
    },
    addressForm: {
      marginBottom: '20px',
    },
    formGroup: {
      display: 'flex',
      gap: '10px',
      marginBottom: '15px',
    },
    addressInput: {
      flex: 1,
      padding: '8px 12px',
      borderRadius: '4px',
      border: '1px solid #ddd',
    },
    formButtons: {
      display: 'flex',
      gap: '10px',
    },
    submitButton: {
      padding: '8px 16px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    cancelButton: {
      padding: '8px 16px',
      backgroundColor: '#f44336',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    message: {
      padding: '10px',
      marginBottom: '15px',
      borderRadius: '4px',
    },
    success: {
      backgroundColor: '#dff0d8',
      color: '#3c763d',
      border: '1px solid #d6e9c6',
    },
    error: {
      backgroundColor: '#f2dede',
      color: '#a94442',
      border: '1px solid #ebccd1',
    },
    addressesList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    addressItem: {
      padding: '15px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'white',
    },
    addressText: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    defaultBadge: {
      backgroundColor: '#4CAF50',
      color: 'white',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '0.8em',
    },
    addressActions: {
      display: 'flex',
      gap: '10px',
    },
    actionButton: {
      padding: '6px 12px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    defaultButton: {
      backgroundColor: '#2196F3',
      color: 'white',
    },
    editButton: {
      backgroundColor: '#FFC107',
      color: 'black',
    },
    deleteButton: {
      backgroundColor: '#f44336',
      color: 'white',
    },
    noAddresses: {
      textAlign: 'center',
      padding: '20px',
      color: '#666',
      backgroundColor: '#f9f9f9',
      borderRadius: '4px',
    },
  };

  if (isLoading) {
    return (
      <div style={styles.addressManagementContainer}>
        <h2>Quản lý địa chỉ</h2>
        <div className="loading">Đang tải...</div>
      </div>
    );
  }

  return (
    <div style={styles.addressManagementContainer}>
      <h2>Quản lý địa chỉ</h2>
      
      <div style={styles.addressForm}>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <input
              type="text"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="Nhập địa chỉ mới"
              style={styles.addressInput}
            />
            <div style={styles.formButtons}>
              <button type="submit" style={styles.submitButton}>
                {editingIndex !== null ? 'Cập nhật' : 'Thêm địa chỉ'}
              </button>
              {editingIndex !== null && (
                <button 
                  type="button" 
                  style={{...styles.actionButton, ...styles.cancelButton}}
                  onClick={handleCancel}
                >
                  Hủy
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {message.text && (
        <div style={{
          ...styles.message,
          ...(message.type === 'success' ? styles.success : styles.error)
        }}>
          {message.text}
        </div>
      )}

      <div style={styles.addressesList}>
        {addresses && addresses.length > 0 ? (
          addresses.map((address, index) => (
            <div key={index} style={styles.addressItem}>
              <div style={styles.addressText}>
                <span>{address.address}</span>
                {address.isDefault && (
                  <span style={styles.defaultBadge}>Mặc định</span>
                )}
              </div>
              <div style={styles.addressActions}>
                {!address.isDefault && (
                  <button 
                    onClick={() => handleSetDefault(index)}
                    style={{...styles.actionButton, ...styles.defaultButton}}
                  >
                    Đặt làm mặc định
                  </button>
                )}
                <button 
                  onClick={() => handleEdit(address, index)}
                  style={{...styles.actionButton, ...styles.editButton}}
                >
                  Sửa
                </button>
                <button 
                  onClick={() => handleDelete(index)}
                  style={{...styles.actionButton, ...styles.deleteButton}}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={styles.noAddresses}>Chưa có địa chỉ nào được thêm</div>
        )}
      </div>
    </div>
  );
};

export default AddressManagement; 