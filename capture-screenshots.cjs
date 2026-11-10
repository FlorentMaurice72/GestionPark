/**
 * GestionPark — Capture de 23 screenshots
 * Usage : node capture-screenshots.cjs
 * Résultat : dossier ./screenshots/
 */

const { chromium } = require("playwright");
const { mkdirSync } = require("fs");
const { join } = require("path");

const BASE = "https://gestion-park.vercel.app";  // ou http://localhost:3000 en dev
const OUT = join(__dirname, "screenshots");
const DEMO_EMAIL = "demo@gestionpark.fr";
const DEMO_PASSWORD = "Demo2026!";

mkdirSync(OUT, { recursive: true });

async function run() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();

  async function shot(name, url, scrollY) {
    process.stdout.write(`📸 ${name}… `);
    if (url) await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForLoadState("networkidle", { timeout: 12000 }).catch(() => {});
    if (scrollY) { await page.evaluate((y) => window.scrollTo(0, y), scrollY); await new Promise(r => setTimeout(r, 600)); }
    await page.screenshot({ path: join(OUT, `${name}.png`), fullPage: true });
    console.log("✓");
  }

  // ── Pages publiques ───────────────────────────────────────────────────
  await shot("01-landing-hero",         BASE);
  await shot("02-landing-fonctionnalites", null, 700);
  await shot("03-landing-temoignages",  null, 1600);
  await shot("04-landing-tarifs",       null, 2400);
  await shot("05-page-tarifs",          `${BASE}/tarifs`);
  await shot("06-page-demo",            `${BASE}/demo`);
  await shot("07-login",                `${BASE}/login`);
  await shot("08-blog",                 `${BASE}/blog`);

  // ── Connexion au compte démo ──────────────────────────────────────────
  console.log("\n🔐 Connexion au compte démo…");
  await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
  await page.fill('input[type="email"]', DEMO_EMAIL);
  await page.fill('input[type="password"]', DEMO_PASSWORD);
  await Promise.all([
    page.waitForNavigation({ timeout: 25000 }).catch(() => {}),
    page.click('button[type="submit"]'),
  ]);
  await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
  console.log("   → connecté sur", page.url(), "\n");

  // ── App authentifiée ──────────────────────────────────────────────────
  await shot("09-dashboard",            BASE);
  await shot("10-dashboard-graphiques", null, 500);
  await shot("11-loyers",               `${BASE}/loyers`);
  await shot("12-loyers-impayés",       null, 400);
  await shot("13-import-csv",           `${BASE}/loyers/import`);
  await shot("14-biens",                `${BASE}/biens`);

  // Détail du premier bien
  await page.goto(`${BASE}/biens`, { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
  const bienLink = page.locator("a[href^='/biens/']").first();
  if (await bienLink.count()) {
    await bienLink.click();
    await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
    await page.screenshot({ path: join(OUT, "15-bien-detail.png"), fullPage: true });
    console.log("📸 15-bien-detail ✓");
  }

  await shot("16-locataires",           `${BASE}/locataires`);

  // Détail du premier locataire
  await page.goto(`${BASE}/locataires`, { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
  const locLink = page.locator("a[href^='/locataires/']").first();
  if (await locLink.count()) {
    await locLink.click();
    await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
    await page.screenshot({ path: join(OUT, "17-locataire-detail.png"), fullPage: true });
    console.log("📸 17-locataire-detail ✓");
  }

  await shot("18-alertes",              `${BASE}/alertes`);
  await shot("19-finances",             `${BASE}/finances`);
  await shot("20-profil",               `${BASE}/profil`);
  await shot("21-parrainage",           `${BASE}/parrainage`);

  // ── Vues mobile (iPhone 14 Pro) ───────────────────────────────────────
  console.log("\n📱 Vues mobile (390×844)…");
  const mob = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
  const mp = await mob.newPage();

  async function shotMob(name, url) {
    process.stdout.write(`📱 ${name}… `);
    if (url) await mp.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
    await mp.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
    await mp.screenshot({ path: join(OUT, `${name}.png`), fullPage: false });
    console.log("✓");
  }

  await shotMob("22-mobile-landing", BASE);

  // Connexion mobile
  await mp.goto(`${BASE}/login`, { waitUntil: "domcontentloaded" });
  await mp.fill('input[type="email"]', DEMO_EMAIL);
  await mp.fill('input[type="password"]', DEMO_PASSWORD);
  await Promise.all([
    mp.waitForNavigation({ timeout: 20000 }).catch(() => {}),
    mp.click('button[type="submit"]'),
  ]);
  await mp.waitForLoadState("networkidle", { timeout: 12000 }).catch(() => {});

  await shotMob("23-mobile-dashboard",  `${BASE}/`);
  await shotMob("24-mobile-loyers",     `${BASE}/loyers`);
  await shotMob("25-mobile-locataires", `${BASE}/locataires`);

  await mob.close();
  await browser.close();

  console.log(`\n✅ 25 captures enregistrées dans ${OUT}`);
}

run().catch((e) => { console.error("Erreur:", e.message); process.exit(1); });
