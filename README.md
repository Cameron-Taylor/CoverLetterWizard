# CoverLetterWizard

Generate tailored cover letters from your resume and job posting URL.

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure OpenAI**

   Copy `.env.local.example` to `.env.local` and add your OpenAI API key:

   ```
   OPENAI_API_KEY=sk-your-key-here
   ```

3. **Run the app**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Features

- **Resume upload**: PDF, DOCX, or JPEG
- **Job URL**: Paste a job posting URL (LinkedIn, Indeed, company sites, etc.)
- **Tone**: Formal, Professional but warm, or Conversational (with optional "Tell us about yourself")
- **Length**: Concise, Standard, or Detailed
- **Opening & emphasis** options
- Uses **GPT-4o-mini** for cost-effective generation

## Tech stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- OpenAI API
