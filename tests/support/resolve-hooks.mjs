// Node resolve hook so tests can import the app's TypeScript modules directly:
// maps the '@/' alias to src/ and resolves extensionless relative imports to .ts files.
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const srcDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../src');

export async function resolve(specifier, context, nextResolve) {
  let candidate = specifier;
  if (specifier.startsWith('@/')) {
    candidate = pathToFileURL(path.join(srcDir, specifier.slice(2))).href;
  }
  const isRelative = candidate.startsWith('.') || candidate.startsWith('file:');
  if (isRelative && !path.extname(candidate.startsWith('file:') ? fileURLToPath(candidate) : candidate)) {
    const base = candidate.startsWith('file:') ? fileURLToPath(candidate) : path.resolve(path.dirname(fileURLToPath(context.parentURL)), candidate);
    for (const ext of ['.ts', '.tsx', '/index.ts']) {
      if (existsSync(base + ext)) return nextResolve(pathToFileURL(base + ext).href, context);
    }
  }
  return nextResolve(candidate, context);
}
