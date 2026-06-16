// Minimal PNG decode (RGBA, 8-bit) + crop + encode. Pure Node (zlib only).
const fs = require("fs"), zlib = require("zlib");

function decode(file) {
  const b = fs.readFileSync(file);
  let p = 8, idat = [], w, h;
  while (p < b.length) {
    const len = b.readUInt32BE(p);
    const type = b.toString("ascii", p + 4, p + 8);
    const data = b.slice(p + 8, p + 8 + len);
    if (type === "IHDR") { w = data.readUInt32BE(0); h = data.readUInt32BE(4); }
    if (type === "IDAT") idat.push(data);
    if (type === "IEND") break;
    p += 12 + len;
  }
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = w * 4, out = Buffer.alloc(w * h * 4);
  let pos = 0, prev = Buffer.alloc(stride);
  for (let y = 0; y < h; y++) {
    const ft = raw[pos++], cur = Buffer.alloc(stride);
    for (let x = 0; x < stride; x++) {
      const rv = raw[pos++];
      const a = x >= 4 ? cur[x - 4] : 0, bb = prev[x], c = x >= 4 ? prev[x - 4] : 0;
      let v;
      if (ft === 0) v = rv; else if (ft === 1) v = rv + a; else if (ft === 2) v = rv + bb;
      else if (ft === 3) v = rv + ((a + bb) >> 1);
      else { const pa = Math.abs(bb - c), pb = Math.abs(a - c), pc = Math.abs(a + bb - 2 * c); const pr = (pa <= pb && pa <= pc) ? a : (pb <= pc ? bb : c); v = rv + pr; }
      cur[x] = v & 255;
    }
    cur.copy(out, y * stride); prev = cur;
  }
  return { w, h, data: out };
}

const crcTable = (() => { const t = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
function crc32(buf) { let c = 0xffffffff; for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
function chunk(type, data) { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type, "ascii"), data]); const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td)); return Buffer.concat([len, td, crc]); }

function encode(w, h, data) {
  const stride = w * 4, raw = Buffer.alloc((stride + 1) * h);
  for (let y = 0; y < h; y++) { raw[y * (stride + 1)] = 0; data.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride); }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6;
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0))]);
}

function crop(img, x0, x1, pad = 2) {
  const { w, h, data } = img;
  let minY = h, maxY = 0;
  for (let y = 0; y < h; y++) for (let x = x0; x <= x1; x++) if (data[(y * w + x) * 4 + 3] > 40) { if (y < minY) minY = y; if (y > maxY) maxY = y; }
  const cx0 = Math.max(0, x0 - pad), cx1 = Math.min(w - 1, x1 + pad);
  const cy0 = Math.max(0, minY - pad), cy1 = Math.min(h - 1, maxY + pad);
  const cw = cx1 - cx0 + 1, ch = cy1 - cy0 + 1, out = Buffer.alloc(cw * ch * 4);
  for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
    const si = ((cy0 + y) * w + (cx0 + x)) * 4, di = (y * cw + x) * 4;
    data.copy(out, di, si, si + 4);
  }
  return { w: cw, h: ch, data: out };
}

module.exports = { decode, encode, crop };

if (require.main === module) {
  const img = decode("icone passarinho.png");
  const bird = crop(img, 378, 748, 3);
  fs.writeFileSync("assets/bird.png", encode(bird.w, bird.h, bird.data));
  console.log("assets/bird.png", bird.w + "x" + bird.h);
}
