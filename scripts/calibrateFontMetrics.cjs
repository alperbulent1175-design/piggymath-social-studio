const { Resvg } = require('@resvg/resvg-js');
const esc = t => t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
function w(text, weight){
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="60000" height="400"><text x="0" y="200" font-size="100" font-weight="${weight}" font-family="DejaVu Sans" xml:space="preserve">${esc(text)}</text></svg>`;
  const b = new Resvg(svg, { font:{ loadSystemFonts:true, defaultFontFamily:'DejaVu Sans' } }).getBBox();
  return b ? b.x + b.width : 0;
}
const CHARS = [];
for (let c = 0x20; c <= 0x7e; c++) CHARS.push(String.fromCharCode(c));
CHARS.push('•','–','—','€','£','₺','ı','ş','ğ','ç','ö','ü','İ','Ş','Ğ','Ç','Ö','Ü','é','á');

const N = 21;
const out = {};
for (const weight of ['normal','bold']) {
  const table = {};
  const baseAA = w('MM', weight);
  for (const ch of CHARS) {
    let adv;
    if (ch === ' ') {
      adv = (w('M' + ' '.repeat(N) + 'M', weight) - baseAA) / N;
    } else {
      adv = (w(ch.repeat(N + 1), weight) - w(ch, weight)) / N;
    }
    table[ch] = Math.round(adv) / 100; // em fraction at 2dp
  }
  out[weight] = table;
}
const fmt = t => '{ ' + Object.entries(t).map(([k,v]) => `${JSON.stringify(k)}: ${v}`).join(', ') + ' }';
console.log('REGULAR=' + fmt(out.normal));
console.log('BOLD=' + fmt(out.bold));
const vals = Object.values(out.normal);
console.log('// avg regular', (vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(3));
const bvals = Object.values(out.bold);
console.log('// avg bold', (bvals.reduce((a,b)=>a+b,0)/bvals.length).toFixed(3));
