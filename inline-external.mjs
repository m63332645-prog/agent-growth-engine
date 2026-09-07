// 把外部 CDN 资源（Font Awesome、Google Fonts）内联到单 HTML 文件
import fs from 'fs';
import https from 'https';
import path from 'path';

const HTML_PATH = 'dist-singlefile/index.html';

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchUrl(res.headers.location));
      }
      if (res.statusCode !== 200) return reject(new Error(`${res.statusCode} for ${url}`));
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    }).on('error', reject);
  });
}

async function main() {
  let html = fs.readFileSync(HTML_PATH, 'utf8');

  // 1. Font Awesome CSS
  const faUrl = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
  console.log('Fetching Font Awesome CSS...');
  const faCss = await fetchUrl(faUrl);

  // Font Awesome CSS 引用的 webfont 文件需要也内联成 base64
  // CSS URL: https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css
  // 字体相对路径如 ../webfonts/xxx.woff2，需相对 css/ 目录解析
  const cssUrl = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
  const baseUrl = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/';
  // 匹配 url(...) 中的相对路径引用
  const genericFontRegex = /url\((['"]?)(\.\.?\/[^'")]+)\1\)/g;
  const fontMatches = [...faCss.matchAll(genericFontRegex)];
  console.log(`Found ${fontMatches.length} font references`);

  let inlinedFaCss = faCss;
  const fontCache = new Map();
  for (const m of fontMatches) {
    const relPath = m[2];
    // 构造绝对URL（相对路径相对于 css 目录）
    const fullUrl = new URL(relPath, baseUrl).href;
    if (fontCache.has(fullUrl)) continue;
    try {
      console.log('Fetching font:', fullUrl);
      const fontData = await new Promise((resolve, reject) => {
        https.get(fullUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
          if (res.statusCode !== 200) return reject(new Error(`${res.statusCode}`));
          const chunks = [];
          res.on('data', (c) => chunks.push(c));
          res.on('end', () => resolve(Buffer.concat(chunks)));
        }).on('error', reject);
      });
      const b64 = fontData.toString('base64');
      fontCache.set(fullUrl, `data:font/woff2;base64,${b64}`);
    } catch (e) {
      console.warn('Failed to fetch font:', fullUrl, e.message);
    }
  }
  // 替换 CSS 中所有相对路径的 url() 引用为 data URI
  for (const m of fontMatches) {
    const relPath = m[2];
    const fullUrl = new URL(relPath, baseUrl).href;
    const dataUri = fontCache.get(fullUrl);
    if (dataUri) {
      // 替换匹配的整个 url(...) 语句
      const fullMatch = m[0];
      inlinedFaCss = inlinedFaCss.split(fullMatch).join(`url(${dataUri})`);
    }
  }

  // 替换 HTML 中的 Font Awesome link 标签
  const faLinkRegex = /<link rel="stylesheet" href="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome[^"]+">/;
  html = html.replace(faLinkRegex, `<style>\n${inlinedFaCss}\n</style>`);
  console.log('Inlined Font Awesome CSS +', fontCache.size, 'fonts');

  // 2. Google Fonts Inter - 内联 CSS 即可（字体文件较大，保留 CDN 链接也可，但内联更彻底）
  // 为了真正脱离网络，我们把 Inter 字体也内联成 base64
  const gfUrl = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
  console.log('Fetching Google Fonts CSS...');
  const gfCss = await fetchUrl(gfUrl);

  // 解析 Inter 字体的 woff2 链接
  const gfFontRegex = /url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g;
  const gfMatches = [...gfCss.matchAll(gfFontRegex)];
  console.log(`Found ${gfMatches.length} Inter font references`);

  let inlinedGfCss = gfCss;
  const gfCache = new Map();

  for (const m of gfMatches) {
    const fullUrl = m[1];
    if (gfCache.has(fullUrl)) continue;
    try {
      console.log('Fetching Inter font:', fullUrl);
      const fontData = await new Promise((resolve, reject) => {
        https.get(fullUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
          if (res.statusCode !== 200) return reject(new Error(`${res.statusCode}`));
          const chunks = [];
          res.on('data', (c) => chunks.push(c));
          res.on('end', () => resolve(Buffer.concat(chunks)));
        }).on('error', reject);
      });
      const b64 = fontData.toString('base64');
      gfCache.set(fullUrl, `data:font/woff2;base64,${b64}`);
    } catch (e) {
      console.warn('Failed to fetch Inter font:', fullUrl, e.message);
    }
  }
  for (const [url, dataUri] of gfCache.entries()) {
    inlinedGfCss = inlinedGfCss.split(`url(${url})`).join(`url(${dataUri})`);
  }

  // 替换 HTML 中的 Google Fonts link 标签
  const gfLinkRegex = /<link href="https:\/\/fonts\.googleapis\.com\/[^"]+" rel="stylesheet">/;
  html = html.replace(gfLinkRegex, `<style>\n${inlinedGfCss}\n</style>`);
  console.log('Inlined Google Fonts CSS +', gfCache.size, 'fonts');

  fs.writeFileSync(HTML_PATH, html, 'utf8');
  const size = (fs.statSync(HTML_PATH).size / 1024 / 1024).toFixed(2);
  console.log(`\nDone! Single file: ${HTML_PATH} (${size} MB)`);
}

main().catch(e => { console.error(e); process.exit(1); });
