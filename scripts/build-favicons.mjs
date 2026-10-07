// Deterministic format/size exports of the approved emblem-only favicon.
// Usage: node scripts/build-favicons.mjs [path-to-square-master]
import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const destination = resolve(root, "public/images/brand");
const input = process.argv[2] || resolve(destination, "favicon-512.png");
const source = await sharp(input).toBuffer();
const metadata = await sharp(source).metadata();
if (metadata.width !== metadata.height)
  throw new Error("Favicon master must be square");
for (const size of [96, 180, 512]) {
  await sharp(source)
    .resize(size, size)
    .png()
    .toFile(resolve(destination, `favicon-${size}.png`));
}
// ICO directory entries contain PNG images; supported by modern browsers.
const sizes = [32, 48, 64, 256];
const images = await Promise.all(
  sizes.map((size) => sharp(source).resize(size, size).png().toBuffer()),
);
const header = Buffer.alloc(6 + sizes.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
images.forEach((data, index) => {
  const position = 6 + index * 16;
  header[position] = sizes[index] === 256 ? 0 : sizes[index];
  header[position + 1] = header[position];
  header.writeUInt16LE(1, position + 4);
  header.writeUInt16LE(32, position + 6);
  header.writeUInt32LE(data.length, position + 8);
  header.writeUInt32LE(offset, position + 12);
  offset += data.length;
});
await writeFile(
  resolve(root, "public/favicon.ico"),
  Buffer.concat([header, ...images]),
);
console.log(
  "Exported square PNG favicons (96, 180, 512) and multi-size favicon.ico.",
);
