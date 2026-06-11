import type { Profesional, Servicio } from "@/types";


export const PROFESIONALES: Profesional[] = [
  {
    id: "prof-1",
    nombre: "Dr. Jaimito Perez",
    especialidad: "Clinica general",
  },
  {
    id: "prof-2",
    nombre: "Dra. Jaimita Gonzales",
    especialidad: "Cirujana",
  },
];

export const SERVICIOS: Servicio[] = [
  {
    id: "serv-1",
    nombre: "Consulta clinica",
    descripcion: "Diagnostico general y tratamiento",
    duracionMinutos: 30,
  },
  {
    id: "serv-2",
    nombre: "Vacunacion",
    descripcion: "Aplicacion de vacunas segun calendario",
    duracionMinutos: 15,
  },
  {
    id: "serv-3",
    nombre: "Controles",
    descripcion: "Chequeo anual",
    duracionMinutos: 20,
  },
  {
    id: "serv-4",
    nombre: "Intervencion menor",
    descripcion: "Castracion, extraccion, suturas",
    duracionMinutos: 60,
  },
];
