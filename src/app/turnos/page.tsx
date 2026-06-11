"use client"

import {use, useEffect, useState} from 'react'
import {useForm} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Calendar, CheckCircle2, Loader2} from 'lucide-react'
import { turnoSchema, type TurnoFormData} from '@/lib/validations'  
import { PROFESIONALES, SERVICIOS} from "@/lib/mockData"
import { crearTurno, obtenerFranjasDisponibles} from '@/lib/turnos'
import type { FranjaHoraria } from '@/types'

export default function TurnosPage() {
    const [enviando, setEnviando ] = useState(false)
    const [turnoConfirmado, setTurnoConfirmado] = useState<TurnoFormData | null>(null)
    const [error, setError] = useState<string | null>(null)

    const [franjas, setFranjas] = useState<FranjaHoraria[]>([])
    const [cargandoFranjas, setCargandoFranjas] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
        reset,
    } = useForm<TurnoFormData>({
        resolver: zodResolver(turnoSchema),
        defaultValues: {
            mascotaNombre: "",
            especie: undefined,
            raza: "",
            clienteNombre:"",
            telefono: "",
            email: "",
            servicioId: "",
            profesionalId: "",
            fecha: "",
            horario: "",
        }
    }) 

    const fechaSeleccionada = watch("fecha")
    const horarioSeleccionado = watch("horario")
    
    useEffect(() => {
        if(!fechaSeleccionada) {
            setFranjas([])
            return;
        }

        let activo = true
        setCargandoFranjas(true)
        setValue("horario", "")

        obtenerFranjasDisponibles(fechaSeleccionada).then((resultado) => {
            if (activo) setFranjas(resultado)
        }).catch(() => {
            if (activo) setError("No se pudieron cargar los horarios. Reintenta en unos momentos.")
        }).finally(() => {
            if (activo) setCargandoFranjas(false)
        })

        return () => {
            activo = false
        }
    }, [fechaSeleccionada, setValue])
    

    const hoy = new Date().toISOString().split("T")[0]
    const max = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

    async function onSubmit(data: TurnoFormData) {
        setEnviando(true)
        setError(null)
        try {
            await crearTurno(data)
            setTurnoConfirmado(data)
        } catch(e) {
            setError("Ocurrio un problema al resolver el turno. Intenta mas tarde")
        } finally {
            setEnviando(false)
        }
    }

    // Desarrollamos la pantalla de confirmacion
    if(turnoConfirmado) {
        const servicio = SERVICIOS.find((s) => s.id === turnoConfirmado.servicioId)
        const profesional = PROFESIONALES.find((p) => p.id === turnoConfirmado.profesionalId)

        return (
            <div className='container mx-auto px-4 py-16 max-w-2xl'>
                <div className='bg-primary-50 border-2 border-primary-500 rounder-lg p-8 text-center'>
                    <CheckCircle2 className='w-16 h-16 text-primary-500 mx-auto mb-4'/>
                    <h1 className='text-3xl font-bold mb-2'>
                        Turno reservado
                    </h1>
                    <p className='text-gray-600 mb-6'>
                        Te enviamos un recordatorio por WhatsApp 24hs antes
                    </p>

                    <div className='bg-white rounded-lg p-6 text-left space-y-3'>
                        <Detalle label="Mascota" value={`${turnoConfirmado.mascotaNombre} (${turnoConfirmado.especie})`}/>
                        <Detalle label="Servicio" value={`${servicio?.nombre ?? "-"}`}/>
                        <Detalle label="Profesional" value={profesional?.nombre ?? "-"}/>
                        <Detalle label="Fecha y hora" value={`${turnoConfirmado.fecha} a las ${turnoConfirmado.horario}`}/>
                        <Detalle label="Contacto" value={turnoConfirmado.telefono}/>
                    </div>

                    <button onClick={()=> {
                        reset()
                        setTurnoConfirmado(null)
                        
                    }}
                        className='mt-6 text-primary-600 hover:text-primary-700 font-medium'
                    >
                       Reservar otro turno 
                    </button>
                </div>
            </div>
        )
    }

    // Formulario
    return (
    <div className='container mx-auto px-4 py-12 max-w-2xl'>
        <div className='mb-8'>
            <h1 className='text-3xl font-bold mb-2 flex items-center gap-2'>
                <Calendar className='w-8 h-8 text-primary-800'/>
                Reservar Turno
            </h1>
            <p className='text-gray-600'> Completá los datos. Te responderemos a la brevedad.</p>
        </div>

        {error && (
            <div className='mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm'>
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-8 black'>
            <Seccion titulo="1. Datos de la mascota">
                <Campo label="Nombre de la mascota" error={errors.mascotaNombre?.message}>
                    <input type="text" {...register("mascotaNombre")} placeholder='ej: Firulai' className='input'/>
                </Campo>

                <div className='grid grid-cols-2 gap-4'>
                    <Campo label="Especie" error={errors.especie?.message}>
                        <select {...register("especie")} className='input'>
                            <option value="">Seleccionar</option>
                            <option value="perro">Perro</option>
                            <option value="gato">Gato</option>
                            <option value="otro">Otro</option>
                        </select>
                    </Campo>
                    <Campo label="Raza (opcional)" error={errors.raza?.message}>
                        <input type="text" {...register("raza")} placeholder='ej: Golden' className='input'/>
                    </Campo>
                </div>
            </Seccion>

            <Seccion titulo="2. Tus datos">
                <Campo label="Nombre completo" error={errors.clienteNombre?.message}>
                    <input type="text" {...register("clienteNombre")} placeholder='ej: Juan Perez' className='input'/>
                </Campo>

                <div className='grid grid-cols-2 gap-4'>
                    <Campo label="Teléfono / WhatsApp" error={errors.telefono?.message}>
                        <input type="tel" {...register("telefono")} placeholder='ej: 12345678' className='input'/>
                    </Campo>
                    <Campo label="Email (opcional)" error={errors.email?.message}>
                        <input type="email" {...register("email")} placeholder='ej: perez@gmail.com' className='input'/>
                    </Campo>
                </div>
            </Seccion>

            <Seccion titulo="3. Detalles del turno">
                <Campo label="Servicio" error={errors.servicioId?.message}>
                    <select {...register("servicioId")} className='input'>
                        <option value="">Seleccionar servicio</option>
                        {SERVICIOS.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.nombre} ({s.duracionMinutos} min)
                            </option>
                        ))}
                    </select>
                </Campo>

                <Campo label="Profesional" error={errors.profesionalId?.message}>
                    <select {...register("profesionalId")} className='input'>
                        <option value="">Seleccionar profesional</option>
                        {PROFESIONALES.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.nombre} - {p.especialidad}
                            </option>
                        ))}
                    </select>
                </Campo>

                <Campo label="Fecha" error={errors.fecha?.message}>
                    <input type="date" {...register("fecha")} min={hoy} max={max} className='input'/>
                </Campo>

                {fechaSeleccionada && (
                    <Campo label="Horario disponible" error={errors.horario?.message}>
                        {cargandoFranjas ? (
                            <div className='flex items-center gap-2 text-gray-500 text-sm py-2'>
                                <Loader2 className='w-4 h-4 animate-spin'>
                                    Cargando horarios disponibles
                                </Loader2>
                            </div>
                        ) : (
                        <div className='grid grid-cols-4 gap-2'>
                            {franjas.map((franja) => (
                                <button 
                                    key={franja.hora}
                                    type='button'
                                    disabled={!franja.disponible}
                                    onClick={() => setValue("horario", franja.hora)}
                                    className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                                        horarioSeleccionado === franja.hora
                                            ? "bg-primary-500 text-white"
                                            : franja.disponible
                                            ? "bg-white border border-gray-300 hover:border-primary-500 text-gray-500"
                                            : "bg-gray text-gray-400 cursor-not-allowed"
                                        }`}
                                >
                                    {franja.hora}
                                </button>
                            ))}
                        </div>
                        )}
                    </Campo>
                )}
            </Seccion>

            <button type='submit' disabled={enviando}
            className='w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white font-semibold py-4 rounded-lg transition-colors flex items-center justify-center gap-2'>
                {enviando ? (
                    <>
                    <Loader2 className='w-5 h-5 animate-spin'/>
                    Confirmando...
                    </>
                ) : (
                    <>
                    <Calendar className='w-5 h-5'/>
                    Confirmar turno
                    </>
                )}
            </button>
        </form>

        <style jsx>{`
            :global(.input) {
                width: 100%;
                padding: 0.6rem 0.9rem;
                border: 1px solid skyblue;
                border-radius: 0.5rem;
                font-size: 0.95rem;
                background: white;
                transition: border-color 0.15s ease;
                color: black;
            }

            :global(.input:focus) {
                outline: none;
                border-color: green;
                box-shadow: 0 0 0 3px rgba(42, 120, 50, 0.1);
                color: black;
            }
        `}</style>
    </div>
    )
}

function Seccion({titulo, children}: {titulo: string; children: React.ReactNode}) {
    return(
        <div className='bg-white border border-gray-200 rounded-lg p-6 space-y-4'>
            <h2 className='font-semibold text-lg text-gray-900'>{titulo}</h2>
            {children}
        </div>
    )
}

function Campo({label, error, children}: {label: string; error?: string; children: React.ReactNode}) {
    return(
        <div>
            <label className='block text-sm font-medium text-gray-700 mb-1.5'>{label}</label>
            {children}
            {error && <p className='text-red-600 text-xs mt-1'>{error}</p>}
        </div>
    )
}

function Detalle({label, value}: {label: string; value: string;}) {
    return(
        <div className='flex justify-between items-start gap-4 text-sm'>
            <span className='text-gray-600'>{label}</span>
            <span className='font-medium text-gray-900 text-right'>{value}</span>
        </div>
    )
}