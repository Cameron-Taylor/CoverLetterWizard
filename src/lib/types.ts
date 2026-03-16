export interface FormData {
  resume: File;
  jobUrl?: string;
  jobDescription?: string;
  tone: "formal" | "professional-warm" | "conversational";
  length: "concise" | "standard" | "detailed";
  opening: "enthusiasm" | "qualifications" | "direct";
  emphasis: "experience" | "skills" | "balanced";
  tellUsAboutYourself?: string;
}
