import type { ResumeState } from '../store/useResumeStore';

type ParsedResume = Pick<ResumeState, 'personalInfo' | 'experiences' | 'educations' | 'skills' | 'languages'>;

const MONTHS_MAP: Record<string, string> = {
  jan: 'January', feb: 'February', mar: 'March', apr: 'April',
  may: 'May', jun: 'June', jul: 'July', aug: 'August',
  sep: 'September', oct: 'October', nov: 'November', dec: 'December',
};

function parseMonthYear(text: string): { month: string; year: string } {
  const monthMatch = text.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\b/i);
  const yearMatch = text.match(/\b(19|20)\d{2}\b/);
  return {
    month: monthMatch ? (MONTHS_MAP[monthMatch[1].toLowerCase()] ?? '') : '',
    year: yearMatch ? yearMatch[0] : '',
  };
}

function parseDateRange(text: string): {
  startMonth: string; startYear: string;
  endMonth: string; endYear: string; current: boolean;
} {
  const current = /present|current|now|ongoing/i.test(text);
  // Try "Month Year – Month Year" or "YYYY – YYYY"
  const parts = text.split(/[-–—to]+/i).map(p => p.trim());
  const start = parseMonthYear(parts[0] ?? '');
  const end = current ? { month: '', year: '' } : parseMonthYear(parts[1] ?? '');
  return { startMonth: start.month, startYear: start.year, endMonth: end.month, endYear: end.year, current };
}

// Common section header patterns
const SECTION_PATTERNS = {
  experience: /^(work\s*experience|experience|employment|professional\s*experience|work\s*history|career)/im,
  education: /^(education|academic|qualification|studies)/im,
  skills: /^(skills|technical\s*skills|competencies|technologies|expertise|tools)/im,
  languages: /^(languages?|language\s*proficiency)/im,
};

function splitIntoSections(text: string): Record<string, string> {
  const lines = text.split(/\n+/).map(l => l.trim()).filter(Boolean);
  const sections: Record<string, string[]> = { header: [], experience: [], education: [], skills: [], languages: [] };
  let current = 'header';

  for (const line of lines) {
    if (SECTION_PATTERNS.experience.test(line)) { current = 'experience'; continue; }
    if (SECTION_PATTERNS.education.test(line)) { current = 'education'; continue; }
    if (SECTION_PATTERNS.skills.test(line)) { current = 'skills'; continue; }
    if (SECTION_PATTERNS.languages.test(line)) { current = 'languages'; continue; }
    sections[current].push(line);
  }

  return Object.fromEntries(Object.entries(sections).map(([k, v]) => [k, v.join('\n')]));
}

function parsePersonalInfo(headerText: string): ParsedResume['personalInfo'] {
  const emailMatch = headerText.match(/[\w.+-]+@[\w-]+\.[a-z]{2,}/i);
  const phoneMatch = headerText.match(/(\+?[\d][\d\s\-().]{6,20})/);
  const urlMatch = headerText.match(/https?:\/\/[^\s]+|linkedin\.com\/in\/[^\s]+|github\.com\/[^\s]+/i);

  // Name is usually the first non-empty line before contact details
  const lines = headerText.split('\n').map(l => l.trim()).filter(Boolean);
  const nameLine = lines.find(l =>
    !l.includes('@') && !l.match(/^\+?[\d\s().-]{7,}$/) && l.length > 2 && l.length < 60 && !/http/i.test(l)
  ) ?? '';

  return {
    name: nameLine,
    email: emailMatch?.[0] ?? '',
    phone: phoneMatch?.[0]?.trim() ?? '',
    portfolioLine: urlMatch?.[0] ?? '',
    photo: '',
  };
}

function parseExperiences(expText: string): ParsedResume['experiences'] {
  if (!expText.trim()) return [];

  // Split by lines that look like a job title / company (bold pattern or date pattern)
  const blocks = expText.split(/\n(?=[A-Z][^a-z\n]{0,40}(?:\n|$))/);
  const results: ParsedResume['experiences'] = [];

  for (const block of blocks) {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) continue;

    // Look for a date range in the block
    const dateLine = lines.find(l => /\b(19|20)\d{2}\b/.test(l) || /present|current/i.test(l));
    const dateInfo = dateLine ? parseDateRange(dateLine) : { startMonth: '', startYear: '', endMonth: '', endYear: '', current: false };

    // Title = first line that isn't a date
    const title = lines.find(l => l !== dateLine && l.length > 2 && l.length < 80) ?? '';
    // Company = second non-date line
    const company = lines.filter(l => l !== dateLine && l !== title).find(l => l.length > 1 && l.length < 80) ?? '';
    // Description = remaining lines
    const descLines = lines.filter(l => l !== dateLine && l !== title && l !== company);
    const description = descLines.join('\n');

    if (title || company) {
      results.push({
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        title,
        company,
        description,
        ...dateInfo,
      });
    }
  }

  return results.slice(0, 5); // cap at 5 entries
}

function parseEducations(eduText: string): ParsedResume['educations'] {
  if (!eduText.trim()) return [];

  const blocks = eduText.split(/\n{2,}/);
  const results: ParsedResume['educations'] = [];

  for (const block of blocks) {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) continue;

    const cgpaMatch = block.match(/(?:cgpa|gpa|grade)[:\s]+([0-9.]+)/i);
    const university = lines.find(l => /university|college|institute|school|academy/i.test(l)) ?? lines[0] ?? '';
    const course = lines.find(l => l !== university && /bachelor|master|diploma|degree|b\.sc|m\.sc|phd|mba|b\.eng/i.test(l))
      ?? lines.find(l => l !== university) ?? '';

    if (university || course) {
      results.push({
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        university,
        course,
        cgpa: cgpaMatch?.[1] ?? '',
      });
    }
  }

  return results.slice(0, 3);
}

function parseSkills(skillsText: string): string[] {
  if (!skillsText.trim()) return [];
  // Skills are often comma/pipe/bullet separated
  return skillsText
    .split(/[,|•·\n\/]/)
    .map(s => s.trim().replace(/^[-*]\s*/, ''))
    .filter(s => s.length > 1 && s.length < 40 && !/^(skills|technologies|tools)$/i.test(s))
    .slice(0, 20);
}

function parseLanguages(langText: string): ParsedResume['languages'] {
  if (!langText.trim()) return [];
  const LEVEL_PATTERN = /native|fluent|professional|conversational|basic|beginner|intermediate|advanced/i;

  return langText
    .split(/[,\n|•·]/)
    .map(l => l.trim())
    .filter(l => l.length > 1)
    .map(l => {
      const levelMatch = l.match(LEVEL_PATTERN);
      const level = levelMatch ? levelMatch[0].charAt(0).toUpperCase() + levelMatch[0].slice(1).toLowerCase() : '';
      const language = l.replace(LEVEL_PATTERN, '').replace(/[-:()]/g, '').trim();
      return { language, level };
    })
    .filter(l => l.language.length > 1)
    .slice(0, 8);
}

export function parseResumeText(rawText: string): ParsedResume {
  const sections = splitIntoSections(rawText);
  return {
    personalInfo: parsePersonalInfo(sections['header'] ?? rawText.slice(0, 500)),
    experiences: parseExperiences(sections['experience'] ?? ''),
    educations: parseEducations(sections['education'] ?? ''),
    skills: parseSkills(sections['skills'] ?? ''),
    languages: parseLanguages(sections['languages'] ?? ''),
  };
}
