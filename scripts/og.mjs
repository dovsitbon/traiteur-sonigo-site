// Image de partage public/og.jpg (1200 × 630) : texte à gauche sur blanc cassé, vraie photo du buffet à droite.
//   node scripts/og.mjs
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const photo = await sharp(path.join(ROOT, "assets/evenements/buffet-salle.jpg")).resize(500, 630, { fit: "cover", position: "centre" }).toBuffer();

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#faf7f1"/>
  <g fill="none" stroke="#7d6128" stroke-width="2" stroke-linecap="round">
    <path d="M84 150V104h12v46M108 150V104h12v46M78 150h48"/>
    <path d="M90 100c-4-4-3-10 0-15 3 5 4 11 0 15ZM114 100c-4-4-3-10 0-15 3 5 4 11 0 15Z" fill="#c9a45c"/>
  </g>
  <text x="80" y="214" font-family="Jost, Arial, sans-serif" font-size="20" letter-spacing="6" fill="#7d6128">TRAITEUR CACHER MEHADRIN · MARSEILLE</text>
  <text x="80" y="318" font-family="Georgia, serif" font-size="74" fill="#1f2a44">Votre Chabbat,</text>
  <text x="80" y="402" font-family="Georgia, serif" font-size="74" fill="#1f2a44">fait maison</text>
  <text x="80" y="486" font-family="Arial, sans-serif" font-size="26" fill="#3b2f2a">Salades, plats et desserts · Commandes jusqu'au jeudi</text>
  <text x="80" y="560" font-family="Georgia, serif" font-size="30" letter-spacing="8" fill="#1f2a44">SONIGO</text>
  <text x="268" y="560" font-family="Arial, sans-serif" font-size="22" fill="#6b5d55">07 81 20 61 85</text>
</svg>`;

await sharp(Buffer.from(svg))
  .composite([{ input: photo, left: 700, top: 0 }])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(path.join(ROOT, "public/og.jpg"));
console.log("public/og.jpg");
