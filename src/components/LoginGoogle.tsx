"use client"

import { useAuth } from "@/lib/auth"
import { LogIn, Loader2} from "lucide-react"
import { useState } from "react"


export default function LoginGoogle() {
    const { loginConGoogle } = useAuth()
    const [ cargando, setCargando] = useState(false)
    const [ error, setError] = useState<string | null>(null)

    async function handleLogin() {
        setCargando(true)
        setError(null)
        try {
            await loginConGoogle()
        } catch(e) {
            setError("No se puede iniciar sesion. Intenta mas tarde")
            setCargando(false)
        }
    }

    return(
        <div className="container mx-auto px-4 py-20 max-w-md text-center">
            <h1 className="text-2xl font-bold mb-2">Panel de administracion</h1>
            <p className="text-gray-600 mb-8">
                Acceso exclusivo para el personal de la veterinaria
            </p>

            {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
                    {error}
                </div>
            )}

            <button className="inline-flex items-center gap-2 bg-white border border-gray-300 hover:border-primary-500 text-gray-700 font-medium" onClick={handleLogin} disabled={cargando}>
                {cargando ? (
                    <Loader2 className="w-5 h-5 animate-spin"/>
                ) : (
                    <LogIn className="w-5 h-5"/>
                )}
                Ingresar con Google
            </button>
        </div>
    )
}