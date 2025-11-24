// src/components/Diagnostic.jsx
import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

export function Diagnostic() {
  const [status, setStatus] = useState('Verificando...');

  useEffect(() => {
    const checkFirebaseConnection = async () => {
      try {
        // Verificar Auth
        setStatus('Verificando autenticación...');
        await auth._initializationPromise;
        
        // Verificar Firestore
        setStatus('Verificando base de datos...');
        const testDoc = await getDoc(doc(db, 'test', 'test'));
        
        setStatus('✅ Firebase conectado correctamente');
      } catch (error) {
        console.error('❌ Error de diagnóstico:', error);
        setStatus(`❌ Error: ${error.message}`);
      }
    };

    checkFirebaseConnection();
  }, []);

  return (
    <div style={{ padding: '20px', background: '#f5f5f5', margin: '10px' }}>
      <h3>Diagnóstico de Firebase</h3>
      <p><strong>Estado:</strong> {status}</p>
      <p><strong>Entorno:</strong> {import.meta.env.MODE}</p>
      <p><strong>Project ID:</strong> {import.meta.env.VITE_FIREBASE_PROJECT_ID || 'No configurado'}</p>
    </div>
  );
}