/**
 * Extracts raw text from PDF or DOCX files in the browser.
 */

export async function extractTextFromFile(file: File): Promise<string> {
  const ext = file.name.toLowerCase().split('.').pop();
  if (ext === 'pdf') return extractFromPdf(file);
  if (ext === 'docx') return extractFromDocx(file);
  throw new Error('Unsupported file type');
}

async function extractFromPdf(file: File): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist');
  // Use the local worker bundled with pdfjs-dist via Vite's ?url import
  const workerSrc = new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).href;
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: unknown) => {
        const i = item as { str?: string };
        return i.str ?? '';
      })
      .join(' ');
    pages.push(pageText);
  }

  return pages.join('\n');
}

async function extractFromDocx(file: File): Promise<string> {
  const mammoth = await import('mammoth');
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}
