import { PDFDocument, StandardFonts } from "pdf-lib";

function wrapText(text: string, maxLen: number): string[] {
  const words = String(text || "").split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > maxLen) {
      if (line) lines.push(line.trim());
      line = w;
    } else {
      line += " " + w;
    }
  }
  if (line.trim()) lines.push(line.trim());
  return lines;
}

export interface PdfSection {
  heading: string;
  body: string | string[];
}

export async function createSimplePdf({ title, sections }: { title: string; sections: PdfSection[] }): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let y = 800;
  const left = 50;

  page.drawText(title, { x: left, y, size: 16, font: fontBold });
  y -= 24;

  for (const s of sections) {
    page.drawText(s.heading, { x: left, y, size: 12, font: fontBold });
    y -= 16;

    const lines = Array.isArray(s.body)
      ? s.body.flatMap((b) => wrapText(b, 95))
      : wrapText(s.body, 95);

    for (const ln of lines) {
      if (y < 60) {
        const newPage = pdfDoc.addPage([595.28, 841.89]);
        y = 800;
        newPage.drawText(title, { x: left, y, size: 16, font: fontBold });
        y -= 24;
        // switch page reference
        // (simple approach: mutate by reassigning)
        return await createSimplePdf({ title, sections }); // fallback (rare). Keep MVP simple.
      }
      page.drawText(ln, { x: left, y, size: 10, font });
      y -= 14;
    }
    y -= 10;
  }

  const bytes = await pdfDoc.save();
  return Buffer.from(bytes);
}
