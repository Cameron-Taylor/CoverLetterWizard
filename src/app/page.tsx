"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-display font-bold text-white tracking-tight">
          CoverLetterWizard
        </h1>
        <p className="mt-3 text-wizard-mint/90 text-lg">
          Your resume + job posting → a tailored cover letter
        </p>
        <p className="mt-6 text-gray-400 text-sm">
          Choose thy path. The scroll thou receivest shall be the same either way.
        </p>

        <div className="mt-12 grid sm:grid-cols-2 gap-6">
          <Link
            href="/wizard"
            className="group rounded-card bg-wizard-slate/50 border border-wizard-gold/30 shadow-card backdrop-blur-sm p-8 text-left hover:border-wizard-gold/60 hover:bg-wizard-slate/70 transition-all duration-200"
          >
            <span className="text-4xl" aria-hidden>✨</span>
            <h2 className="mt-4 text-xl font-display font-semibold text-white">
              Enter the Wizard&apos;s Workshop
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Olde English, mystical flair, and a touch of magic. Same powerful result.
            </p>
            <p className="mt-4 text-wizard-mint text-sm font-medium group-hover:underline">
              Begin the quest →
            </p>
          </Link>

          <Link
            href="/standard"
            className="group rounded-card bg-wizard-slate/50 border border-white/10 shadow-card backdrop-blur-sm p-8 text-left hover:border-white/20 hover:bg-wizard-slate/70 transition-all duration-200"
          >
            <span className="text-4xl" aria-hidden>📄</span>
            <h2 className="mt-4 text-xl font-display font-semibold text-white">
              Take the direct path
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              No frills. Straight to the form. Same cover letter, zero whimsy.
            </p>
            <p className="mt-4 text-wizard-mint text-sm font-medium group-hover:underline">
              Get started →
            </p>
          </Link>
        </div>

        <p className="mt-10 text-gray-500 text-xs max-w-sm mx-auto">
          Same outcome either path—quick, private, and tailored to each role.
        </p>
      </div>
    </main>
  );
}
