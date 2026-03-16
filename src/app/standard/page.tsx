"use client";

import { useState } from "react";
import Link from "next/link";
import CoverLetterForm from "@/components/CoverLetterForm";
import CoverLetterResult from "@/components/CoverLetterResult";
import type { FormData } from "@/lib/types";

export default function StandardPage() {
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
        throw new Error(json.error || "Failed to generate cover letter");
      }

      setResult(json.coverLetter);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
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
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-white tracking-tight">
            CoverLetterWizard
          </h1>
          <p className="mt-3 text-wizard-mint/90 text-lg max-w-md mx-auto">
            Your resume + job posting → a tailored cover letter
          </p>
          <p className="mt-1.5 text-gray-400 text-sm">
            Quick, private, and tailored to each role.
          </p>
        </header>

        {!result ? (
          <div className="rounded-card bg-wizard-slate/50 border border-white/5 shadow-card backdrop-blur-sm p-6 sm:p-8">
            <CoverLetterForm onSubmit={handleSubmit} disabled={isGenerating} />
            {isGenerating && (
              <div className="mt-8 flex items-center justify-center gap-3 text-wizard-primary">
                <span className="animate-spin h-5 w-5 border-2 border-wizard-primary border-t-transparent rounded-full" />
                <span>Creating your cover letter...</span>
              </div>
            )}
            {error && (
              <div className="mt-6 p-4 rounded-form bg-red-500/10 border border-red-500/30 text-red-200 text-sm">
                {error}
              </div>
            )}
          </div>
        ) : (
          <CoverLetterResult coverLetter={result} onReset={handleReset} />
        )}
      </div>
    </main>
  );
}
