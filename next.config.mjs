/**
 * 純檔案模式（static export）— 適用 GitHub Pages / Cloudflare Pages / Vercel。
 *
 * basePath 由 NEXT_PUBLIC_BASE_PATH 決定：
 * - 本機開發：沒設 → 空字串 → http://localhost:3000/
 * - GitHub Pages：由 workflow 自動帶入 repo 名稱 → /<repo>/
 * 所以 repo 叫什麼名字都不用改程式。
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  // GitHub Pages 需要 /day/2026-08-19/index.html 這種結構才不會 404
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
};

export default nextConfig;
