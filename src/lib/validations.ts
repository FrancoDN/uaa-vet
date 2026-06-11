import { z } from 'zod'

export const turnoSchema = z.object({
    //Datos de mascota
    mascotaNombre: z.string().min(2, "El nombre debe tener al menos 2 letras").max(40, "El nombre es muy largo"),
    
    especie: z.enum(["perro", "gato", "otro"], {
        message: "Selecciona una especie"
    }),

    raza: z.string().max(40).optional(),

    // Datos del cliente
    clienteNombre: z.string().min(2, "Ingresa tu nombre completo").max(60, "El nombre es muy largo"),

    telefono: z.string().min(8, "Ingresa un teléfono válido").regex(/^[0-9+\-\s()]+$/, "Solo números y caracteres válidos"),

    email: z.email("Email inválido").optional().or(z.literal("")),

    // Datos del turno
    servicioId: z.string().min(1, "Selecciona un servicio"),
    profesionalId: z.string().min(1, "Selecciona un profesional"),
    fecha: z.string().min(1, "Selecciona una fecha"),
    horario: z.string().min(1, "Selecciona un horario")
})

export type TurnoFormData = z.infer<typeof turnoSchema>