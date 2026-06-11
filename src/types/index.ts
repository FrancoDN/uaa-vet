import type { Timestamp } from "firebase/firestore";

/** Vamos a crear los tipos de dominio del sistema de turnos */

export type EspecieAnimal = 'perro' | 'gato' | 'otro';

export interface Profesional {
    id: string;
    nombre: string;
    especialidad: string;
}

export interface Servicio {
    id: string;
    nombre: string;
    descripcion: string;
    duracionMinutos: number;
}

export interface FranjaHoraria {
    hora: string;
    disponible: boolean;
}

export interface Turno {
    id: string;
    servicioId: string;
    profesionalId: string;
    fecha: string;
    horario: string;
    mascota: {
        nombre: string;
        raza?: string;
        especie: string;
    };
    cliente: {
        nombre: string;
        telefono: string;
        email?: string;
    };
    estado: 'pendiente' | 'confirmado' | 'cancelado'
    creadoEn: Timestamp;
}