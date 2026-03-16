"use client";

import { useState } from "react";

interface Props {
  coverLetter: string;
  onReset: () => void;
}

export default function WizardCoverLetterResult({ coverLetter, onReset }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([coverLetter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cover-letter.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-card bg-wizard-slate/50 border border-wizard-gold/20 shadow-card backdrop-blur-sm p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-xl font-display font-semibold text-white">
          <span aria-hidden>📜</span> Thy cover letter
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-form bg-white/5 text-wizard-mint text-sm font-medium hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-1.5"
          >
            <span aria-hidden>{copied ? "✓" : "📋"}</span>
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-form bg-wizard-mint text-wizard-ink text-sm font-medium hover:bg-white transition-colors flex items-center gap-1.5"
          >
            <span aria-hidden>⬇</span>
            Download .txt
          </button>
        </div>
      </div>

      <div className="p-6 rounded-form bg-wizard-ink/60 border border-white/5 whitespace-pre-wrap text-gray-200 leading-relaxed">
        {coverLetter}
      </div>

      <button
        onClick={onReset}
        className="w-full py-2.5 rounded-form border border-wizard-gold/30 text-gray-400 hover:bg-wizard-gold/10 hover:text-wizard-gold transition-colors text-sm font-medium"
      >
        Conjure another scroll
      </button>
    </div>
  );
}
