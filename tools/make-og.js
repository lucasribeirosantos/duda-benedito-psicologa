// Gera assets/og-cover.png (1200x630) com a marca, para compartilhamento social.
const { decode, encode } = require("./crop.js");
const fs = require("fs");

function resize(src, dw, dh) {
  const { w: sw, h: sh, data: s } = src;
  const out = Buffer.alloc(dw * dh * 4);
  for (let y = 0; y < dh; y++) {
    const sy = (y + 0.5) * sh / dh - 0.5;
    const y0 = Math.max(0, Math.min(sh - 1, Math.floor(sy)));
    const y1 = Math.min(sh - 1, y0 + 1);
    const fy = sy - Math.floor(sy);
    for (let x = 0; x < dw; x++) {
      const sx = (x + 0.5) * sw / dw - 0.5;
      const x0 = Math.max(0, Math.min(sw - 1, Math.floor(sx)));
      const x1 = Math.min(sw - 1, x0 + 1);
      const fx = sx - Math.floor(sx);
      const di = (y * dw + x) * 4;
      for (let c = 0; c < 4; c++) {
        const p00 = s[(y0 * sw + x0) * 4 + c], p10 = s[(y0 * sw + x1) * 4 + c];
        const p01 = s[(y1 * sw + x0) * 4 + c], p11 = s[(y1 * sw + x1) * 4 + c];
        const top = p00 + (p10 - p00) * fx, bot = p01 + (p11 - p01) * fx;
        out[di + c] = Math.round(top + (bot - top) * fy);
      }
    }
  }
  return { w: dw, h: dh, data: out };
}

function over(dst, src, ox, oy) {
  const { w: dw, h: dh, data: d } = dst, { w: sw, h: sh, data: s } = src;
  for (let y = 0; y < sh; y++) {
    const dy = oy + y; if (dy < 0 || dy >= dh) continue;
    for (let x = 0; x < sw; x++) {
      const dx = ox + x; if (dx < 0 || dx >= dw) continue;
      const si = (y * sw + x) * 4, di = (dy * dw + dx) * 4, a = s[si + 3] / 255;
      if (a <= 0) continue;
      for (let c = 0; c < 3; c++) d[di + c] = Math.round(s[si + c] * a + d[di + c] * (1 - a));
      d[di + 3] = 255;
    }
  }
}

function blob(dst, cx, cy, r, col, maxA) {
  const { w, h, data: d } = dst;
  for (let y = Math.max(0, cy - r); y < Math.min(h, cy + r); y++)
    for (let x = Math.max(0, cx - r); x < Math.min(w, cx + r); x++) {
      const dist = Math.hypot(x - cx, y - cy); if (dist > r) continue;
      const a = maxA * (1 - dist / r) * (1 - dist / r);
      const di = (y * w + x) * 4;
      for (let c = 0; c < 3; c++) d[di + c] = Math.round(col[c] * a + d[di + c] * (1 - a));
    }
}

const W = 1200, H = 630;
const data = Buffer.alloc(W * H * 4);
const cream = [0xf8, 0xed, 0xe1];
for (let i = 0; i < W * H; i++) { data[i * 4] = cream[0]; data[i * 4 + 1] = cream[1]; data[i * 4 + 2] = cream[2]; data[i * 4 + 3] = 255; }
const dst = { w: W, h: H, data };

// nuvens suaves nos cantos (identidade)
blob(dst, 60, 70, 260, [0xd6, 0xdd, 0xe2], 0.6);
blob(dst, 1160, 600, 280, [0xa6, 0xc0, 0xd6], 0.5);
blob(dst, 1120, 60, 180, [0xd6, 0xdd, 0xe2], 0.45);

const bird = decode("assets/bird.png");
const bw = 196, bh = Math.round(bw * bird.h / bird.w);
const logo = decode("assets/logo-text.png");
const lw = 740, lh = Math.round(lw * logo.h / logo.w);

const gap = 26, total = bh + gap + lh, top = Math.round((H - total) / 2);
over(dst, resize(bird, bw, bh), Math.round((W - bw) / 2), top);
over(dst, resize(logo, lw, lh), Math.round((W - lw) / 2), top + bh + gap);

fs.writeFileSync("assets/og-cover.png", encode(W, H, data));
console.log("assets/og-cover.png " + W + "x" + H);
