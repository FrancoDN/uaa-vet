import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { TurnoFormData } from "@/lib/validations";
import type { Turno, FranjaHoraria } from "@/types";
const COLECCION_TURNOS = "turnos";

export async function crearTurno(data: TurnoFormData): Promise<string> {
  const nuevoTurno = {
    servicioId: data.servicioId,
    profesionalId: data.profesionalId,
    fecha: data.fecha,
    horario: data.horario,
    mascota: {
      nombre: data.mascotaNombre,
      especie: data.especie,
      raza: data.raza || "",
    },
    cliente: {
      nombre: data.clienteNombre,
      telefono: data.telefono,
      email: data.email || "",
    },
    estado: "pendiente" as const,
    creadoEn: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, COLECCION_TURNOS), nuevoTurno);
  return docRef.id;
}

export async function obtenerTurnosPorFecha(fecha: string): Promise<Turno[]> {
  const q = query(
    collection(db, COLECCION_TURNOS),
    where("fecha", "==", fecha),
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Turno[];
}

export async function obtenerTodosLosTurnos(): Promise<Turno[]> {
  const snapshot = await getDocs(collection(db, COLECCION_TURNOS));
  const turnos = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Turno[];

  return turnos.sort((a, b) => {
    const fechaComparacion = a.fecha.localeCompare(b.fecha);
    if (fechaComparacion !== 0) {
      return fechaComparacion;
    }

    return a.horario.localeCompare(b.horario);
  });
}

export async function obtenerFranjasDisponibles(
  fecha: string,
): Promise<FranjaHoraria[]> {
  const HORARIOS_BASE = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
  ];

  const turnosDelDia = await obtenerTurnosPorFecha(fecha)
  const horariosOcupados = new Set(
    turnosDelDia.filter((t) => t.estado !== "cancelado").map((t) => t.horario)
  )

  return HORARIOS_BASE.map((hora) => ({
    hora,
    disponible: !horariosOcupados.has(hora)
  }))
}
