"use client";

import { useState } from "react";
import Link from "next/link";
import WizardCoverLetterForm from "@/components/WizardCoverLetterForm";
import WizardCoverLetterResult from "@/components/WizardCoverLetterResult";
import type { FormData } from "@/lib/types";

export default function WizardPage() {
  const [result, setResult] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: FormData) => {
    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("resume", data.resume);
      if (data.jobUrl) formDataToSend.append("jobUrl", data.jobUrl);
      if (data.jobDescription) formDataToSend.append("jobDescription", data.jobDescription);
      formDataToSend.append("tone", data.tone);
      formDataToSend.append("length", data.length);
      formDataToSend.append("opening", data.opening);
      formDataToSend.append("emphasis", data.emphasis);
      if (data.tellUsAboutYourself) {
        formDataToSend.append("tellUsAboutYourself", data.tellUsAboutYourself);
      }

      const res = await fetch("/api/generate", {
        method: "POST",
        body: formDataToSend,
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "The spell fizzled. Try again.");
      }

      setResult(json.coverLetter);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went awry.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-10">
          <Link href="/" className="inline-block text-gray-500 hover:text-wizard-mint text-sm mb-4 transition-colors">
            ← Choose another path
          </Link>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-white tracking-tight flex items-center justify-center gap-3">
            <span aria-hidden>🧙</span>
            The Wizard&apos;s Workshop
          </h1>
          <p className="mt-3 text-wizard-mint/90 text-lg max-w-md mx-auto">
            Present thy credentials and the quest—the Wizard shall conjure thy scroll.
          </p>
          <p className="mt-1.5 text-gray-400 text-sm">
            Same powerful cover letter, with a touch of magic.
          </p>
        </header>

        {!result ? (
          <div className="rounded-card bg-wizard-slate/50 border border-wizard-gold/20 shadow-card backdrop-blur-sm p-6 sm:p-8">
            <WizardCoverLetterForm onSubmit={handleSubmit} disabled={isGenerating} />
            {isGenerating && (
              <div className="mt-8 flex items-center justify-center gap-3 text-wizard-gold">
                <span className="animate-spin h-5 w-5 border-2 border-wizard-gold border-t-transparent rounded-full" aria-hidden />
                <span>The Wizard is conjuring thy scroll...</span>
              </div>
            )}
            {error && (
              <div className="mt-6 p-4 rounded-form bg-red-500/10 border border-red-500/30 text-red-200 text-sm">
                {error}
              </div>
            )}
          </div>
        ) : (
          <WizardCoverLetterResult coverLetter={result} onReset={handleReset} />
        )}
      </div>
    </main>
  );
}
