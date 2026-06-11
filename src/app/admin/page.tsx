"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth"
import LoginGoogle from "@/components/LoginGoogle"
import { obtenerTodosLosTurnos } from "@/lib/turnos"
import { PROFESIONALES, SERVICIOS } from "@/lib/mockData"
import type { Turno } from "@/types"
import { Loader2, LogOut, Calendar, RefreshCw } from "lucide-react"

export default function AdminPage() {
  const {user, cargando, logout} = useAuth()

  if(cargando) {
    return(
      <div className="container mx-auto px-4 py-20 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500 mx-auto"></Loader2>
      </div>
    )
  }

  if(!user) {
    return <LoginGoogle/>
  }

  return <PanelTurnos email= {user.email ?? ""} onLogout={logout}/>
}

function PanelTurnos({
  email,
  onLogout,
} : {
  email: string
  onLogout: () => void
}) {
  const [turnos, setTurnos] = useState<Turno[]>([])
  const [ cargando, setCargando] = useState(true)
  const [ error, setError] = useState<string | null>(null)

  async function cargarTurnos() {
    setCargando(true)
    setError(null)
    try {
      const datos = await obtenerTodosLosTurnos()
      setTurnos(datos)
    } catch(e) {
      setError("No se pudieron cargar los turnos")
    } finally {
      setCargando(false)
    }
  }
  useEffect(() => {
    cargarTurnos();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calendar className="w-8 h-8 text-primary-500" />
            Agenda de turnos
          </h1>
          <p className="text-gray-600 text-sm mt-1">{email}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={cargarTurnos}
            className="inline-flex items-center gap-2 text-gray-700 hover:text-primary-600 text-sm border border-gray-300 rounded-md px-3 py-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Actualizar
          </button>
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-2 text-gray-700 hover:text-red-600 text-sm border border-gray-300 rounded-md px-3 py-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Salir
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      {cargando ? (
        <div className="text-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500 mx-auto" />
        </div>
      ) : turnos.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p>Todavía no hay turnos reservados.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <Th>Fecha</Th>
                <Th>Hora</Th>
                <Th>Mascota</Th>
                <Th>Cliente</Th>
                <Th>Servicio</Th>
                <Th>Profesional</Th>
                <Th>Estado</Th>
              </tr>
            </thead>
            <tbody>
              {turnos.map((turno) => {
                const servicio = SERVICIOS.find((s) => s.id === turno.servicioId);
                const profesional = PROFESIONALES.find((p) => p.id === turno.profesionalId);
                return (
                  <tr key={turno.id} className="border-b border-gray-100 last:border-0">
                    <Td>{turno.fecha}</Td>
                    <Td>{turno.horario}</Td>
                    <Td>
                      {turno.mascota.nombre}
                      <span className="text-gray-400 text-xs ml-1">
                        ({turno.mascota.especie})
                      </span>
                    </Td>
                    <Td>
                      {turno.cliente.nombre}
                      <span className="block text-gray-400 text-xs">
                        {turno.cliente.telefono}
                      </span>
                    </Td>
                    <Td>{servicio?.nombre ?? "—"}</Td>
                    <Td>{profesional?.nombre ?? "—"}</Td>
                    <Td>
                      <EstadoBadge estado={turno.estado} />
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left font-semibold text-gray-700 px-4 py-3 whitespace-nowrap">
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3 text-gray-800 align-top">{children}</td>;
}

function EstadoBadge({ estado }: { estado: Turno["estado"] }) {
  const estilos = {
    pendiente: "bg-yellow-100 text-yellow-800",
    confirmado: "bg-green-100 text-green-800",
    cancelado: "bg-gray-100 text-gray-500",
  };
  return (
    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${estilos[estado]}`}>
      {estado}
    </span>
  );
}