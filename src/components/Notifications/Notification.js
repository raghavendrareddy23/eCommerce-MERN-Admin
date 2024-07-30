import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NotificationBar = () => {
  const [notifications, setNotifications] = useState([]);
  const [allNotifications, setAllNotifications] = useState([]);

  useEffect(() => {
    fetchInitialNotifications();
  }, []);

  const fetchInitialNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:5000/notifications/initial');
      setNotifications(response.data.paymentCompletedActiveNotifications);
    } catch (error) {
      console.error('Error fetching initial notifications:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5000/notifications/${id}`);
      setNotifications(notifications.map(notification => {
        if (notification._id === id) {
          return { ...notification, status: 'inactive' };
        }
        return notification;
      }));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  useEffect(() => {
    fetchAllNotifications();
  }, []);

  const fetchAllNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:5000/notifications/initial');
      const allNotifications = response.data.allNotifications;
      
      // Filter notifications for status 'inactive' and paymentStatus 'completed'
      const filteredNotifications = allNotifications.filter(notification => {
        return notification.status === 'inactive' && notification.paymentStatus === 'completed';
      });

      // Update state with filtered notifications
      setAllNotifications(filteredNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  return (
    <div className="bg-gray-200 p-4">
      <h2 className="text-lg font-bold mb-2">Notifications</h2>
      <ul>
        {notifications.map(notification => (
          <li
            key={notification._id}
            className={`py-2 ${notification.status === 'active' ? 'font-bold' : 'text-gray-500'}`}
          >
            {notification.message}
            {notification.status === 'active' && (
              <button
                className="ml-2 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                onClick={() => markAsRead(notification._id)}
              >
                Mark as Read
              </button>
            )}
          </li>
        ))}
      </ul>
      <ul>
        {allNotifications.map(notification => (
          <li key={notification._id}>
            {notification.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationBar;
