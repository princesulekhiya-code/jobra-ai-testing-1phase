const fs = require('fs');
const path = require('path');
const file = path.resolve(__dirname, '..', 'public', 'reference.pdf');
if (!fs.existsSync(file)) {
  console.error('File not found:', file);
  process.exit(2);
}
const buf = fs.readFileSync(file);
const s = buf.toString('latin1');

function countMatches(re) {
  const m = s.match(new RegExp(re, 'g'));
  return m ? m.length : 0;
}

console.log('File:', file);
console.log('Size (bytes):', buf.length);

const pageTypeCount = countMatches('\\/Type\\s*\\/Page');
console.log('Occurrences of "/Type /Page":', pageTypeCount);

// Try to find /Count n within /Type /Pages objects
const pagesObjs = [];
const pagesRe = /\/Type\s*\/Pages[\s\S]*?\nendobj/g;
let m;
while ((m = pagesRe.exec(s)) !== null) {
  const snippet = m[0];
  const cnt = (snippet.match(/\/Count\s+(\d+)/) || [])[1];
  pagesObjs.push({ snippetStart: m.index, count: cnt ? Number(cnt) : null });
}
console.log('Pages objects found:', pagesObjs.length);
pagesObjs.forEach((p, i) => console.log(`  Pages object ${i + 1}: /Count = ${p.count}`));

// List BaseFont and FontName occurrences
const baseFonts = Array.from(s.matchAll(/\/BaseFont\s*\/([A-Za-z0-9+\-_.]+)/g)).map(x=>x[1]);
const fontNames = Array.from(s.matchAll(/\/FontName\s*\/([A-Za-z0-9+\-_.]+)/g)).map(x=>x[1]);
console.log('BaseFont entries:', [...new Set(baseFonts)].join(', ') || '<none>');
console.log('FontName entries:', [...new Set(fontNames)].join(', ') || '<none>');

// MediaBox occurrences (page sizes)
const mediaBoxes = Array.from(s.matchAll(/\/MediaBox\s*\[([^\]]+)\]/g)).map(x=>x[1].trim());
console.log('MediaBox entries found:', mediaBoxes.length);
mediaBoxes.slice(0,10).forEach((mb,i)=> console.log('  MediaBox', i+1, ':', mb));

// Heuristic: count occurrences of '/Contents' as number of pages with content streams
const contentsCount = countMatches('\\/Contents');
console.log('Occurrences of "/Contents":', contentsCount);

process.exit(0);
