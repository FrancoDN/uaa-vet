import Link from "next/link"
import {Calendar, Clock, MapPin, PhoneCall} from 'lucide-react'

export default function HomePage() {
  return(
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white">
        <div className="container mx-auto px-4 py-20 max-w-5xl">
          <div className="text-center">
            <p className="text-sm font-semibold text-primary-600 tracking-widest uppercase mb-4">
              Veterinaria de Barrio
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Sacá turno online <br className="hidden md:block"/>
              sin tener que llamar.
            </h1>
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
              Atención clínica, vacunación y cirugías menores.
              Elegí día y horario.
            </p>

            <Link
              href="/turnos"
              className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold px-8 py-4 rounded-lg"
            >
              <Calendar className="w-5 h-5">Reservar Turno</Calendar>
            </Link>
          </div>
        </div>
      </section>

      {/* Info cards */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-3 gap-6">
            <InfoCard
              icon={<Clock className="w-6 h-6"/>}
              title="Horarios"
              lines={[
                "Lunes a Viernes: 09:00 a 19:00",
                "Sábados: 09:00 a 13:00"
              ]}
            >
            </InfoCard>

            <InfoCard
              icon={<MapPin className="w-6 h-6"/>}
              title="Ubiación"
              lines={["Av. Independencia", "Mar del Plata, Buenos Aires"]}
            >
            </InfoCard>

            <InfoCard
              icon={<PhoneCall className="w-6 h-6"/>}
              title="Urgencias"
              lines={["+54 223 555-1234", "WhatsApp disponible"]}
            >
            </InfoCard>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Servicios disponibles
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {SERVICIOS.map((s) => (
              <div
                key={s.nombre}
                className="bg-white rounded-lg p-6 border border-gray-200"
              >
                <h3 className="font-semibold text-lg mb-1">{s.nombre}</h3>
                <p className="text-gray-600 text-sm">{s.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function InfoCard({
  icon,
  title,
  lines,
} : {
  icon: React.ReactNode;
  title: string;
  lines: string[];
}) {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="text-primary-500 mb-3">
        {icon}
      </div>
      <h3 className="font-semibold text-lg mb-2">
        {title}
      </h3>
      {lines.map((line) => (
        <p key={line} className="text-gray-600 text-sm"> {line}</p>
      ))}
    </div>
  )
}

const SERVICIOS = [
  {
    nombre: "Consulta clinica general",
    descripcion: "Diagnostico y tratamiento de enfermedades comunes"
  },
  {
    nombre: "Vacunacion",
    descripcion: "Esquemas completos para perros y gatos"
  },
  {
    nombre: "Cirugias menores",
    descripcion: "Castracion, extracciones, suturas"
  },
  {
    nombre: "Control general",
    descripcion: "Chequeos preventivos"
  },
]