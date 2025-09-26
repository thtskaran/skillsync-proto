"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Github,
  FileCode2,
  GraduationCap,
  MapPin,
  Building2,
  CalendarRange,
  Link as LinkIcon,
  Trophy,
  Award,
  BookOpen,
  BarChart2,
  Users,
  Flame,
  Briefcase,
  Medal,
  X,
  Copy,
  Download,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// --- Inline logo components (reused placeholders) ---
const AwsLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 256 154" width="20" height="20" aria-label="AWS" {...props}>
    <path fill="#232F3E" d="M55 0h21v105H55zM92 35h21v70H92zM129 20h21v85h-21zM166 8h21v97h-21z"/>
    <path fill="#FF9900" d="M10 140c60-30 176-30 236 0l-9 14c-54-25-164-25-218 0z"/>
  </svg>
);
const AzureLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 256 256" width="20" height="20" aria-label="Azure" {...props}>
    <path fill="#0078D4" d="M170 20l-89 180h60L236 20z"/>
    <path fill="#5EA0EF" d="M20 216h84l34-64H72z"/>
  </svg>
);
const GcpLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 256 256" width="20" height="20" aria-label="GCP" {...props}>
    <circle cx="128" cy="128" r="38" fill="#4285F4"/>
    <path fill="#EA4335" d="M128 30l36 20-18 32-36-20z"/>
    <path fill="#FBBC05" d="M226 128l-20 36-32-18 20-36z"/>
    <path fill="#34A853" d="M128 226l-36-20 18-32 36 20z"/>
  </svg>
);
const CourseraLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 256 256" width="18" height="18" aria-label="Coursera" {...props}>
    <circle cx="128" cy="128" r="110" fill="#2A73CC"/>
    <path fill="#fff" d="M180 150c-8 18-27 31-52 31-33 0-59-26-59-53s26-53 59-53c25 0 44 13 52 31h-33c-6-6-13-9-19-9-16 0-27 13-27 31s11 31 27 31c6 0 13-3 19-9z"/>
  </svg>
);
const UdemyLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 256 256" width="18" height="18" aria-label="Udemy" {...props}>
    <path fill="#A435F0" d="M128 20l48 28v40l-48-28-48 28V48z"/>
    <rect x="80" y="96" width="96" height="120" rx="12" fill="#111"/>
  </svg>
);

// --- Demo data (tailored for Arpan) ---
const skills = [
  { name: "Java", level: 86 },
  { name: "Go", level: 78 },
  { name: "TypeScript", level: 80 },
  { name: "React", level: 88 },
  { name: "Next.js", level: 82 },
  { name: "Docker", level: 90 },
];

const extracurriculars = [
  {
    title: "CodeSprint — Finalist",
    desc: "Top 10 among 500+ participants for an end‑to‑end system design challenge.",
    icon: Trophy,
    date: "2024",
  },
  {
    title: "Open Source — Maintainer",
    desc: "Maintains a small CLI toolkit used by 1k+ monthly downloads.",
    icon: Award,
    date: "2023",
  },
];

const experiences = [
  // Added entries (latest first)
  {
    title: "Software Development Intern",
    org: "Codekerdos",
    range: "May 2025 — Present",
    desc: "Remote • React.js, TypeScript (+3)",
  },
  {
    title: "Founder and CEO",
    org: "Growsoc",
    range: "May 2024 — Sep 2025",
    desc: "Remote • Leadership and cross‑functional team leadership",
  },
  {
    title: "Advisory Information Technology Specialist",
    org: "TestKart",
    range: "Jun 2024 — Present",
    desc: "Remote • Strategic planning and consulting",
  },
  {
    title: "Project Intern",
    org: "Infosys Springboard",
    range: "May 2024 — Aug 2024",
    desc: "Artificial Intelligence Project Intern • NLP, Agile methodologies",
  },
  {
    title: "Chief Technology Officer",
    org: "MentorMenti",
    range: "Jan 2024 — Jun 2024",
    desc: "Remote • Technology management, event management (+4)",
  },
  {
    title: "Full Stack Developer",
    org: "MentorMenti",
    range: "Dec 2023 — Jan 2024",
    desc: "Full‑time • Node.js, React.js (+5)",
  },
  {
    title: "Web Development Intern",
    org: "MentorMenti",
    range: "Nov 2023 — Dec 2023",
    desc: "Internship",
  },

  {
    title: "Software Engineer Intern",
    org: "Acme Systems",
    range: "May 2024 — Aug 2024",
    desc: "Built Go microservices and optimized PostgreSQL queries, reducing P95 latency by 35%.",
  },
  {
    title: "Teaching Assistant",
    org: "MSIT — CS Dept.",
    range: "Jan 2023 — Dec 2023",
    desc: "Led weekly lab sessions on DSA and code reviews for 60+ students.",
  },
];

const certifications = [
  {
    title: "AWS Certified Solutions Architect — Associate",
    org: "Amazon Web Services",
    date: "2024",
    url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/",
    Logo: AwsLogo,
  },
  {
    title: "Microsoft Certified: Azure Developer Associate (AZ‑204)",
    org: "Microsoft",
    date: "2024",
    url: "https://learn.microsoft.com/certifications/azure-developer/",
    Logo: AzureLogo,
  },
  {
    title: "Google Cloud Associate Cloud Engineer",
    org: "Google Cloud",
    date: "2023",
    url: "https://cloud.google.com/learn/certification/cloud-engineer",
    Logo: GcpLogo,
  },
];

const moocs = [
  {
    provider: "Coursera",
    title: "Algorithms, Part I — Princeton",
    url: "https://www.coursera.org/learn/algorithms-part1",
    progress: 100,
    Logo: CourseraLogo,
  },
  {
    provider: "Udemy",
    title: "System Design Fundamentals",
    url: "https://www.udemy.com/",
    progress: 75,
    Logo: UdemyLogo,
  },
  {
    provider: "Udemy",
    title: "Kubernetes for Developers",
    url: "https://www.udemy.com/",
    progress: 65,
    Logo: UdemyLogo,
  },
  {
    provider: "Coursera",
    title: "Scalable Microservices with gRPC",
    url: "https://www.coursera.org/",
    progress: 55,
    Logo: CourseraLogo,
  },
];

const platforms = [
  {
    label: "GitHub",
    username: "arpankumarde",
    url: "https://github.com/arpankumarde",
    icon: Github,
  },
  {
    label: "LeetCode",
    username: "arpankumarde",
    url: "https://leetcode.com/arpankumarde",
    icon: FileCode2,
  },
];

// Academic metrics (demo values)
const sgpa = 9.2; // out of 10
const attendance = 96; // in percent

// --- Test helpers (optional reuse) ---
export function validateMetrics({ sgpa, attendance }: { sgpa: number; attendance: number }) {
  return {
    sgpaValid: sgpa >= 0 && sgpa <= 10,
    attendanceValid: attendance >= 0 && attendance <= 100,
  };
}

export const __testcases__ = [
  { name: "sgpa in range", actual: validateMetrics({ sgpa: 9.2, attendance: 96 }).sgpaValid, expected: true },
  { name: "attendance upper bound", actual: validateMetrics({ sgpa: 9.1, attendance: 100 }).attendanceValid, expected: true },
  { name: "attendance out of range", actual: validateMetrics({ sgpa: 7.5, attendance: 140 }).attendanceValid, expected: false },
  { name: "sgpa lower bound 0", actual: validateMetrics({ sgpa: 0, attendance: 50 }).sgpaValid, expected: true },
  { name: "sgpa above max invalid", actual: validateMetrics({ sgpa: 10.1, attendance: 50 }).sgpaValid, expected: false },
  { name: "attendance lower bound 0", actual: validateMetrics({ sgpa: 7.5, attendance: 0 }).attendanceValid, expected: true },
  { name: "attendance negative invalid", actual: validateMetrics({ sgpa: 7.5, attendance: -1 }).attendanceValid, expected: false },
];

export default function SkillSyncProfile_Arpan() {
  const [rank] = React.useState(12);
  const totalStudents = 220;

  const [isClient, setIsClient] = React.useState(false);
  const [shareOpen, setShareOpen] = React.useState(false);
  const [shareUrl, setShareUrl] = React.useState("");

  React.useEffect(() => {
    setIsClient(true);
    try {
      setShareUrl(window.location.href);
    } catch {
      setShareUrl("");
    }
  }, []);

  const qrUrl = React.useMemo(
    () =>
      shareUrl
        ? `https://api.qrserver.com/v1/create-qr-code/?size=280x280&format=svg&qzone=2&data=${encodeURIComponent(
            shareUrl
          )}`
        : "",
    [shareUrl]
  );

  return (
    <div className="min-h-screen w-full bg-neutral-50">
      {/* Top Nav */}
      <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/90 border-b">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
          <h1 className="text-xl font-semibold tracking-tight">Skill Sync</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button className="rounded-xl" onClick={() => setShareOpen(true)}>Share Profile</Button>
          </div>
        </div>
      </header>

      {/* Share Modal */}
      {shareOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShareOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 grid min-h-full place-items-center p-4">
            <div
              role="dialog"
              aria-modal="true"
              className="w-full max-w-sm rounded-2xl bg-white shadow-xl border pointer-events-auto"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="font-semibold">Share Profile</div>
                  <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setShareOpen(false)}>
                    <X className="size-4" />
                  </Button>
                </div>

                <div className="grid place-items-center">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/10 to-fuchsia-500/10 border">
                    {qrUrl ? (
                      <img src={qrUrl} alt="Profile QR" className="size-56" />
                    ) : (
                      <div className="size-56 grid place-items-center text-neutral-400 text-xs">Generating QR...</div>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <input
                    readOnly
                    value={shareUrl}
                    className="flex-1 bg-neutral-50 border rounded-lg px-3 py-2 text-sm overflow-hidden text-ellipsis"
                  />
                  <Button
                    variant="secondary"
                    className="rounded-lg"
                    onClick={() => navigator.clipboard?.writeText(shareUrl)}
                  >
                    <Copy className="size-4 mr-2" /> Copy
                  </Button>
                </div>

                <div className="mt-3 flex gap-2">
                  <a href={qrUrl || "#"} download="profile-qr.svg" onClick={(e) => !qrUrl && e.preventDefault()}>
                    <Button variant="outline" className="rounded-lg">
                      <Download className="size-4 mr-2" /> Download QR
                    </Button>
                  </a>
                  <Button variant="ghost" className="rounded-lg" onClick={() => setShareOpen(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-4 py-6">
        {/* Hero card */}
        <Card className="rounded-3xl shadow-sm border-neutral-200">
          <CardContent className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] items-center gap-6">
              <Avatar className="size-20 md:size-24 ring-4 ring-white shadow">
                <AvatarImage src="" alt="Arpan Kumar De" />
                <AvatarFallback className="text-lg">AD</AvatarFallback>
              </Avatar>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Arpan Kumar De</h2>
                  <Badge className="rounded-full">Batch 2023 — CS</Badge>
                </div>
                <div className="mt-2 flex items-center gap-3 flex-wrap text-neutral-600">
                  <span className="inline-flex items-center gap-1"><GraduationCap className="size-4"/> Student</span>
                  <span className="inline-flex items-center gap-1"><Building2 className="size-4"/> Meghnad Saha Institute of Technology</span>
                  <span className="inline-flex items-center gap-1"><MapPin className="size-4"/> Bengaluru, IN</span>
                </div>
                <p className="mt-3 text-neutral-700 max-w-2xl">
                  Full‑stack engineer exploring distributed systems, API design, and developer tooling. Enjoys Go, React, and building resilient cloud services.
                </p>

                {/* Platforms */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {platforms.map((p) => {
                    const Icon = p.icon;
                    return (
                      <a key={p.label} href={p.url} target="_blank" rel="noreferrer" className="group">
                        <Button variant="secondary" className="rounded-full">
                          <Icon className="size-4 mr-2" />
                          {p.label}: <span className="ml-1 font-mono text-sm">@{p.username}</span>
                          <LinkIcon className="size-3 ml-2 opacity-60 group-hover:opacity-100" />
                        </Button>
                      </a>
                    );
                  })}
                  <Badge variant="outline" className="rounded-full font-mono">@arpankumarde</Badge>
                </div>
              </div>

              {/* Rank badge */}
              <div className="flex flex-col items-end gap-3">
                <div className="relative grid place-items-center">
                  <div
                    className="size-24 rounded-full grid place-items-center"
                    style={{
                      background:
                        "conic-gradient(var(--tw-gradient-from,#6366f1) calc(" +
                        ((rank / totalStudents) * 100).toFixed(2) +
                        "%), #E5E7EB 0)",
                    }}
                  >
                    <div className="size-20 rounded-full bg-white grid place-items-center shadow-inner">
                      <div className="text-center">
                        <div className="text-sm text-neutral-500">Rank</div>
                        <div className="text-xl font-semibold">{rank}<span className="text-neutral-400 text-base">/{totalStudents}</span></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <Users className="size-3.5" /> CS 2023 Cohort
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metrics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="rounded-2xl">
            <CardContent className="p-5">
              <div className="text-sm text-neutral-500 mb-1">SGPA</div>
              <div className="text-2xl font-semibold">{sgpa.toFixed(2)}</div>
              <Progress value={(sgpa/10)*100} className="h-2 mt-3" />
              <div className="text-xs text-neutral-500 mt-2">Scale: 10</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardContent className="p-5">
              <div className="text-sm text-neutral-500 mb-1">Attendance</div>
              <div className="text-2xl font-semibold">{attendance}%</div>
              <Progress value={attendance} className="h-2 mt-3" />
              <div className="text-xs text-neutral-500 mt-2">Current semester</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 text-sm text-neutral-500 mb-2">
                <Flame className="size-4"/> Streak
              </div>
              <div className="text-2xl font-semibold">7</div>
              <div className="text-xs text-neutral-500">days of coding in a row</div>
            </CardContent>
          </Card>
        </div>

        {/* Combined Overview: Skills + Highlights */}
        <section className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-lg font-semibold tracking-tight">Performance Overview</div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Skills chart */}
            <Card className="rounded-2xl lg:col-span-2">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2"><BarChart2 className="size-5"/><span className="font-semibold">Tech Stack Proficiency</span></div>
                </div>
                <div className="h-64 -ml-4">
                  {isClient ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={skills} margin={{ left: 10, right: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" stroke="#9ca3af" tick={{ fill: '#6b7280' }} />
                        <YAxis domain={[0, 100]} stroke="#9ca3af" tick={{ fill: '#6b7280' }} />
                        <Tooltip />
                        <Bar dataKey="level" radius={[6, 6, 0, 0]} fill="#94a3b8" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full grid place-items-center text-xs text-neutral-400">
                      Loading chart...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Highlights */}
            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4"><CalendarRange className="size-5"/><span className="font-semibold">Highlights</span></div>
                <ol className="relative border-s border-neutral-200">
                  {extracurriculars.map((e, i) => {
                    const Icon = e.icon;
                    return (
                      <li key={i} className="mb-8 ms-4">
                        <span className="absolute -start-1.5 mt-1 flex size-3.5 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 ring-4 ring-white" />
                        <div className="flex items-start gap-3">
                          <Icon className="size-5 mt-0.5" />
                          <div>
                            <div className="font-medium flex items-center gap-2">{e.title} <Badge variant="outline" className="rounded-full text-xs">{e.date}</Badge></div>
                            <p className="text-sm text-neutral-600 mt-1">{e.desc}</p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Experience timeline */}
        <section className="mt-6">
          <Card className="rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4"><Briefcase className="size-5"/><span className="font-semibold">Experience</span></div>
              <ol className="relative border-s border-neutral-200">
                {experiences.map((ex, i) => (
                  <li key={i} className="mb-8 ms-4">
                    <span className="absolute -start-1.5 mt-1 flex size-3.5 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 ring-4 ring-white" />
                    <div className="flex items-start gap-3">
                      <Briefcase className="size-5 mt-0.5"/>
                      <div>
                        <div className="font-medium">{ex.title} • <span className="text-neutral-600">{ex.org}</span></div>
                        <div className="text-xs text-neutral-500">{ex.range}</div>
                        <p className="text-sm text-neutral-600 mt-1">{ex.desc}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </section>

        {/* Certifications & MOOCs split */}
        <section className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Certifications */}
            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4"><Medal className="size-5"/><span className="font-semibold">Certifications</span></div>
                <div className="space-y-4">
                  {certifications.map((cert, i) => {
                    const Logo = cert.Logo;
                    return (
                      <div key={i} className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2">
                          <Logo />
                          <div>
                            <div className="font-medium">{cert.title}</div>
                            <div className="text-xs text-neutral-500">{cert.org} • {cert.date}</div>
                          </div>
                        </div>
                        <a href={cert.url} target="_blank" rel="noreferrer">
                          <Button variant="secondary" className="rounded-full">View credential <LinkIcon className="size-3 ml-2"/></Button>
                        </a>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* MOOCs */}
            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4"><BookOpen className="size-5"/><span className="font-semibold">MOOCs — Systems & Cloud</span></div>
                <div className="space-y-4">
                  {moocs.map((m, i) => (
                    <div key={i} className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2">
                        <m.Logo />
                        <div>
                          <div className="font-medium">{m.title}</div>
                          <div className="text-xs text-neutral-500">{m.provider}</div>
                        </div>
                      </div>
                      <a href={m.url} target="_blank" rel="noreferrer">
                        <Button variant="secondary" className="rounded-full">Open course <LinkIcon className="size-3 ml-2"/></Button>
                      </a>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <div className="py-10" />
      </main>
    </div>
  );
}
