import type { LucideIcon } from "lucide-react";

export interface ProjectLink {
  code?: string;
  demo?: string;
  paper?: string;
  marketplace?: string;
  pypi?: string;
}

export interface ProjectImage {
  src: string;
  caption?: string;
}

export interface ProjectMeta {
  label: string;
  value: string;
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  longDescription?: string[];
  features?: string[];
  install?: string;
  meta?: ProjectMeta[];
  coverImage?: string;
  gallery?: ProjectImage[];
  tags: string[];
  links: ProjectLink;
  year: string;
  featured?: boolean;
}

export interface ExperienceEntry {
  period: string;
  role: string;
  org: string;
  orgUrl?: string;
  location?: string;
  summary: string;
  tags: string[];
}

export interface EducationEntry {
  period: string;
  institution: string;
  institutionUrl?: string;
  degree: string;
  field: string;
  highlight?: string;
  location?: string;
}

export interface Publication {
  venue: string;
  year: string;
  title: string;
  authors: string;
  tldr: string;
  links: { pdf?: string; arxiv?: string; code?: string; bib?: string };
}

export interface Skill {
  title: string;
  description: string;
  icon: LucideIcon;
  items: string[];
}

export interface QuickFact {
  label: string;
  value: string;
}

export interface SiteContent {
  name: string;
  initials: string;
  avatar?: string;
  tagline: string;
  eyebrow: string;
  heroSubhead: string;
  about: string[];
  quickFacts: QuickFact[];
  projects: Project[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  publications: Publication[];
  skills: Skill[];
  honors: { title: string; org: string; year: string }[];
  languages: { name: string; level: string }[];
  contact: {
    emailParts: { user: string; domain: string };
    github: { handle: string; url: string; label: string }[];
    linkedin: string;
  };
}
