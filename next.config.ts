import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',  // Włącza static export – next build generuje /out
  reactCompiler: true,
  // Inne opcje...
};

export default nextConfig;