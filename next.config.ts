import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',  // Dodaj tę linię – włącza static export
  reactCompiler: true,
  // Inne opcje, jeśli masz
};

export default nextConfig;