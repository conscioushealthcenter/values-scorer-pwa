import { defineConfig, type Plugin } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

/** Injects the built file list + a content-derived version into dist/sw.js so the app shell works offline. */
function precacheManifest(): Plugin {
  let outDir = 'dist';
  return {
    name: 'vasms-precache-manifest',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir;
    },
    closeBundle() {
      const files: string[] = [];
      const walk = (dir: string) => {
        for (const name of readdirSync(dir)) {
          const full = join(dir, name);
          if (statSync(full).isDirectory()) walk(full);
          else files.push(relative(outDir, full).split('\\').join('/'));
        }
      };
      walk(outDir);
      const shell = files.filter((f) => f !== 'sw.js' && !f.endsWith('.map')).sort();
      const hash = createHash('sha256');
      for (const f of shell) hash.update(f).update(readFileSync(join(outDir, f)));
      const swPath = join(outDir, 'sw.js');
      const urls = ['./', ...shell.map((f) => `./${f}`)];
      const sw = readFileSync(swPath, 'utf8')
        .replace("'__PRECACHE__'", JSON.stringify(urls))
        .replace("'__VERSION__'", JSON.stringify(hash.digest('hex').slice(0, 12)));
      writeFileSync(swPath, sw);
    },
  };
}

export default defineConfig({
  // Relative base so the build works at a domain root or under a subpath (e.g. GitHub Pages).
  base: './',
  plugins: [react(), precacheManifest()],
  server: { port: 5173, strictPort: true },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
