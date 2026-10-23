// Portfolio hub v2: a static single page. The build copies site/ into dist/ as-is.
// (The v1 generator is kept as build_legacy.mjs.)
import { cpSync, rmSync } from 'node:fs';
rmSync('dist', { recursive: true, force: true });
cpSync('site', 'dist', { recursive: true });
console.log('dist ready');
