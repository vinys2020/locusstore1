import { useEffect, useState } from "react";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";
import { 
    FaMoneyBillWave, 
    FaCreditCard,    
    FaUsers          
  } from "react-icons/fa";
  import { 
    BiTrendingUp,       
    BiShoppingBag,      
    BiBarChartAlt2,     
    BiMoney,            
    BiListCheck,        
    BiTime,             
    BiCheckCircle,      
    BiPackage           
  } from "react-icons/bi";
  












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
    const [totalFinanciadoPendiente, setTotalFinanciadoPendiente] = useState(0);
    const [totalPagadoContado, setTotalPagadoContado] = useState(0);

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
            let sumaFinanciadoPendiente = 0;
            let sumaPagadoContado = 0;

            const contadorProductosVendidos = {};

            snapshot.forEach((doc) => {
                const pedido = doc.data();
                ventasTotales += pedido.totalpedido || pedido.montoTotal || 0;
              
                if (pedido.estado === "completado") listos++;
                if (pedido.estado === "En preparación") enpreparacion++;
                if (pedido.estado === "pendiente") pendientes++;
              
                // 🗓️ Ventas del mes actual
                if (pedido.fecha && pedido.fecha.toDate) {
                  const fechaPedido = pedido.fecha.toDate();
                  if (fechaPedido >= inicioMes && fechaPedido <= ahora) {
                    pedidosMes++;
                    if (pedido.estado === "completado") {
                      ventasMes += pedido.totalpedido || pedido.montoTotal || 0;
                    }
                  }
                }
              
                // 💳 Clasificación real de pagos
// 💳 Clasificación real de pagos
const parseARSMoney = (valor) => {
    if (!valor) return 0;
    if (typeof valor === "number") return valor;
    // Convierte string ARS "423.748,27" -> 423748.27
    return Number(valor.toString().replace(/\./g, "").replace(",", ".")) || 0;
};

const restanteNum = parseARSMoney(pedido.montoRestante);
if (restanteNum > 0) {
    sumaFinanciadoPendiente += restanteNum;
} else {
    sumaPagadoContado += parseARSMoney(pedido.totalpedido || pedido.montoTotal);
}

              
                // 🧾 Conteo de productos vendidos
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
            setTotalFinanciadoPendiente(sumaFinanciadoPendiente);
            setTotalPagadoContado(sumaPagadoContado);

            const usuariosSnap = await getDocs(collection(db, "usuarios"));
            setTotalUsuarios(usuariosSnap.size);

            const categoriasSnap = await getDocs(collection(db, "categorias"));
            const categorias = categoriasSnap.docs.map((doc) => doc.id);

            let todosLosProductos = [];
            for (const categoriaId of categorias) {
                const productosSnap = await getDocs(
                    collection(db, "categorias", categoriaId, "Productosid")
                );
                todosLosProductos = todosLosProductos.concat(
                    productosSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
                );
            }
            setTotalProductos(todosLosProductos.length);

            const [productoIdMasVendido, cantidadVendidaMasAlta] = Object.entries(
                contadorProductosVendidos
            ).reduce((max, curr) => (curr[1] > max[1] ? curr : max), ["-", 0]);

            if (productoIdMasVendido !== "-") {
                const productoMasVendidoObj = todosLosProductos.find(
                    (p) => p.id === productoIdMasVendido || p.nombre === productoIdMasVendido
                );
                setProductoMasVendido(
                    productoMasVendidoObj?.nombre || productoIdMasVendido
                );
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
        <section className="row g-3 mb-5 px-lg-5">
            <article className="col-12 col-md-3">
                <div className="card card-orders text-center p-4 shadow-sm rounded-4 scale" style={{ background: "#2d2f41" }}>
                <h5 className="text-white">
  <BiShoppingBag size={24} className="me-2" />
  Pedidos
</h5>                    <h2 className="fw-bold">{totalPedidosMes}</h2>
                    <p className="text-white">Pedidos totales este mes</p>
                </div>
            </article>

            <article className="col-12 col-md-3">
                <div className="card card-sales text-center p-4 shadow-sm rounded-4 scale" style={{ background: "#14532d" }}>
                <h5 className="text-white">
  <BiMoney size={24} className="me-2" />
  Ventas
</h5>                   <h2 className="fw-bold">{formatearDinero(totalVentasMes)}</h2>
                    <p className="text-white">Ingresos este mes</p>
                </div>
            </article>

            <article className="col-12 col-md-3">
                <div className="card card-total-income text-center p-4 shadow-sm rounded-4 scale bg-info">
                <h5 className="text-white">
  <BiBarChartAlt2 size={24} className="me-2" />
  Ingresos Totales
</h5>                     <h2 className="fw-bold text-white">{formatearDinero(ingresosTotales)}</h2>
                    <p className="text-white">Ingresos acumulados</p>
                </div>
            </article>



            

            <article className="col-12 col-md-3">
                <div className="card card-total-orders text-center p-4 shadow-sm rounded-4 scale bg-secondary">
                <h5 className="text-white">
  <BiListCheck size={24} className="me-2" />
  Pedidos Totales
</h5>                    <h2 className="fw-bold text-white">{totalPedidosTotales}</h2>
                    <p className="text-white">Pedidos realizados en total</p>
                </div>
            </article>



            <article className="col-12 col-md-4">
                <div className="card text-center p-4 shadow-sm rounded-4 scale bg-danger">
                <h5 className="text-white">
  <BiTime size={24} className="me-2" />
  Pedidos Pendientes
</h5>                    <h2 className="fw-bold text-white">{pedidosPendientes}</h2>
                    <p className="text-white">Pedidos con estado pendiente</p>
                </div>
            </article>

            <article className="col-12 col-md-4">
                <div className="card text-center p-4 shadow-sm rounded-4 scale bg-success">
                <h5 className="text-white">
  <BiCheckCircle size={24} className="me-2" />
  Pedidos Listos
</h5>                    <h2 className="fw-bold text-white">{pedidosListos}</h2>
                    <p className="text-white">Pedidos finalizados</p>
                </div>
            </article>

            <article className="col-12 col-md-4">
                <div className="card card-products text-center p-4 shadow-sm rounded-4 scale bg-light">
                <h5 className="text-black">
  <BiPackage size={24} className="me-2" />
  Productos Registrados
</h5>                    <h2 className="fw-bold text-black">{totalProductos}</h2>
                    <p className="text-black">Productos disponibles</p>
                </div>
            </article>

                                    {/* 💳 Total Financiado Pendiente */}
                                    <article className="col-12 col-md-6">
                <div className="card text-center p-4 shadow-sm rounded-4 scale" style={{ background: "#b91c1c" }}>
                <h5 className="text-white">
  <FaCreditCard size={24} className="me-2" />
  Total Financiado Pendiente
</h5>                    <h2 className="fw-bold text-white">{formatearDinero(totalFinanciadoPendiente)}</h2>
                    <p className="text-white">Monto restante de cuotas por cobrar</p>
                </div>
            </article>

            {/* 💰 Total Pagado al Contado */}
            <article className="col-12 col-md-6">
                <div className="card text-center p-4 shadow-sm rounded-4 scale" style={{ background: "#14532d" }}>
                <h5 className="text-white">
  <FaMoneyBillWave size={24} className="me-2" />
  Total Pagado al Contado
</h5>                <h2 className="fw-bold text-white">{formatearDinero(totalPagadoContado)}</h2>
                    <p className="text-white">Monto recibido en pagos completos</p>
                </div>
            </article>

            <article className="col-12 col-md-4">
                <div className="card card-users text-center p-4 shadow-sm rounded-4 scale" style={{ background: "#273c75" }}>
                <h5 className="text-white">
  <FaUsers size={24} className="me-2" />
  Usuarios
</h5>                    <h2 className="fw-bold">{totalUsuarios}</h2>
                    <p className="text-white">Usuarios registrados</p>
                </div>
            </article>

            <article className="col-12 col-md-8">
                <div className="card card-best-product text-center p-4 shadow-sm rounded-4 scale bg-primary">
                <h5 className="text-white">
  <BiTrendingUp size={24} className="me-2" />
  Producto más vendido
</h5>                    <h2 className="fw-bold text-white">{unidadesVendidas} uds</h2>
                    <p className="text-white">{productoMasVendido}</p>
                </div>
            </article>




        </section>
    );
};

export default ResumenEstadisticas;
