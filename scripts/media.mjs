// Classe les vraies photos du traiteur dans assets/<catégorie>/ puis les prépare pour le web dans public/media/.
//   npm run media
//
// Sources (profil Instagram public @traiteur_jonas_sonigo, récupéré le 8 nov. 2026) :
//   assets/picks/  images extraites avec ffmpeg des deux reels « buffet » (720 × 1280, bandes noires en haut et en bas)
//   assets/raw/    affiches (carte, formules, Roch Hachana) : servent de source pour data/carte.json, pas d'images du site
//   assets/a-verifier/  10 visuels de plats (pizza, sushis, sablés…) au rendu très probablement généré par IA :
//                       écartés tant que Yonathan n'a pas confirmé que ce sont de vraies photos.
// Pour ajouter une photo : la déposer dans assets/<catégorie>/, l'ajouter à PICKS, relancer npm run media.
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
// Zone utile des images de reels (sans les bandes noires) : x, y, largeur, hauteur
const REEL = { left: 0, top: 160, width: 720, height: 960 };

const PICKS = [
  // [source, catégorie, nom, extraction]
  ["picks/buffet_2.5.jpg", "evenements", "buffet-salle", REEL],
  ["picks/betterave_2.5.jpg", "salades", "carpaccio-betterave", REEL],
  // Détails du buffet (zones nettes de la photo)
  ["picks/buffet_2.5.jpg", "galerie", "buffet-plateaux", { left: 40, top: 430, width: 640, height: 480 }],
  ["picks/betterave_2.5.jpg", "galerie", "betterave-detail", { left: 30, top: 300, width: 660, height: 660 }],
];

const sizes = {};
for (const [src, cat, name, crop] of PICKS) {
  const input = path.join(ROOT, "assets", src);
  await mkdir(path.join(ROOT, "assets", cat), { recursive: true });
  await mkdir(path.join(ROOT, "public/media", cat), { recursive: true });
  const base = sharp(input).extract(crop).modulate({ brightness: 1.03, saturation: 1.04 });
  await base.clone().jpeg({ quality: 92 }).toFile(path.join(ROOT, "assets", cat, `${name}.jpg`));
  const out = path.join(ROOT, "public/media", cat, `${name}.jpg`);
  const info = await base.clone().jpeg({ quality: 84, mozjpeg: true }).toFile(out);
  sizes[`/media/${cat}/${name}.jpg`] = [info.width, info.height];
  console.log(`${cat}/${name}.jpg ${info.width}×${info.height}`);
}

await writeFile(path.join(ROOT, "data/media-sizes.json"), JSON.stringify(sizes, null, 2) + "\n");
