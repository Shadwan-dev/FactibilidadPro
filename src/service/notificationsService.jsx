// src/services/notificationService.js
import { collection, addDoc, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

export const sendNotificationToUser = async (userId, title, message, data = {}) => {
  try {
    await addDoc(collection(db, 'notifications'), {
      userId,
      title,
      message,
      data,
      read: false,
      createdAt: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error enviando notificación:', error);
    return false;
  }
};

export const getUserNotifications = (userId, callback) => {
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    where('read', '==', false)
  );

  return onSnapshot(q, (snapshot) => {
    const notifications = [];
    snapshot.forEach((doc) => {
      notifications.push({ id: doc.id, ...doc.data() });
    });
    callback(notifications);
  });
};