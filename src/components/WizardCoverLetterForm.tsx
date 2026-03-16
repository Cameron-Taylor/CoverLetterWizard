"use client";

import { useState, useEffect, useCallback } from "react";
import type { FormData } from "@/lib/types";

const STORAGE_KEYS = {
  tellUsAboutYourself: "coverletter-tellUsAboutYourself",
  resume: "coverletter-resume",
};
const MAX_RESUME_STORAGE_BYTES = 2 * 1024 * 1024;

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/jpg",
];

const ACCEPTED_EXTENSIONS = ".pdf,.docx,.jpg,.jpeg";

interface Props {
  onSubmit: (data: FormData) => void;
  disabled?: boolean;
}

export default function WizardCoverLetterForm({ onSubmit, disabled }: Props) {
  const [resume, setResume] = useState<File | null>(null);
  const [jobUrl, setJobUrl] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [tone, setTone] = useState<FormData["tone"]>("conversational");
  const [length, setLength] = useState<FormData["length"]>("standard");
  const [opening, setOpening] = useState<FormData["opening"]>("enthusiasm");
  const [emphasis, setEmphasis] = useState<FormData["emphasis"]>("balanced");
  const [tellUsAboutYourself, setTellUsAboutYourself] = useState("");
  const [resumeFromStorage, setResumeFromStorage] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = sessionStorage.getItem(STORAGE_KEYS.tellUsAboutYourself);
      if (saved) setTellUsAboutYourself(saved);
      const savedResume = sessionStorage.getItem(STORAGE_KEYS.resume);
      if (savedResume) {
        const { b64, name, type } = JSON.parse(savedResume);
        const bin = atob(b64);
        const arr = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
        const blob = new Blob([arr], { type });
        setResume(new File([blob], name, { type }));
        setResumeFromStorage(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (tellUsAboutYourself) sessionStorage.setItem(STORAGE_KEYS.tellUsAboutYourself, tellUsAboutYourself);
      else sessionStorage.removeItem(STORAGE_KEYS.tellUsAboutYourself);
    } catch {
      /* ignore */
    }
  }, [tellUsAboutYourself]);

  const validateJobUrl = (url: string): string | null => {
    if (!url.trim()) return "A quest URL is required.";
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.toLowerCase();
      if (host.includes("login") || host.includes("auth") || host.includes("accounts.") || host.includes("mycompany") || host.includes("internal")) {
        return "That scroll may require a login. Use the public quest posting URL.";
      }
      if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return "Use a valid http or https URL.";
      return null;
    } catch {
      return "Enter a valid URL.";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!resume) newErrors.resume = "Present thy scroll of credentials.";
    else if (!ACCEPTED_TYPES.includes(resume.type)) newErrors.resume = "Thy scroll must be PDF, DOCX, or JPEG.";
    const hasJobUrl = jobUrl.trim().length > 0;
    const hasJobDescription = jobDescription.trim().length >= 100;
    if (!hasJobUrl && !hasJobDescription) {
      newErrors.jobUrl = "Provide a quest URL or inscribe the job description below (at least 100 characters).";
    } else if (hasJobUrl) {
      const urlError = validateJobUrl(jobUrl);
      if (urlError) newErrors.jobUrl = urlError;
    }
    if (tone === "conversational" && !tellUsAboutYourself.trim()) {
      newErrors.tellUsAboutYourself = "Tell the Wizard a bit about thyself for a conversational tone.";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    if (!resume) return;
    onSubmit({
      resume,
      jobUrl: jobUrl.trim() || undefined,
      jobDescription: jobDescription.trim() || undefined,
      tone,
      length,
      opening,
      emphasis,
      tellUsAboutYourself: tone === "conversational" ? tellUsAboutYourself.trim() : undefined,
    });
  };

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setResume(file ?? null);
    setResumeFromStorage(false);
    setErrors((prev) => (prev.resume ? { ...prev, resume: "" } : prev));
    if (file && file.size <= MAX_RESUME_STORAGE_BYTES) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const b64 = (reader.result as string).split(",")[1];
          if (b64) sessionStorage.setItem(STORAGE_KEYS.resume, JSON.stringify({ b64, name: file.name, type: file.type }));
        } catch {
          /* ignore */
        }
      };
      reader.readAsDataURL(file);
    } else if (file) sessionStorage.removeItem(STORAGE_KEYS.resume);
    else sessionStorage.removeItem(STORAGE_KEYS.resume);
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-wizard-mint mb-2">
          <span aria-hidden>📜</span> Scroll of thy credentials
        </label>
        <input
          type="file"
          accept={ACCEPTED_EXTENSIONS}
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-wizard-mint file:text-wizard-ink file:font-semibold hover:file:bg-white file:cursor-pointer"
        />
        <p className="mt-1 text-xs text-gray-400">PDF, DOCX, or JPEG. Kept for this session only.</p>
        {resume && (
          <p className="mt-1 text-xs text-wizard-mint/80">
            {resumeFromStorage ? "Using scroll from this session" : "Ready"}: {resume.name}
          </p>
        )}
        {errors.resume && <p className="mt-1 text-sm text-red-400">{errors.resume}</p>}
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-wizard-mint">
          <span aria-hidden>⚗️</span> Quest posting
        </label>
        <div>
          <input
            type="url"
            value={jobUrl}
            onChange={(e) => { setJobUrl(e.target.value); if (errors.jobUrl) setErrors((prev) => ({ ...prev, jobUrl: "" })); }}
            placeholder="Job listing URL Here (optional if thou pastest below)"
            className="w-full px-4 py-2.5 rounded-lg bg-wizard-slate/60 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-wizard-gold focus:border-transparent"
          />
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Or inscribe the job description here (Ashby, LinkedIn, etc.)</p>
          <textarea
            value={jobDescription}
            onChange={(e) => { setJobDescription(e.target.value); if (errors.jobUrl) setErrors((prev) => ({ ...prev, jobUrl: "" })); }}
            placeholder="Paste the full job description..."
            rows={6}
            className="w-full px-4 py-2.5 rounded-lg bg-wizard-slate/60 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-wizard-gold focus:border-transparent resize-y"
          />
        </div>
        {errors.jobUrl && <p className="text-sm text-red-400">{errors.jobUrl}</p>}
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-wizard-mint mb-3">
          <span aria-hidden>🎭</span> Tone of the scroll
        </label>
        <div className="space-y-2">
          {[
            { value: "formal" as const, label: "Formal" },
            { value: "professional-warm" as const, label: "Professional but warm" },
            { value: "conversational" as const, label: "Conversational" },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
              <input type="radio" name="tone" value={opt.value} checked={tone === opt.value} onChange={() => setTone(opt.value)} className="w-4 h-4 text-wizard-primary border-gray-500 focus:ring-wizard-primary" />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {tone === "conversational" && (
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-wizard-mint mb-2">
            <span aria-hidden>✨</span> Tell the Wizard of thyself
          </label>
          <textarea
            value={tellUsAboutYourself}
            onChange={(e) => { setTellUsAboutYourself(e.target.value); if (errors.tellUsAboutYourself) setErrors((prev) => ({ ...prev, tellUsAboutYourself: "" })); }}
            placeholder="Share thy personality, what moveth thee, or aught thou wouldst have stand out..."
            rows={4}
            className="w-full px-4 py-2.5 rounded-lg bg-wizard-slate/60 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-wizard-gold focus:border-transparent resize-none"
          />
          {errors.tellUsAboutYourself && <p className="mt-1 text-sm text-red-400">{errors.tellUsAboutYourself}</p>}
        </div>
      )}

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-wizard-mint mb-3">
          <span aria-hidden>📏</span> Length of the scroll
        </label>
        <div className="space-y-2">
          {[
            { value: "concise" as const, label: "Concise (1 paragraph)" },
            { value: "standard" as const, label: "Standard (3 paragraphs)" },
            { value: "detailed" as const, label: "Detailed" },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
              <input type="radio" name="length" value={opt.value} checked={length === opt.value} onChange={() => setLength(opt.value)} className="w-4 h-4 text-wizard-primary border-gray-500 focus:ring-wizard-primary" />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-wizard-mint mb-3">
          <span aria-hidden>🪶</span> Opening
        </label>
        <div className="space-y-2">
          {[
            { value: "enthusiasm" as const, label: "Lead with enthusiasm" },
            { value: "qualifications" as const, label: "Lead with qualifications" },
            { value: "direct" as const, label: "Direct" },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
              <input type="radio" name="opening" value={opt.value} checked={opening === opt.value} onChange={() => setOpening(opt.value)} className="w-4 h-4 text-wizard-primary border-gray-500 focus:ring-wizard-primary" />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-wizard-mint mb-3">
          <span aria-hidden>⚖️</span> Emphasis
        </label>
        <div className="space-y-2">
          {[
            { value: "experience" as const, label: "Highlight experience" },
            { value: "skills" as const, label: "Highlight skills" },
            { value: "balanced" as const, label: "Balanced" },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
              <input type="radio" name="emphasis" value={opt.value} checked={emphasis === opt.value} onChange={() => setEmphasis(opt.value)} className="w-4 h-4 text-wizard-primary border-gray-500 focus:ring-wizard-primary" />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={disabled}
          className="w-full py-3.5 px-6 rounded-form bg-wizard-mint text-wizard-ink font-semibold hover:bg-white focus:outline-none focus:ring-2 focus:ring-wizard-mint focus:ring-offset-2 focus:ring-offset-wizard-ink disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
        >
          <span aria-hidden>🧙</span> Conjure my scroll
        </button>
        <p className="mt-2 text-center text-xs text-gray-500">
          The Wizard shall tailor it to this quest—thou mayest edit ere sending.
        </p>
      </div>
    </form>
  );
}
