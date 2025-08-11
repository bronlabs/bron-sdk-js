import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Read package.json
const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
const version = packageJson.version;

// Update version.ts
const versionContent = `export const SDK_VERSION = "${version}";\n`;
writeFileSync('src/utils/version.ts', versionContent);

console.log(`Updated SDK_VERSION to ${version}`);
