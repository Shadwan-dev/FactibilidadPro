// src/components/notifications/UserNotificationBell.jsx
import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';

export function UserNotificationBell({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, 'userNotifications'),
      where('userId', '==', userId),
      where('read', '==', false)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userNotifications = [];
      snapshot.forEach((doc) => {
        userNotifications.push({ id: doc.id, ...doc.data() });
      });
      setNotifications(userNotifications);
    });

    return () => unsubscribe();
  }, [userId]);

  const markAsRead = async (notificationId) => {
    try {
      await updateDoc(doc(db, 'userNotifications', notificationId), {
        read: true,
        readAt: new Date()
      });
    } catch (error) {
      console.error('Error marcando notificación como leída:', error);
    }
  };

  const handleNotificationClick = async (notification) => {
    await markAsRead(notification.id);
    setShowDropdown(false);
    
    // Aquí puedes redirigir al proyecto analizado
    if (notification.type === 'project_analyzed') {
      console.log('Redirigiendo al proyecto:', notification.projectId);
      // window.location.href = `/project/${notification.projectId}`;
    }
  };

  return (
    <div className="user-notification-bell">
      <button 
        className="notification-bell-btn"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        🔔 
        {notifications.length > 0 && (
          <span className="notification-count">{notifications.length}</span>
        )}
      </button>

      {showDropdown && (
        <div className="notifications-dropdown">
          <div className="dropdown-header">
            <h4>Tus Notificaciones</h4>
            <button onClick={() => setShowDropdown(false)}>✕</button>
          </div>
          
          <div className="notifications-list">
            {notifications.length === 0 ? (
              <p className="no-notifications">No tienes notificaciones nuevas</p>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className="notification-item user-notification"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <h5>{notification.title}</h5>
                  <p>{notification.message}</p>
                  <small>
                    {notification.createdAt?.toDate?.().toLocaleString()}
                  </small>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}