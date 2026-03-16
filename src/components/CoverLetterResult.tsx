"use client";

import { useState } from "react";

interface Props {
  coverLetter: string;
  onReset: () => void;
}

export default function CoverLetterResult({ coverLetter, onReset }: Props) {
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
    <div className="rounded-card bg-wizard-slate/50 border border-white/5 shadow-card backdrop-blur-sm p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-display font-semibold text-white">
          Your cover letter
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-form bg-white/5 text-wizard-mint text-sm font-medium hover:bg-white/10 border border-white/10 transition-colors"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-form bg-wizard-primary text-white text-sm font-medium hover:bg-wizard-primary-hover transition-colors"
          >
            Download .txt
          </button>
        </div>
      </div>

      <div className="p-6 rounded-form bg-wizard-ink/60 border border-white/5 whitespace-pre-wrap text-gray-200 leading-relaxed">
        {coverLetter}
      </div>

      <button
        onClick={onReset}
        className="w-full py-2.5 rounded-form border border-white/10 text-gray-400 hover:bg-white/5 hover:text-white transition-colors text-sm font-medium"
      >
        Create another letter
      </button>
    </div>
  );
}
