const http = require("http"), fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const mt = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".png": "image/png", ".jpg": "image/jpeg", ".jfif": "image/jpeg", ".svg": "image/svg+xml", ".ico": "image/x-icon" };
http.createServer((q, s) => {
  let u = decodeURIComponent(q.url.split("?")[0]);
  if (u === "/") u = "/index.html";
  const f = path.join(root, u);
  fs.readFile(f, (e, d) => {
    if (e) { s.writeHead(404); s.end("404"); return; }
    s.writeHead(200, { "content-type": mt[path.extname(f).toLowerCase()] || "application/octet-stream" });
    s.end(d);
  });
}).listen(8124, () => console.log("serving on http://localhost:8124"));
