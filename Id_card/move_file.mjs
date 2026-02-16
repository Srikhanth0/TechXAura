
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { rename } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const oldPath = resolve('c:/Users/srikh/Downloads/ID Card/srcqp/components/Scene.tsx');
const newPath = resolve('c:/Users/srikh/Downloads/ID Card/src/components/Scene.tsx');

try {
    await rename(oldPath, newPath);
    console.log(`Moved ${oldPath} to ${newPath}`);
} catch (error) {
    console.error(`Error moving file: ${error.message}`);
}
