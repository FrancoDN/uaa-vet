"use client"

import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode
} from "react"

import {
    onAuthStateChanged,
    signInWithPopup,
    signOut as firebaseSignOut,
    type User
} from "firebase/auth"

import {auth, googleProvider} from "@/lib/firebase"

interface AuthContextType {
    user: User | null
    cargando: boolean
    loginConGoogle: () => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({children}: {children: ReactNode}) {
    const [user, setUser] = useState<User | null>(null)
    const [ cargando, setCargando] = useState(true)

    useEffect(() => {
        const unsuscribe = onAuthStateChanged(auth, (usuarioActual) => {
            setUser(usuarioActual)
            setCargando(false)
        })

        return () => unsuscribe()
    }, [])

    async function loginConGoogle() {
        await signInWithPopup(auth, googleProvider)
    }

    async function logout() {
        await firebaseSignOut(auth)
    }

    return(
        <AuthContext.Provider value={{user, cargando, loginConGoogle, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if(context === undefined) {
        throw new Error("useAuth debe usarse dentro de un Auth Provider")
    }
    return context
}