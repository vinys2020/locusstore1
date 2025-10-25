import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8A2BE2", "#E91E63"];

const EstadisticasAdm = () => {
  const [pedidos, setPedidos] = useState([]);
  const [pedidosPorDia, setPedidosPorDia] = useState([]);
  const [ingresosPorDia, setIngresosPorDia] = useState([]);
  const [estadosPedidos, setEstadosPedidos] = useState([]);
  const [metodosPago, setMetodosPago] = useState([]);
  const [productosVendidos, setProductosVendidos] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");

  // Función para formatear fecha a dd/mm/yyyy
  const formatearFecha = (fecha) => {
    const [year, month, day] = fecha.split("-");
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "pedidos"));
      const pedidosData = snapshot.docs.map(doc => doc.data());
      setPedidos(pedidosData);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (pedidos.length === 0) return;

    // Si hay fecha seleccionada, filtrar pedidos solo de ese día
    let pedidosFiltrados = pedidos;

    if (fechaSeleccionada) {
      const fechaBuscada = formatearFecha(fechaSeleccionada);
      pedidosFiltrados = pedidos.filter(pedido => {
        if (!pedido.fecha) return false;
        const fechaPedido = pedido.fecha.toDate();
        const fechaFormateada = fechaPedido.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
        return fechaFormateada === fechaBuscada;
      });
    }

    // Generar pedidosPorDia y ingresosPorDia (para la gráfica de línea y barras)
    const pedidosDiaMap = {};
    const ingresosDiaMap = {};

    // Para estados, métodos y productos
    const estadoMap = {};
    const metodoMap = {};
    const productoMap = {};

    pedidosFiltrados.forEach(pedido => {
      if (!pedido.fecha) return;

      const fecha = pedido.fecha.toDate();
      const key = fecha.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });

      pedidosDiaMap[key] = (pedidosDiaMap[key] || 0) + 1;
      ingresosDiaMap[key] = (ingresosDiaMap[key] || 0) + (pedido.totalpedido || 0);

      const estado = (pedido.estado || "Desconocido").toLowerCase().trim();
      estadoMap[estado] = (estadoMap[estado] || 0) + 1;

      const metodo = (pedido.metodopago || "No especificado").toLowerCase();
      metodoMap[metodo] = (metodoMap[metodo] || 0) + 1;

      pedido.productos?.forEach(producto => {
        const nombre = producto.nombre || "Producto";
        productoMap[nombre] = (productoMap[nombre] || 0) + producto.cantidad;
      });
    });

    const ordenarPorFecha = (a, b) => {
      const [d1, m1, y1] = a.name.split("/").map(Number);
      const [d2, m2, y2] = b.name.split("/").map(Number);
      return new Date(y1, m1 - 1, d1) - new Date(y2, m2 - 1, d2);
    };

    setPedidosPorDia(
      Object.entries(pedidosDiaMap).map(([name, pedidos]) => ({ name, pedidos })).sort(ordenarPorFecha)
    );

    setIngresosPorDia(
      Object.entries(ingresosDiaMap).map(([name, ingresos]) => ({ name, ingresos })).sort(ordenarPorFecha)
    );

    setEstadosPedidos(
      Object.entries(estadoMap).map(([name, value]) => ({ name, value }))
    );

    setMetodosPago(
      Object.entries(metodoMap).map(([name, value]) => ({ name, value }))
    );

    setProductosVendidos(
      Object.entries(productoMap)
        .map(([name, cantidad]) => ({ name, cantidad }))
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, 5)
    );

  }, [pedidos, fechaSeleccionada]);

  return (
    <section className="container my-5">
      <div className="bg-white p-4 rounded shadow-sm">
        <h2 className="text-center mb-4 text-dark">Estadísticas de Pedidos</h2>

        <div className="mb-4 d-flex justify-content-center">
          <div className="d-flex align-items-center gap-2">
            <label htmlFor="fecha" className="form-label m-0 fw-bold text-dark">Filtrar:</label>
            <input
              type="date"
              id="fecha"
              className="form-control"
              value={fechaSeleccionada}
              onChange={(e) => setFechaSeleccionada(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-5">
          <h4 className="text-dark">📦 Pedidos por día</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={pedidosPorDia.length ? pedidosPorDia : [{ name: fechaSeleccionada ? formatearFecha(fechaSeleccionada) : "", pedidos: 0 }]}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="pedidos" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mb-5">
          <h4 className="text-dark">💰 Ingresos por día</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ingresosPorDia.length ? ingresosPorDia : [{ name: fechaSeleccionada ? formatearFecha(fechaSeleccionada) : "", ingresos: 0 }]}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="ingresos" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="row">
          <div className="col-md-6 mb-5">
            <h4 className="text-dark">📌 Estados de pedidos</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={estadosPedidos.length ? estadosPedidos : [{ name: "Sin datos", value: 1 }]} dataKey="value" nameKey="name" outerRadius={100} label>
                  {estadosPedidos.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="col-md-6 mb-5">
            <h4 className="text-dark">💳 Métodos de pago</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={metodosPago.length ? metodosPago : [{ name: "Sin datos", value: 1 }]} dataKey="value" nameKey="name" outerRadius={100} label>
                  {metodosPago.map((entry, index) => (
                    <Cell key={index} fill={COLORS[(index + 3) % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mb-5">
          <h4 className="text-dark">🔥 Productos más vendidos</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productosVendidos.length ? productosVendidos : [{ name: "Sin datos", cantidad: 0 }]}>
              <CartesianGrid stroke="#ccc"/>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                contentStyle={{ backgroundColor: "#fff", color: "#000", border: "1px solid #ccc" }}
                itemStyle={{ color: "orange" }}
                labelStyle={{ color: "#000" }}
                />              
              <Bar dataKey="cantidad" fill="#ff7300" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </section>
  );
};

export default EstadisticasAdm;
