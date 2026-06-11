import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { AuthProvider } from "@/lib/auth";

export const metadata: Metadata = {
  title:  "Veterinaria de barrio | Turnos Online",
  description: "Saca tu turno online para tu mascota en la veterinaria. Atendemos de Lunes a Sabado en Mar del Plata"
}

export default function RootLayout({
  children,
} : {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-AR">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <Header/>
            <main className="flex-1">{children}</main>
          <Footer/>
      </AuthProvider>
      </body>
    </html>
  )
}