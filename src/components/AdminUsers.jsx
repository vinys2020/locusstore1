import React, { useEffect, useState } from "react";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase";

const AdminUsers = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [busqueda, setBusqueda] = useState("");

    // Escuchar usuarios en tiempo real
    useEffect(() => {
        const usuariosRef = collection(db, "usuarios");
        const unsubscribe = onSnapshot(
            usuariosRef,
            (snapshot) => {
                const lista = snapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
                setUsuarios(lista);
            },
            (err) => console.error("Error al obtener usuarios:", err)
        );

        return () => unsubscribe();
    }, []);

    // Cambiar estado aprobado
    const cambiarAprobado = async (uid, valor) => {
        try {
            const usuarioRef = doc(db, "usuarios", uid);
            await updateDoc(usuarioRef, { aprobado: valor });
            setUsuarios((prev) =>
                prev.map((u) => (u.uid === uid ? { ...u, aprobado: valor } : u))
            );
        } catch (err) {
            console.error("Error al actualizar aprobado:", err);
        }
    };

    const usuariosFiltrados = usuarios.filter((u) => {
        if (!busqueda) return true; // mostrar todos si búsqueda vacía
        return (
            (u.nombreCompleto && u.nombreCompleto.toLowerCase().includes(busqueda.toLowerCase())) ||
            (u.email && u.email.toLowerCase().includes(busqueda.toLowerCase())) ||
            (u.dni && u.dni.includes(busqueda))
        );
    });


    return (
        <section className="cards shadow-sm rounded-4 p-3 bg-white mb-5">
            <h2 className="text-center mb-4 text-black">Gestión de Usuarios</h2>

            {/* Buscador */}
            <input
                type="text"
                className="form-control mb-3"
                placeholder="Buscar por nombre, email o DNI..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
            />

            {/* Tabla de usuarios */}
            <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>DNI</th>
                            <th>Rol</th>
                            <th>Puntos</th>
                            <th>Aprobado</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuariosFiltrados.map((u) => (
                            <tr key={u.uid}>
                                <td>{u.nombreCompleto}</td>
                                <td>{u.email}</td>
                                <td>{u.dni || "-"}</td>
                                <td>{u.rol || "-"}</td>
                                <td>{u.puntos ?? 0}</td>
                                <td>{u.aprobado ? "✅" : "❌"}</td>
                                <td>
                                    <button
                                        className={`btn btn-sm ${u.aprobado ? "btn-secondary" : "btn-success"}`}
                                        onClick={() => cambiarAprobado(u.uid, !u.aprobado)}
                                    >
                                        {u.aprobado ? "Desaprobar" : "Aprobar"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default AdminUsers;
