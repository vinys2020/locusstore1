import React, { useEffect, useState } from "react";
import {
    collection,
    onSnapshot,
    updateDoc,
    doc,
    getDocs
} from "firebase/firestore";
import { db } from "../config/firebase";

const AdminUsers = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [expandedUser, setExpandedUser] = useState(null);
    const [cupones, setCupones] = useState({});

    // Escuchar usuarios en tiempo real
    useEffect(() => {
        const usuariosRef = collection(db, "usuarios");
        const unsubscribe = onSnapshot(
            usuariosRef,
            (snapshot) => {
                const lista = snapshot.docs.map((doc) => ({
                    uid: doc.id,
                    ...doc.data(),
                }));
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
                prev.map((u) =>
                    u.uid === uid ? { ...u, aprobado: valor } : u
                )
            );
        } catch (err) {
            console.error("Error al actualizar aprobado:", err);
        }
    };

    const usuariosFiltrados = usuarios.filter((u) => {
        if (!busqueda) return true;
        return (
            (u.nombreCompleto &&
                u.nombreCompleto
                    .toLowerCase()
                    .includes(busqueda.toLowerCase())) ||
            (u.email &&
                u.email.toLowerCase().includes(busqueda.toLowerCase())) ||
            (u.dni && u.dni.includes(busqueda))
        );
    });

    const toggleExpand = async (uid) => {
        if (expandedUser === uid) {
            setExpandedUser(null);
            return;
        }

        setExpandedUser(uid);

        if (!cupones[uid]) {
            const cuponesRef = collection(
                db,
                "usuarios",
                uid,
                "cuponesid"
            );
            const snap = await getDocs(cuponesRef);
            const lista = snap.docs.map((d) => ({
                id: d.id,
                ...d.data(),
            }));
            setCupones((prev) => ({ ...prev, [uid]: lista }));
        }
    };

    return (
        <section className="cards shadow-sm rounded-4 p-3 bg-white mb-5">
            <h2 className="text-center mb-4 text-black">
                Gestión de Usuarios
            </h2>

            <input
                type="text"
                className="form-control mb-3"
                placeholder="Buscar por nombre, email o DNI..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
            />

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
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuariosFiltrados.map((u) => (
                            <React.Fragment key={u.uid}>
                                <tr>
                                    <td>{u.nombreCompleto}</td>
                                    <td>{u.email}</td>
                                    <td>{u.dni || "-"}</td>
                                    <td>{u.rol || "-"}</td>
                                    <td>{u.puntos ?? 0}</td>
                                    <td>{u.aprobado ? "✅" : "❌"}</td>
                                    <td>
                                        <button
                                            className={`btn btn-sm ${u.aprobado
                                                    ? "btn-secondary"
                                                    : "btn-success"
                                                } me-1`}
                                            onClick={() =>
                                                cambiarAprobado(
                                                    u.uid,
                                                    !u.aprobado
                                                )
                                            }
                                        >
                                            {u.aprobado
                                                ? "Desaprobar"
                                                : "Aprobar"}
                                        </button>

                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() =>
                                                toggleExpand(u.uid)
                                            }
                                        >
                                            {expandedUser === u.uid
                                                ? "Ocultar"
                                                : "Ver Info"}
                                        </button>
                                    </td>
                                </tr>

                                {expandedUser === u.uid && (
                                    <tr className="bg-light">
                                        <td colSpan="7">
                                            <strong>
                                                <i className="bi bi-info-circle me-2"></i>
                                                Información completa
                                            </strong>
                                            <ul className="mb-2">
                                                <li>
                                                    <b>
                                                        Fecha Nacimiento:
                                                    </b>{" "}
                                                    {u.fechaNacimiento}
                                                </li>
                                                <li>
                                                    <b>Dirección:</b>{" "}
                                                    {u.posgeo}
                                                </li>
                                                <li>
                                                    <b>Localidad:</b>{" "}
                                                    {u.domposgeo}
                                                </li>
                                                <li>
                                                    <b>Organismo:</b>{" "}
                                                    {u.organismo}
                                                </li>
                                                <li>
                                                    <b>Gremio:</b>{" "}
                                                    {u.gremio}
                                                </li>
                                                <li>
                                                    <b>
                                                        Fecha Afiliación:
                                                    </b>{" "}
                                                    {u.fechaAfiliacion
                                                        ?.toDate?.()
                                                        .toLocaleDateString()}
                                                </li>
                                            </ul>

                                            <strong>
                                                <i className="bi bi-ticket-perforated me-2"></i>
                                                Cupones
                                            </strong>                                            {cupones[u.uid]?.length ? (
                                                <ul>
                                                    {cupones[u.uid].map(
                                                        (c) => (
                                                            <li key={c.id}>
                                                                {c.codigo ||
                                                                    c.id}{" "}
                                                                –{" "}
                                                                {c.descuento ||
                                                                    "Sin dato"}
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            ) : (
                                                <p className="text-muted mb-0">
                                                    No tiene cupones
                                                </p>
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default AdminUsers;
