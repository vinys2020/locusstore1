// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../config/firebase";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [rol, setRol] = useState(null);
  const [aprobado, setAprobado] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
          // Usuario nuevo → crear documento con datos por defecto
          const newUser = {
            uid: user.uid,
            email: user.email,
            nombreCompleto: user.displayName || "",
            dni: "",
            telefono: "",
            domposgeo: "",
            posgeo: "",
            fechaNacimiento: "",
            organismo: "",
            gremio: "",
            aprobado: false,
            rol: "usuario",
            puntos: 0,
            fechaAfiliacion: serverTimestamp(),
          };

          await setDoc(userRef, newUser);

          // Guardar en estado incluyendo foto y displayName de Google
          setUsuario({
            ...newUser,
            displayName: user.displayName,
            photoURL: user.photoURL,
          });
          setRol(newUser.rol);
          setAprobado(newUser.aprobado);
        } else {
          // Usuario existente → traer todos los datos de Firestore
          const data = docSnap.data();
          setUsuario({
            uid: user.uid,
            displayName: data.nombreCompleto || user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            ...data,
          });
          setRol(data.rol || "usuario");
          setAprobado(data.aprobado || false);
        }
      } else {
        setUsuario(null);
        setRol(null);
        setAprobado(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUsuario(null);
    setRol(null);
    setAprobado(false);
  };

  return (
    <AuthContext.Provider value={{ usuario, rol, aprobado, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
