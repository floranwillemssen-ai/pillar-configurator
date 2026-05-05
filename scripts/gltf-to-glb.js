// Converteert .gltf + .bin naar één .glb bestand
const fs = require('fs');
const path = require('path');

const gltfPath = path.join(__dirname, '../models/cabinet/Naamloos-342.DM54BC7D1D-3D_X2_7b805316_X0_.gltf');
const binPath  = path.join(__dirname, '../models/cabinet/Naamloos-342.DM54BC7D1D-3D_X2_7b805316_X0_.bin');
const outPath  = path.join(__dirname, '../models/cabinet/342_nieuw.glb');

const gltf = JSON.parse(fs.readFileSync(gltfPath, 'utf8'));
const binData = fs.readFileSync(binPath);

// Vervang externe buffer URI door interne buffer (GLB BIN chunk)
gltf.buffers[0].uri = undefined;
gltf.buffers[0].byteLength = binData.length;

const jsonStr = JSON.stringify(gltf);
// JSON chunk moet 4-byte aligned zijn (pad met spaties)
const jsonPadded = jsonStr.padEnd(Math.ceil(jsonStr.length / 4) * 4, ' ');
const jsonBuf = Buffer.from(jsonPadded, 'utf8');

// BIN chunk moet 4-byte aligned zijn (pad met nullen)
const binPadded = Buffer.alloc(Math.ceil(binData.length / 4) * 4);
binData.copy(binPadded);

const totalLength = 12 + 8 + jsonBuf.length + 8 + binPadded.length;
const out = Buffer.alloc(totalLength);
let offset = 0;

// GLB header
out.writeUInt32LE(0x46546C67, offset); offset += 4; // magic
out.writeUInt32LE(2, offset);          offset += 4; // version
out.writeUInt32LE(totalLength, offset); offset += 4; // length

// JSON chunk
out.writeUInt32LE(jsonBuf.length, offset); offset += 4;
out.writeUInt32LE(0x4E4F534A, offset);     offset += 4; // "JSON"
jsonBuf.copy(out, offset); offset += jsonBuf.length;

// BIN chunk
out.writeUInt32LE(binPadded.length, offset); offset += 4;
out.writeUInt32LE(0x004E4942, offset);        offset += 4; // "BIN\0"
binPadded.copy(out, offset);

fs.writeFileSync(outPath, out);
console.log(`✓ GLB geschreven: ${outPath} (${(out.length / 1024 / 1024).toFixed(1)} MB)`);
