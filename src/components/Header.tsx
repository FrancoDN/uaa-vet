import Link from "next/link";
import { PawPrint } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <PawPrint className="w-6 h-6 text-primary-500"/>
              <span className="hidden sm:inline"> Veterinaria de Barrio</span>
              <span className="sm:hidden">Vet. del Barrio</span>
          </Link>

          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/"
              className="text-gray-700 hover: text-primary-600 transition-colors"
            >
              Inicio
            </Link>
            <Link
              href="/turnos"
              className="bg-primary-500 hover: bg-primary-600 text-white px-4 py-2 rounder-md transition-colors"
            >
              Sacar turno
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
