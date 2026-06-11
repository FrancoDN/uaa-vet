import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Fija la raíz del proyecto para Turbopack y evita que Next infiera
  // un workspace root equivocado por el package-lock.json del home.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
