import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { parseResume } from "@/lib/parseResume";
import { fetchJobPosting } from "@/lib/fetchJobPosting";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function buildPrompt(
  resumeText: string,
  jobText: string,
  options: {
    tone: string;
    length: string;
    opening: string;
    emphasis: string;
    tellUsAboutYourself?: string;
  }
): string {
  const toneInstructions: Record<string, string> = {
    formal:
      "Professional but not stiff. Clear and direct. Avoid overly flowery language.",
    "professional-warm":
      "Warm and approachable while staying polished. Personable without being casual.",
    conversational:
      "Natural, like the candidate is talking to someone they respect. Sounds like a real person wrote it—not a template. " +
      (options.tellUsAboutYourself
        ? `Weave in this personal context naturally: "${options.tellUsAboutYourself}"`
        : ""),
  };

  const lengthInstructions: Record<string, string> = {
    concise: "1 short paragraph. Every word should earn its place.",
    standard: "3 paragraphs: opening, body, closing. Tight and focused.",
    detailed: "4-5 paragraphs. Still avoid filler—keep substance over length.",
  };

  const openingInstructions: Record<string, string> = {
    enthusiasm: "Open with genuine enthusiasm for the role and company.",
    qualifications: "Open by leading with the candidate's key qualifications.",
    direct: "Open directly; use 'Dear Hiring Manager' or similar. Be concise.",
  };

  const emphasisInstructions: Record<string, string> = {
    experience: "Emphasize relevant work experience and achievements.",
    skills: "Emphasize skills and technical competencies.",
    balanced: "Balance experience and skills.",
  };

  return `You are an expert cover letter writer. Generate a cover letter based on:

RESUME:
${resumeText}

JOB POSTING:
${jobText}

INSTRUCTIONS:
- Tone: ${toneInstructions[options.tone] ?? toneInstructions.formal}
- Length: ${lengthInstructions[options.length] ?? lengthInstructions.standard}
- Opening: ${openingInstructions[options.opening] ?? openingInstructions.enthusiasm}
- Emphasis: ${emphasisInstructions[options.emphasis] ?? emphasisInstructions.balanced}

Write ONLY the cover letter body. Do not include placeholders like [Your Name] or [Date]. Use "Dear Hiring Manager" or similar. Output plain text.

STYLE: Write as the candidate would—in their voice, not a generic template. Be concise; avoid wordiness. Professional but human. No robotic or over-polished phrasing. Every sentence should add value.`;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const resume = formData.get("resume") as File | null;
    const jobUrl = (formData.get("jobUrl") as string)?.trim() || null;
    const jobDescription = (formData.get("jobDescription") as string)?.trim() || null;
    const tone = (formData.get("tone") as string) ?? "conversational";
    const length = (formData.get("length") as string) ?? "standard";
    const opening = (formData.get("opening") as string) ?? "enthusiasm";
    const emphasis = (formData.get("emphasis") as string) ?? "balanced";
    const tellUsAboutYourself = (formData.get("tellUsAboutYourself") as string) || undefined;

    if (!resume) {
      return NextResponse.json(
        { error: "Resume is required." },
        { status: 400 }
      );
    }

    if (!jobUrl && (!jobDescription || jobDescription.length < 100)) {
      return NextResponse.json(
        { error: "Provide a job posting URL or paste the job description (at least 100 characters)." },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured. Add OPENAI_API_KEY to your .env.local file." },
        { status: 500 }
      );
    }

    let jobText = jobDescription && jobDescription.length >= 100
      ? jobDescription
      : null;

    if (!jobText && jobUrl) {
      try {
        jobText = await fetchJobPosting(jobUrl);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Could not fetch job posting.";
        return NextResponse.json(
          { error: msg + " You can paste the job description manually instead." },
          { status: 400 }
        );
      }
    }

    const resumeText = await parseResume(resume);

    if (!resumeText.trim()) {
      return NextResponse.json(
        { error: "Could not extract text from your resume. Try a different file format." },
        { status: 400 }
      );
    }

    if (!jobText || !jobText.trim() || jobText.length < 100) {
      return NextResponse.json(
        { error: "Could not get job details. Paste the job description manually or try a different URL." },
        { status: 400 }
      );
    }

    const prompt = buildPrompt(resumeText, jobText, {
      tone,
      length,
      opening,
      emphasis,
      tellUsAboutYourself,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const coverLetter =
      completion.choices[0]?.message?.content?.trim() ??
      "Failed to generate cover letter.";

    return NextResponse.json({ coverLetter });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
