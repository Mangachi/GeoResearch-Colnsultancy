// ---------- Nav toggle ----------
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// ---------- Reveal on scroll ----------
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal, .service-item, .gis-card').forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// ---------- Seeded random ----------
function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

// ---------- Hero hex GIS plots ----------
const gisPlots = document.getElementById('gisPlots');
if (gisPlots) {
  const colors = ['#3D8B4A', '#9CCB5E', '#C9743D', '#2E5A28', '#1B3A5E'];
  const rand = seededRandom(12);
  const plots = [
    {x:0,y:0,w:110,h:90},{x:110,y:0,w:90,h:90},{x:200,y:0,w:120,h:90},
    {x:0,y:90,w:90,h:120},{x:90,y:90,w:110,h:120},{x:200,y:90,w:120,h:120},
    {x:0,y:210,w:160,h:110},{x:160,y:210,w:160,h:110},
  ];
  let html = '';
  plots.forEach(p => {
    const c = colors[Math.floor(rand()*colors.length)];
    html += `<rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" fill="${c}" opacity="0.55"/>`;
    for (let i = 6; i < p.w; i += 7) {
      html += `<line x1="${p.x+i}" y1="${p.y}" x2="${p.x+i}" y2="${p.y+p.h}" stroke="#0D3149" stroke-width="0.4" opacity="0.2"/>`;
    }
  });
  gisPlots.innerHTML = html;
}

// ---------- Orthomosaic plots (GIS section) ----------
const orthoPlots = document.getElementById('orthoPlots');
if (orthoPlots) {
  const colors = ['#3D8B4A', '#9CCB5E', '#2E5A28', '#C9A85E', '#1B3A5E'];
  const rand = seededRandom(31);
  const plots = [
    {x:10,y:10,w:90,h:60},{x:104,y:10,w:60,h:60},{x:168,y:10,w:62,h:60},
    {x:10,y:74,w:70,h:76},{x:84,y:74,w:80,h:76},{x:168,y:74,w:62,h:76},
  ];
  let html = '';
  plots.forEach(p => {
    const c = colors[Math.floor(rand()*colors.length)];
    html += `<rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" fill="${c}" opacity="0.85"/>`;
    for (let i = 5; i < p.w; i += 6) {
      html += `<line x1="${p.x+i}" y1="${p.y}" x2="${p.x+i}" y2="${p.y+p.h}" stroke="#0D3149" stroke-width="0.4" opacity="0.25"/>`;
    }
  });
  html += `<g stroke="#9FF0DC" stroke-width="1" fill="none" opacity="0.7"><rect x="10" y="10" width="220" height="140"/></g>`;
  orthoPlots.innerHTML = html;
}

// ---------- NDVI plots (GIS section) ----------
const ndviPlots = document.getElementById('ndviPlots');
if (ndviPlots) {
  const rand = seededRandom(58);
  const cols = 18, rows = 12;
  const w = 240, h = 160;
  const cw = w/cols, ch = h/rows;
  const ramp = ['#8B3A2E', '#C9743D', '#E8D85E', '#9CCB5E', '#3D8B4A'];
  const field = [];
  for (let r = 0; r < rows; r++) {
    field[r] = [];
    for (let c = 0; c < cols; c++) field[r][c] = 0.55 + rand()*0.4;
  }
  const patches = [{r:3,c:5,rad:3},{r:8,c:13,rad:3.5}];
  patches.forEach(p => {
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        const d = Math.hypot(r-p.r, c-p.c);
        if (d < p.rad) field[r][c] = Math.max(0, field[r][c] - (1-d/p.rad)*(0.5+rand()*0.3));
      }
  });
  const smooth = [];
  for (let r = 0; r < rows; r++) {
    smooth[r] = [];
    for (let c = 0; c < cols; c++) {
      let sum=0,count=0;
      for (let dr=-1; dr<=1; dr++)
        for (let dc=-1; dc<=1; dc++) {
          const rr=r+dr, cc=c+dc;
          if (rr>=0 && rr<rows && cc>=0 && cc<cols) { sum+=field[rr][cc]; count++; }
        }
      smooth[r][c] = sum/count;
    }
  }
  let html = '';
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const v = smooth[r][c];
      const idx = Math.min(ramp.length-1, Math.floor(v*ramp.length));
      html += `<rect x="${(c*cw).toFixed(1)}" y="${(r*ch).toFixed(1)}" width="${(cw+0.3).toFixed(1)}" height="${(ch+0.3).toFixed(1)}" fill="${ramp[idx]}" opacity="0.9"/>`;
    }
  ndviPlots.innerHTML = html;
}

// ---------- Survey points (GIS section) ----------
const surveyPts = document.getElementById('surveyPts');
if (surveyPts) {
  const rand = seededRandom(77);
  let html = '';
  // grid lines
  for (let x = 0; x <= 240; x += 30) {
    html += `<line x1="${x}" y1="0" x2="${x}" y2="160" stroke="#5E8AD5" stroke-width="0.5" opacity="0.25"/>`;
  }
  for (let y = 0; y <= 160; y += 27) {
    html += `<line x1="0" y1="${y}" x2="240" y2="${y}" stroke="#5E8AD5" stroke-width="0.5" opacity="0.25"/>`;
  }
  // GCP markers
  const pts = [{x:40,y:30},{x:200,y:30},{x:40,y:130},{x:200,y:130},{x:120,y:80}];
  pts.forEach(p => {
    html += `<circle cx="${p.x}" cy="${p.y}" r="14" fill="none" stroke="#9FF0DC" stroke-width="1" opacity="0.5"/>`;
    html += `<circle cx="${p.x}" cy="${p.y}" r="4" fill="#5E8AD5"/>`;
    html += `<line x1="${p.x-9}" y1="${p.y}" x2="${p.x+9}" y2="${p.y}" stroke="#9FF0DC" stroke-width="1" opacity="0.6"/>`;
    html += `<line x1="${p.x}" y1="${p.y-9}" x2="${p.x}" y2="${p.y+9}" stroke="#9FF0DC" stroke-width="1" opacity="0.6"/>`;
  });
  // flight path
  html += `<path d="M30,140 L60,40 L110,120 L150,30 L210,120" fill="none" stroke="#C9743D" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.7"/>`;
  surveyPts.innerHTML = html;
}
