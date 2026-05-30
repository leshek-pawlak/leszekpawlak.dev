// One-off generator for public/nda-leszek-pawlak.pdf.
// Run with:  npm i --no-save puppeteer && node scripts/generate-nda-pdf.mjs
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import puppeteer from "puppeteer";

const htmlPath = resolve("public/nda-leszek-pawlak.html");
const pdfPath = resolve("public/nda-leszek-pawlak.pdf");

const browser = await puppeteer.launch();
try {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(htmlPath).toString(), {
    waitUntil: "networkidle0",
  });
  await page.pdf({
    path: pdfPath,
    format: "A4",
    printBackground: true,
    margin: { top: "18mm", right: "18mm", bottom: "18mm", left: "18mm" },
  });
  console.log("Wrote", pdfPath);
} finally {
  await browser.close();
}
