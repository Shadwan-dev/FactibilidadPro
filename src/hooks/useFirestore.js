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
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const useFirestore = (collectionName) => {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Obtener documentos en tiempo real
  useEffect(() => {
    setLoading(true);
    
    try {
      const q = query(
        collection(db, collectionName), 
        orderBy('createdAt', 'desc')
      );
      
      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          const results = [];
          snapshot.forEach((doc) => {
            results.push({ ...doc.data(), id: doc.id });
          });
          setDocuments(results);
          setError(null);
          setLoading(false);
        },
        (err) => {
          console.error('Error en Firestore:', err);
          setError(err.message);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Error configurando Firestore:', err);
      setError(err.message);
      setLoading(false);
    }
  }, [collectionName]);

  // Agregar documento
  const addDocument = async (document) => {
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...document,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setLoading(false);
      return docRef.id;
    } catch (err) {
      console.error('Error agregando documento:', err);
      setError(err.message);
      setLoading(false);
      return null;
    }
  };

  // Actualizar documento
  const updateDocument = async (id, updates) => {
    setLoading(true);
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      setLoading(false);
      return true;
    } catch (err) {
      console.error('Error actualizando documento:', err);
      setError(err.message);
      setLoading(false);
      return false;
    }
  };

  // Eliminar documento
  const deleteDocument = async (id) => {
    setLoading(true);
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      setLoading(false);
      return true;
    } catch (err) {
      console.error('Error eliminando documento:', err);
      setError(err.message);
      setLoading(false);
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