import { useEffect, useState } from "react";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const PagosCuotas = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "pedidos"), (snapshot) => {
      const lista = snapshot.docs.map((docSnap) => {
        const pedido = docSnap.data();

        const productosEnCuotas =
          pedido.productos?.filter((p) => p.metodo?.includes("cuotas")) || [];

        const maxCuotas = Math.max(
          ...productosEnCuotas.map((p) => parseInt(p.descripcionPago) || 0),
          1
        );

        const cuotasDistribuidas = Array(maxCuotas).fill(0);

        productosEnCuotas.forEach((p) => {
          const n = parseInt(p.descripcionPago);
          const valorPorCuota = (p.total || 0) / n;
          for (let i = 0; i < maxCuotas; i++) {
            cuotasDistribuidas[i] += valorPorCuota * (i < n ? 1 : 0);
          }
        });

        const cuotas = [
          {
            descripcion: `${maxCuotas} cuotas`,
            total: cuotasDistribuidas.reduce((a, b) => a + b, 0),
            distribucion: cuotasDistribuidas,
          },
        ];

        const total = cuotas[0].total;

        if (maxCuotas <= 1) return null;

        return {
          id: docSnap.id,
          nombre: pedido.nombre || pedido.Cliente?.nombre || "Desconocido",
          email: pedido.email || pedido.Cliente?.email || "Sin email",
          telefono: pedido.telefono || pedido.Cliente?.telefono || "-",
          estado: pedido.estado,
          metodoPago: pedido.metodopago,
          fecha: pedido.fecha?.toDate
            ? pedido.fecha.toDate().toLocaleDateString("es-AR")
            : "-",
          cuotas,
          total,
          maxCuotas,
          cuotasPagadas: pedido.cuotasPagadas || [],
          montoRestante:
            pedido.montoRestante != null
              ? pedido.montoRestante
              : cuotas.reduce((acc, c) => acc + c.total, 0),
        };
      });

      setPedidos(lista.filter(Boolean));
    });

    return () => unsubscribe();
  }, []);

  const formatearDinero = (num) =>
    num.toLocaleString("es-AR", { style: "currency", currency: "ARS" });

  const pagarCuota = async (pedidoId, monto, indiceCuota) => {
    const pedidoRef = doc(db, "pedidos", pedidoId);
    const pedidoActual = pedidos.find((p) => p.id === pedidoId);
    if (!pedidoActual) return;

    const montoRedondeado = Number(monto.toFixed(2));

    const nuevaCuota = {
      indice: indiceCuota + 1,
      fecha: new Date(),
      monto: montoRedondeado,
    };

    const cuotasPagadasActualizadas = [
      ...(pedidoActual.cuotasPagadas || []),
      nuevaCuota,
    ];

    const montoTotalPagado = cuotasPagadasActualizadas.reduce(
      (acc, cp) => acc + cp.monto,
      0
    );

    const montoRestanteNumero = Number(
      ((pedidoActual.total || 0) - montoTotalPagado).toFixed(2)
    );

    const montoRestante = montoRestanteNumero.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
    });

    await updateDoc(pedidoRef, {
      cuotasPagadas: cuotasPagadasActualizadas,
      montoRestante: montoRestanteNumero,
      estadoPago: montoRestanteNumero <= 0 ? "completado" : "pendiente",
    });

    setPedidos((prev) =>
      prev.map((p) =>
        p.id === pedidoId
          ? {
              ...p,
              cuotasPagadas: cuotasPagadasActualizadas,
              montoRestante: montoRestante,
            }
          : p
      )
    );
  };

  return (
    <section className="col-12 mt-5">
      <div className="card shadow-sm rounded-4 p-3 bg-light">
        <h4 className="mb-3 text-center text-black fw-bold">Pagos en Cuotas</h4>

        {pedidos.length === 0 ? (
          <p className="text-center text-muted">
            No hay pagos en cuotas registrados.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Cliente</th>
                  <th>Pedido</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Estado</th>
                  <th>Cuotas</th>
                  <th>Total</th>
                  <th>Restante</th>
                  <th>Método</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((p) => (
                  <tr key={p.id}>
                    <td>{p.nombre}</td>
                    <td className="small border">{p.id}</td>
                    <td className="small border">{p.email}</td>
                    <td className="small border">{p.telefono}</td>
                    <td className="small border">
                      <span
                        className={`badge ${
                          p.estado === "completado"
                            ? "bg-success"
                            : p.estado === "pendiente"
                            ? "bg-warning text-dark"
                            : "bg-secondary"
                        }`}
                      >
                        {p.estado}
                      </span>
                    </td>
                    <td className="small border">
                      {p.cuotas.map((c, i) => (
                        <div key={i}>
                          <span className="badge me-1 bg-warning text-dark">
                            {c.descripcion} - Total {formatearDinero(c.total)}
                          </span>
                          <div className="mt-1">
                            {c.distribucion.map((monto, idx) => {
                              const pagada = Array.isArray(p.cuotasPagadas)
                                ? p.cuotasPagadas.some(
                                    (cp) => cp.indice === idx + 1
                                  )
                                : false;
                              return (
                                <span
                                  key={idx}
                                  className={`badge mt-1 me-1 ${
                                    pagada
                                      ? "bg-success"
                                      : "bg-warning text-dark"
                                  }`}
                                >
                                  {idx + 1}: {formatearDinero(monto)}
                                  {!pagada && (
                                    <button
                                      className="btn btn-sm ms-1 btn-outline-success py-0"
                                      onClick={() =>
                                        pagarCuota(p.id, monto, idx)
                                      }
                                    >
                                      Pago cuota
                                    </button>
                                  )}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </td>
                    <td className="small border">{formatearDinero(p.total)}</td>
                    <td className="small border">
                      {p.montoRestante != null
                        ? formatearDinero(p.montoRestante)
                        : "-"}
                    </td>
                    <td className="small border">{p.metodoPago}</td>
                    <td className="small border">{p.fecha}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default PagosCuotas;
