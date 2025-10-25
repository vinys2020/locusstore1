import { useEffect, useState } from "react";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";

const ResumenEstadisticas = () => {
    const [totalPedidosMes, setTotalPedidosMes] = useState(0);
    const [totalPedidosTotales, setTotalPedidosTotales] = useState(0);
    const [totalUsuarios, setTotalUsuarios] = useState(0);
    const [totalVentasMes, setTotalVentasMes] = useState(0);
    const [ingresosTotales, setIngresosTotales] = useState(0);
    const [pedidosListos, setPedidosListos] = useState(0);
    const [pedidosEnPreparacion, setPedidosEnPreparacion] = useState(0);
    const [pedidosPendientes, setPedidosPendientes] = useState(0);
    const [totalProductos, setTotalProductos] = useState(0);
    const [productoMasVendido, setProductoMasVendido] = useState("-");
    const [unidadesVendidas, setUnidadesVendidas] = useState(0);

    useEffect(() => {
        const ahora = new Date();
        const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);

        const unsubscribe = onSnapshot(collection(db, "pedidos"), async (snapshot) => {
            setTotalPedidosTotales(snapshot.size);

            let pedidosMes = 0;
            let ventasMes = 0;
            let ventasTotales = 0;
            let listos = 0;
            let enpreparacion = 0;
            let pendientes = 0;
            const contadorProductosVendidos = {};

            snapshot.forEach(doc => {
                const pedido = doc.data();
                ventasTotales += pedido.totalpedido || 0;

                if (pedido.estado === "completado") listos++;
                if (pedido.estado === "En preparación") enpreparacion++;
                if (pedido.estado === "pendiente") pendientes++;

                if (pedido.fecha && pedido.fecha.toDate) {
                    const fechaPedido = pedido.fecha.toDate();
                    if (fechaPedido >= inicioMes && fechaPedido <= ahora) {
                        pedidosMes++;

                        if (pedido.estado === "completado") {
                            ventasMes += pedido.totalpedido || 0;
                        }
                    }
                }

                const productosDelPedido = pedido.productos || pedido.items || [];
                productosDelPedido.forEach(({ productoId, id, cantidad, nombre }) => {
                    const pid = productoId || id || nombre || "Producto Desconocido";
                    const cant = cantidad || 0;
                    contadorProductosVendidos[pid] = (contadorProductosVendidos[pid] || 0) + cant;
                });
            });

            setPedidosListos(listos);
            setPedidosEnPreparacion(enpreparacion);
            setPedidosPendientes(pendientes);
            setTotalPedidosMes(pedidosMes);
            setTotalVentasMes(ventasMes);
            setIngresosTotales(ventasTotales);

            const usuariosSnap = await getDocs(collection(db, "usuarios"));
            setTotalUsuarios(usuariosSnap.size);

            const categoriasSnap = await getDocs(collection(db, "categorias"));
            const categorias = categoriasSnap.docs.map(doc => doc.id);

            let todosLosProductos = [];
            for (const categoriaId of categorias) {
                const productosSnap = await getDocs(collection(db, "categorias", categoriaId, "Productosid"));
                todosLosProductos = todosLosProductos.concat(
                    productosSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                );
            }
            setTotalProductos(todosLosProductos.length);

            const [productoIdMasVendido, cantidadVendidaMasAlta] = Object.entries(contadorProductosVendidos).reduce(
                (max, curr) => (curr[1] > max[1] ? curr : max),
                ["-", 0]
            );

            if (productoIdMasVendido !== "-") {
                const productoMasVendidoObj = todosLosProductos.find(p => p.id === productoIdMasVendido || p.nombre === productoIdMasVendido);
                setProductoMasVendido(productoMasVendidoObj?.nombre || productoIdMasVendido);
                setUnidadesVendidas(cantidadVendidaMasAlta);
            } else {
                setProductoMasVendido("-");
                setUnidadesVendidas(0);
            }
        });

        return () => unsubscribe();
    }, []);

    const formatearDinero = (num) =>
        num.toLocaleString("es-AR", { style: "currency", currency: "ARS" });

    return (
        <section className="row g-3 mb-5 px-lg-4">

            <article className="col-12 col-md-3">
                <div className="card card-orders text-center p-4 shadow-sm rounded-4 scale" style={{background:"#2d2f41"}}>
                    <h5>📦 Pedidos</h5>
                    <h2 className="fw-bold">{totalPedidosMes}</h2>
                    <p className="text-white">Pedidos totales este mes</p>
                </div>
            </article>

            <article className="col-12 col-md-3">
                <div className="card card-sales text-center p-4 shadow-sm rounded-4 scale" style={{background:"#14532d"}}>
                    <h5>💸 Ventas</h5>
                    <h2 className="fw-bold">{formatearDinero(totalVentasMes)}</h2>
                    <p className="text-white">Ingresos este mes</p>
                </div>
            </article>

            <article className="col-12 col-md-3">
                <div className="card card-total-income text-center p-4 shadow-sm rounded-4 scale bg-info">
                    <h5 className="text-white">🏦 Ingresos Totales</h5>
                    <h2 className="fw-bold text-white">{formatearDinero(ingresosTotales)}</h2>
                    <p className="text-white">Ingresos acumulados</p>
                </div>
            </article>

            <article className="col-12 col-md-3">
                <div className="card card-total-orders text-center p-4 shadow-sm rounded-4 scale bg-secondary">
                    <h5 className="text-white">📋 Pedidos Totales</h5>
                    <h2 className="fw-bold text-white">{totalPedidosTotales}</h2>
                    <p className="text-white">Pedidos realizados en total</p>
                </div>
            </article>


            <article className="col-12 col-md-4">
                <div className="card text-center p-4 shadow-sm rounded-4 scale bg-danger">
                    <h5 className="text-white">📥 Pedidos Pendientes</h5>
                    <h2 className="fw-bold text-white">{pedidosPendientes}</h2>
                    <p className="text-white">Pedidos con estado pendiente</p>
                </div>
            </article>



            <article className="col-12 col-md-4">
                <div className="card text-center p-4 shadow-sm rounded-4 scale bg-success">
                    <h5 className="text-white">✅ Pedidos Listos</h5>
                    <h2 className="fw-bold text-white">{pedidosListos}</h2>
                    <p className="text-white">Pedidos finalizados</p>
                </div>
            </article>

            <article className="col-12 col-md-4">
                <div className="card card-products text-center p-4 shadow-sm rounded-4 scale bg-light">
                    <h5>Productos Registrados</h5>
                    <h2 className="fw-bold text-black">{totalProductos}</h2>
                    <p className="text-black">Productos disponibles</p>
                </div>
            </article>

            <article className="col-12 col-md-4">
                <div className="card card-users text-center p-4 shadow-sm rounded-4 scale" style={{background:"#273c75"}}>
                    <h5>👥 Usuarios</h5>
                    <h2 className="fw-bold">{totalUsuarios}</h2>
                    <p className="text-white">Usuarios registrados</p>
                </div>
            </article>

            <article className="col-12 col-md-8">
                <div className="card card-best-product text-center p-4 shadow-sm rounded-4 scale bg-primary">
                    <h5 className="text-white">🏆 Producto más vendido</h5>
                    <h2 className="fw-bold text-white">{unidadesVendidas} uds</h2>
                    <p className="text-white">{productoMasVendido}</p>
                </div>
            </article>

        </section>
    );
};

export default ResumenEstadisticas;
