// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../config/firebase"; // tu configuración

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [rol, setRol] = useState(null);
  const [aprobado, setAprobado] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Revisar Firestore si existe
        const userRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
          // Nuevo usuario → crear documento con aprobado: false
          await setDoc(userRef, {
            nombre: user.displayName,
            email: user.email,
            aprobado: false,
            rol: "usuario",
            fechaAfiliacion: serverTimestamp(),
            telefono: "",
            organismo: "",
            posgeo: "",
          });
          setAprobado(false);
          setRol("usuario");
        } else {
          const data = docSnap.data();
          setAprobado(data.aprobado);
          setRol(data.rol);
        }

        setUsuario(user);
      } else {
        setUsuario(null);
        setRol(null);
        setAprobado(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ usuario, rol, aprobado, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
