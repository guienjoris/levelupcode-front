const fs = require('fs');
const path = require('path');
const https = require('https');

const API_URL = process.env.API_URL || 'https://levelupcode-api-993969640029.europe-west1.run.app';
const targetDirs = [
  path.join(__dirname, '..', 'public', 'icons'),
  path.join(__dirname, '..', 'src', 'assets', 'icons'),
];

for (const dir of targetDirs) {
  fs.mkdirSync(dir, { recursive: true });
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function downloadSvg(iconName, slug) {
  return new Promise((resolve) => {
    const pathPart = iconName.includes(':') ? iconName.replace(':', '/') : iconName;
    const url = `https://api.iconify.design/${pathPart}.svg`;
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        console.error(`✗ Erreur HTTP ${res.statusCode} pour ${slug} (${url})`);
        return resolve();
      }
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        for (const dir of targetDirs) {
          fs.writeFileSync(path.join(dir, `${slug}.svg`), data);
          const safeName = iconName.replace(':', '-');
          fs.writeFileSync(path.join(dir, `${safeName}.svg`), data);
        }
        console.log(`✓ Téléchargé : ${slug}.svg (${iconName})`);
        resolve();
      });
    }).on('error', (err) => {
      console.error(`✗ Erreur pour ${slug}:`, err.message);
      resolve();
    });
  });
}

async function run() {
  console.log(`Interrogation des catégories depuis ${API_URL}/categories...`);
  try {
    const categories = await fetchJson(`${API_URL}/categories`);
    console.log(`${categories.length} catégories trouvées. Téléchargement des icônes SVG...`);
    for (const cat of categories) {
      if (cat.icon) {
        await downloadSvg(cat.icon, cat.slug);
      }
    }
    console.log('Synchronisation des icônes terminée avec succès.');
  } catch (err) {
    console.error('Erreur lors de la synchronisation des icônes :', err.message);
  }
}

run();
