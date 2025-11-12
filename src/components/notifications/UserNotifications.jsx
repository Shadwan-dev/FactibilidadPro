// src/components/notifications/UserNotifications.jsx
import React, { useState, useEffect } from 'react';
import { getUserNotifications, markNotificationAsRead } from '../../services/notificationService';

export function UserNotifications({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = getUserNotifications(userId, (notifs) => {
      setNotifications(notifs);
    });

    return () => unsubscribe();
  }, [userId]);

  const handleNotificationClick = async (notification) => {
    // Marcar como leída
    await markNotificationAsRead(notification.id);
    
    // Si es una notificación de proyecto analizado, redirigir
    if (notification.data?.type === 'project_analyzed') {
      // Aquí puedes redirigir a la vista de resultados
      console.log('Redirigiendo al proyecto:', notification.data.projectId);
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="user-notifications">
      <button 
        className="notification-bell"
        onClick={() => setVisible(!visible)}
      >
        🔔 {notifications.length > 0 && (
          <span className="notification-count">{notifications.length}</span>
        )}
      </button>

      {visible && (
        <div className="notifications-dropdown">
          <div className="dropdown-header">
            <h4>Notificaciones</h4>
            <button onClick={() => setVisible(false)}>✕</button>
          </div>
          
          <div className="notifications-list">
            {notifications.map((notification) => (
              <div 
                key={notification.id}
                className="notification-item"
                onClick={() => handleNotificationClick(notification)}
              >
                <h5>{notification.title}</h5>
                <p>{notification.message}</p>
                <small>
                  {notification.createdAt?.toDate?.().toLocaleString()}
                </small>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}