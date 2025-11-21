// src/hooks/useFirestore.js
import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot,
  query,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const useFirestore = (collectionName) => {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
    // Verificar conexión
    useEffect(() => {
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);
  
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
  
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }, []);

    const shouldUpdateDocument = (oldData, newData) => {
      if (!oldData || !newData) return true;
      
      // Comparar solo los campos relevantes para evitar bucles
      const relevantFields = ['formData', 'calculations', 'status', 'notificationSent'];
      
      for (let field of relevantFields) {
        if (JSON.stringify(oldData[field]) !== JSON.stringify(newData[field])) {
          return true;
        }
      }
      
      return false;
    };

  // Real-time listener para la colección
  useEffect(() => {
    if (!isOnline) {
      setError('Sin conexión a internet');
      setLoading(false);
      return;
    }

    let unsubscribe;

    const getData = async () => {
      setLoading(true);
      try {
        // Query para obtener todos los documentos ordenados por fecha de creación
        const q = query(
          collection(db, collectionName),
          orderBy('createdAt', 'desc')
        );

        unsubscribe = onSnapshot(q, 
          (snapshot) => {
            const results = [];
            snapshot.forEach((doc) => {
              const data = doc.data();
              results.push({ 
                id: doc.id, 
                ...data,
                // Convertir timestamps de Firebase a Date objects
                createdAt: data.createdAt?.toDate?.() || data.createdAt,
                updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
                analyzedAt: data.analyzedAt?.toDate?.() || data.analyzedAt,
                notificationSentAt: data.notificationSentAt?.toDate?.() || data.notificationSentAt
              });
            });
            setDocuments(results);
            setError(null);
            setLoading(false);
          },
          (err) => {
            console.error('Error en listener de Firestore:', err);
            setError(err.message);
            setLoading(false);
          }
        );

      } catch (err) {
        console.error('Error configurando listener:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    getData();

    // Cleanup function
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [collectionName]);

  // Agregar documento
  const addDocument = async (docData) => {
    try {
      const docWithTimestamps = {
        ...docData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, collectionName), docWithTimestamps);
      console.log('✅ Documento agregado con ID:', docRef.id);
      return docRef.id;
    } catch (err) {
      console.error('Error agregando documento:', err);
      setError(err.message);
      return null;
    }
  };

  // Actualizar documento
  const updateDocument = async (docId, updates) => {
    try {
      const currentDoc = documents.find(doc => doc.id === docId);
      
      // Verificar si realmente necesita actualizarse
      if (currentDoc && !shouldUpdateDocument(currentDoc, updates)) {
        console.log('⏭️  Saltando update - sin cambios reales');
        return true;
      }
      
      const updatesWithTimestamp = {
        ...updates,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(doc(db, collectionName, docId), updatesWithTimestamp);
      console.log('✅ Documento actualizado:', docId);
      return true;
    } catch (err) {
      console.error('Error actualizando documento:', err);
      setError(err.message);
      return false;
    }
  };

  // Eliminar documento
  const deleteDocument = async (docId) => {
    try {
      await deleteDoc(doc(db, collectionName, docId));
      console.log('✅ Documento eliminado:', docId);
      return true;
    } catch (err) {
      console.error('Error eliminando documento:', err);
      setError(err.message);
      return false;
    }
  };

  return {
    documents,
    error,
    loading,
    addDocument,
    updateDocument,
    deleteDocument
  };
};