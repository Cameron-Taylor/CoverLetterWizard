import mammoth from "mammoth";

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/jpg",
] as const;

export function isAcceptedResumeType(mimeType: string): boolean {
  return ACCEPTED_TYPES.includes(mimeType as (typeof ACCEPTED_TYPES)[number]);
}

export async function parseResume(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const mimeType = file.type;

  if (
    mimeType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value.trim();
  }

  if (mimeType === "application/pdf") {
    const pdfParse = (await import("pdf-parse")).default;
    const data = await pdfParse(buffer);
    return data.text?.trim() ?? "";
  }

  if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
    const Tesseract = await import("tesseract.js");
    const result = await Tesseract.recognize(buffer, "eng");
    return result.data.text?.trim() ?? "";
  }

  throw new Error(`Unsupported resume format: ${mimeType}`);
}
