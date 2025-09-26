'use client';

import React, { useMemo, useState } from 'react';
import {
  Trophy,
  Medal,
  Flame,
  Star,
  Users,
  Search,
  Filter,
  Download,
  ArrowUpDown,
} from 'lucide-react';

type Student = {
  id: string;
  name: string;
  roll: string;
  institute: string;
  location: string;
  cgpa: number;
  score: number;
  projects: number;
  streak: number;
  skills: string[];
  avatarBg: string;
};

// NEW: generator for 100 MSIT students with diverse skills
function generateStudents(count: number): Student[] {
  const firstNames = [
    'Aarav','Vivaan','Aditya','Vihaan','Arjun','Reyansh','Mohammad','Sai','Krishna','Ishaan',
    'Rohan','Atharv','Kartik','Ritvik','Siddharth','Yuvraj','Hrithik','Dev','Kabir','Aryan',
    'Ananya','Aarohi','Diya','Ira','Aditi','Anika','Navya','Kavya','Myra','Saanvi',
    'Ishita','Riya','Nitya','Meera','Nandini','Aisha','Prachi','Aarya','Tara','Trisha'
  ];
  const lastNames = [
    'Sharma','Verma','Gupta','Agarwal','Mehta','Patel','Iyer','Nair','Menon','Reddy',
    'Rao','Kapoor','Bhatia','Malhotra','Chopra','Khanna','Kaur','Singh','Bose','Chatterjee',
    'Mukherjee','Banerjee','Das','Ghosh','Pillai','Kulkarni','Deshmukh','Pandey','Yadav','Tripathi'
  ];
  const skillPool = [
    'React','Next.js','Angular','Vue','Node.js','Express','NestJS','TypeScript','JavaScript','HTML',
    'CSS','Tailwind','Redux','GraphQL','REST','Python','Django','Flask','FastAPI','Pandas',
    'NumPy','ML','DL','NLP','LLMs','Data Eng','Spark','Hadoop','Airflow','SQL',
    'PostgreSQL','MySQL','MongoDB','Redis','Kafka','Docker','K8s','AWS','GCP','Azure',
    'CI/CD','Git','Jest','Cypress','Playwright','Go','Rust','C++','Java','Spring'
  ];
  const colors = [
    '#CDE6F5', // pastel blue
    '#DFF6E8', // pastel mint
    '#E9E2F8', // pastel lavender
    '#FDE2E4', // pastel rose
    '#FFF4CC', // pastel yellow
    '#E3F2FD', // pastel sky
    '#FFDDE2', // pastel pink
    '#D3F8E2', // pastel green
    '#E7E5FF', // pastel periwinkle
    '#F3E8FF', // pastel purple
  ];

  const students: Student[] = [];
  const totalCombos = firstNames.length * lastNames.length;
  const toCount = Math.min(count, totalCombos);

  for (let i = 0; i < toCount; i++) {
    const f = firstNames[i % firstNames.length];
    const l = lastNames[Math.floor(i / firstNames.length) % lastNames.length];
    const name = `${f} ${l}`;
    const rankIndex = i + 1;
    const roll = `MSIT-CSE2028-${rankIndex.toString().padStart(3, '0')}`;
    const cgpa = Math.min(10, parseFloat((7.2 + (i % 28) * 0.1).toFixed(1))); // 7.2 - 9.9
    const score = 70 + ((i * 3) % 31); // 70 - 100
    const projects = 3 + (i % 13); // 3 - 15
    const streak = (i * 4) % 35; // 0 - 34
    const s1 = skillPool[i % skillPool.length];
    const s2 = skillPool[(i * 7) % skillPool.length];
    const s3 = skillPool[(i * 13) % skillPool.length];
    const avatarBg = colors[i % colors.length];

    students.push({
      id: `${name.toLowerCase().replace(/\s+/g, '-')}-${rankIndex}`,
      name,
      roll,
      institute: 'MSIT',
      location: 'Kolkata, IN',
      cgpa,
      score,
      projects,
      streak,
      skills: Array.from(new Set([s1, s2, s3])),
      avatarBg,
    });
  }
  return students;
}

// REPLACED: hardcoded SAMPLE with generated 100 students from MSIT
const SAMPLE: Student[] = generateStudents(100);

type SortKey = 'score' | 'cgpa' | 'projects' | 'streak';

function Avatar({ name, bg }: { name: string; bg: string }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <div
      style={{ background: bg }}
      className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-gray-700"
      aria-hidden
    >
      {initials}
    </div>
  );
}

function Chip({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-700 ring-1 ring-inset ring-gray-200">
      {text}
    </span>
  );
}

function Stat({ icon: Icon, label, value, accent }: { icon: any; label: string; value: string; accent?: string }) {
  return (
    <div className="flex flex-1 items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className={`rounded-md p-2 ${accent ?? 'bg-blue-50 text-blue-500'}`}>
        <Icon size={18} />
      </div>
      <div>
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-lg font-semibold text-gray-900">{value}</div>
      </div>
    </div>
  );
}

export default function CSERankingPage() {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('score');
  const [asc, setAsc] = useState(false);
  const [skillFilter, setSkillFilter] = useState<string>('All');

  const allSkills = useMemo(() => {
    const s = new Set<string>();
    SAMPLE.forEach((x) => x.skills.forEach((k) => s.add(k)));
    return ['All', ...Array.from(s).sort()];
  }, []);

  const ranked = useMemo(() => {
    let list = [...SAMPLE];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (x) =>
          x.name.toLowerCase().includes(q) ||
          x.roll.toLowerCase().includes(q) ||
          x.institute.toLowerCase().includes(q),
      );
    }
    if (skillFilter !== 'All') {
      list = list.filter((x) => x.skills.includes(skillFilter));
    }
    list.sort((a, b) => {
      const d = (b[sortKey] as number) - (a[sortKey] as number);
      return asc ? -d : d;
    });
    return list.map((x, i) => ({ ...x, rank: i + 1 }));
  }, [query, sortKey, asc, skillFilter]);

  const top3 = ranked.slice(0, 3);
  const rest = ranked.slice(3);

  const avgCgpa = useMemo(
    () => (SAMPLE.reduce((s, x) => s + x.cgpa, 0) / SAMPLE.length).toFixed(2),
    [],
  );
  const avgScore = useMemo(
    () => Math.round(SAMPLE.reduce((s, x) => s + x.score, 0) / SAMPLE.length).toString(),
    [],
  );

  function exportCSV() {
    const header = ['Rank', 'Name', 'Roll', 'Institute', 'CGPA', 'Score', 'Projects', 'Streak', 'Skills'];
    const rows = ranked.map((x: any) => [
      x.rank,
      x.name,
      x.roll,
      x.institute,
      x.cgpa,
      x.score,
      x.projects,
      x.streak,
      x.skills.join('|'),
    ]);
    const csv = [header, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cse-2028-rankings.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Trophy className="text-amber-400" size={22} />
            {/* UPDATED: Reflect MSIT in title */}
            <h1 className="text-xl font-semibold text-gray-900">MSIT • CSE 2028 • Rankings</h1>
          </div>
          <div className="text-sm text-gray-600">Admin • Leaderboard</div>
        </div>
        <p className="text-sm text-gray-600">
          Ranked by composite score derived from CGPA, projects, activity streak, and skills.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={Users} label="Total Students" value={`${SAMPLE.length}`} />
        <Stat icon={Star} label="Average CGPA" value={avgCgpa} accent="bg-violet-50 text-violet-500" />
        <Stat icon={Medal} label="Average Score" value={avgScore} accent="bg-amber-50 text-amber-500" />
        <Stat icon={Flame} label="Top Streak" value={`${Math.max(...SAMPLE.map((x) => x.streak))} days`} accent="bg-rose-50 text-rose-500" />
      </div>

      {/* Top 3 podium */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {top3.map((s, idx) => (
          <div key={s.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar name={s.name} bg={s.avatarBg} />
                <div>
                  <div className="font-semibold text-gray-900">{s.name}</div>
                  <div className="text-xs text-gray-600">{s.institute}</div>
                </div>
              </div>
              <div className="flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-amber-500 ring-1 ring-amber-200">
                <Medal size={16} />
                <span className="text-xs font-semibold">#{idx + 1}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-md bg-gray-50 p-2">
                <div className="text-[11px] text-gray-500">CGPA</div>
                <div className="text-sm font-semibold text-gray-900">{s.cgpa}</div>
              </div>
              <div className="rounded-md bg-gray-50 p-2">
                <div className="text-[11px] text-gray-500">Score</div>
                <div className="text-sm font-semibold text-gray-900">{s.score}</div>
              </div>
              <div className="rounded-md bg-gray-50 p-2">
                <div className="text-[11px] text-gray-500">Streak</div>
                <div className="text-sm font-semibold text-gray-900">{s.streak}d</div>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {s.skills.map((k) => (
                <Chip key={k} text={k} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col items-stretch justify-between gap-3 md:flex-row">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              placeholder="Search name, roll, or institute..."
              className="w-full rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm outline-none ring-0 placeholder:text-gray-400 focus:border-gray-300"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <select
              className="rounded-md border border-gray-200 bg-white px-2 py-2 text-sm"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
            >
              {allSkills.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button
              className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
              onClick={() => setAsc((p) => !p)}
              title="Toggle sort order"
            >
              <ArrowUpDown size={16} />
              {asc ? 'Asc' : 'Desc'}
            </button>
            <select
              className="rounded-md border border-gray-200 bg-white px-2 py-2 text-sm"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
            >
              <option value="score">Score</option>
              <option value="cgpa">CGPA</option>
              <option value="projects">Projects</option>
              <option value="streak">Streak</option>
            </select>
          </div>
        </div>
        <div>
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="max-h-[60vh] overflow-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead className="sticky top-0 z-10 bg-gray-50 text-left text-xs text-gray-600">
              <tr>
                <th className="px-4 py-3 font-medium">Rank</th>
                <th className="px-4 py-3 font-medium">Student</th>
                <th className="px-4 py-3 font-medium">CGPA</th>
                <th className="px-4 py-3 font-medium">Score</th>
                <th className="px-4 py-3 font-medium">Projects</th>
                <th className="px-4 py-3 font-medium">Streak</th>
                <th className="px-4 py-3 font-medium">Skills</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {rest.map((s) => (
                <tr key={s.id} className="border-t border-gray-100 hover:bg-gray-50/60">
                  <td className="px-4 py-3 font-semibold text-gray-900">#{(s as any).rank}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={s.name} bg={s.avatarBg} />
                      <div className="min-w-0">
                        <div className="truncate font-medium text-gray-900">{s.name}</div>
                        <div className="truncate text-xs text-gray-600">{s.roll} • {s.institute}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{s.cgpa}</td>
                  <td className="px-4 py-3">{s.score}</td>
                  <td className="px-4 py-3">{s.projects}</td>
                  <td className="px-4 py-3">{s.streak}d</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {s.skills.map((k) => (
                        <Chip key={k} text={k} />
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
              {rest.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-500">
                    No students match current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer note */}
      <div className="text-center text-xs text-gray-500">
        Leaderboard updates daily. Scoring weights are configurable in Admin settings.
      </div>
    </div>
  );
}
