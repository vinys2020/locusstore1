import React, { useEffect, useState } from "react";
import { obtenerCuponesUsuario } from "../utils/obtenerCuponesUsuario";
import { useAuth } from "../hooks/useAuth"; // o donde tengas la info del usuario
import { Card, CardContent } from "@/components/ui/card";
import { BadgePercent } from "lucide-react";

const CuponesUsuario = () => {
  const { user } = useAuth();
  const [cupones, setCupones] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setCupones([]);
      setCargando(false);
      return;
    }

    const fetchCupones = async () => {
      setCargando(true);
      try {
        const cuponesDisponibles = await obtenerCuponesUsuario(user.uid);
        // Ordenar por fechaCompra descendente (los más recientes primero)
        cuponesDisponibles.sort((a, b) => {
          if (!a.fechaCompra) return 1;
          if (!b.fechaCompra) return -1;
          return new Date(b.fechaCompra) - new Date(a.fechaCompra);
        });
        setCupones(cuponesDisponibles);
      } catch (error) {
        console.error("Error al obtener cupones:", error);
        setCupones([]);
      }
      setCargando(false);
    };

    fetchCupones();
  }, [user]);

  if (cargando) return <p className="text-center">Cargando cupones...</p>;

  if (cupones.length === 0)
    return (
      <p className="text-center text-sm text-muted-foreground">
        No tenés cupones disponibles por ahora.
      </p>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cupones.map((cupon) => (
        <Card
          key={cupon.id}
          className={`border ${
            cupon.usado
              ? "bg-gray-200 border-gray-400"
              : "bg-yellow-100 border-yellow-400"
          } shadow-sm`}
        >
          <CardContent className="p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <BadgePercent
                className={cupon.usado ? "text-gray-600" : "text-yellow-800"}
              />
              <h3
                className={`text-lg font-bold ${
                  cupon.usado ? "text-gray-600" : "text-yellow-900"
                }`}
              >
                {cupon.nombre || "Cupón de descuento"}
              </h3>
            </div>
            <p className={`text-sm ${cupon.usado ? "text-gray-600" : "text-yellow-800"}`}>
              Descuento: <strong>{cupon.descuento}%</strong>
            </p>
            <p className={`text-xs ${cupon.usado ? "text-gray-500" : "text-yellow-700"}`}>
              {cupon.usado ? "Cupón usado" : "Cupón disponible para usar"}
            </p>
            {cupon.fechaCompra && (
              <p className={`text-xs mt-1 ${cupon.usado ? "text-gray-500" : "text-yellow-700"}`}>
                Fecha de compra:{" "}
                {new Date(cupon.fechaCompra).toLocaleDateString("es-AR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CuponesUsuario;
