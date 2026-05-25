const fs = require("fs");
const buf = fs.readFileSync("C:/Users/coryc/lexflow-ai/public/screenshot.pdf");
const str = buf.toString("latin1");
const matches = str.match(/\(([^)]+)\)/g);
let readable = [];
if (matches) {
  matches.forEach((m) => {
    const text = m.slice(1, -1);
    if (/[a-zA-Z0-9]{4,}/.test(text) && text.indexOf("\\") === -1 && text.length > 3) {
      if (/^[\x20-\x7E\s]+$/.test(text)) {
        readable.push(text);
      }
    }
  });
}
console.log(readable.join("\n"));
