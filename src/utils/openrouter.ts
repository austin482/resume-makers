const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY as string;
const BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'google/gemini-2.0-flash-001';

async function chat(systemPrompt: string, userMessage: string): Promise<string> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.4,
    }),
  });
  if (!res.ok) throw new Error(`OpenRouter error: ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? '';
}

/** Parse raw resume text into structured JSON */
export async function parseResumeWithAI(rawText: string): Promise<ParsedResume> {
  const system = `You are a resume parser. Extract data from the raw resume text the user provides.
Return ONLY a valid JSON object matching this exact schema — no markdown, no explanation:
{
  "name": "",
  "email": "",
  "phone": "",
  "portfolioLine": "",
  "experiences": [
    { "title": "", "company": "", "startMonth": "", "startYear": "", "endMonth": "", "endYear": "", "current": false, "description": "" }
  ],
  "educations": [
    { "university": "", "course": "", "cgpa": "" }
  ],
  "skills": [""],
  "languages": [
    { "language": "", "level": "" }
  ]
}
For language levels use: Native, Fluent, Professional, Conversational, or Basic.
For months use full name: January, February, etc. Leave fields empty string if not found.`;

  const raw = await chat(system, rawText.slice(0, 6000));
  try {
    const cleaned = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    throw new Error('Failed to parse AI response as JSON');
  }
}

/** Optimize a single job description with action verbs and results */
export async function optimizeDescription(description: string, title: string, company: string): Promise<string> {
  const system = `You are a professional resume writer. Improve the job description text below using strong action verbs and quantifiable achievements. Keep it concise, honest, and in bullet-point format. Do not invent facts — only enhance existing ones. Return only the improved text, no explanation. Do NOT use any Markdown formatting like bold (**text**) or italics. The output must be perfectly plain text.`;
  const msg = `Job Title: ${title}\nCompany: ${company}\n\nDescription:\n${description}`;
  const response = await chat(system, msg);
  return response.replace(/\*\*/g, ''); // Strip any bold asterisks just in case
}

/** Tailor all experience descriptions to match a job description + company — conservatively */
export async function tailorResumeToJob(
  experiences: Array<{ title: string; company: string; description: string }>,
  targetCompany: string,
  jobDescription: string,
): Promise<string[]> {
  const system = `You are a career coach helping a candidate tailor their resume for a specific job.
Your task: Lightly adjust each experience description to naturally include keywords from the job description.
Rules:
- Do NOT invent facts, dates, or job titles
- Keep the core content intact — just rephrase and highlight relevant skills
- Changes should be subtle and professional
- Return ONLY a JSON array of strings — one updated description per experience, in the same order
- No markdown, no explanation`;

  const msg = `Target Company: ${targetCompany}\n\nJob Description:\n${jobDescription.slice(0, 2000)}\n\nExperiences:\n${JSON.stringify(experiences.map(e => ({ title: e.title, company: e.company, description: e.description })))}`;
  const raw = await chat(system, msg);
  try {
    const cleaned = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return experiences.map(e => e.description);
  }
}

export interface ParsedResume {
  name: string;
  email: string;
  phone: string;
  portfolioLine: string;
  experiences: Array<{
    title: string; company: string;
    startMonth: string; startYear: string;
    endMonth: string; endYear: string;
    current: boolean; description: string;
  }>;
  educations: Array<{ university: string; course: string; cgpa: string }>;
  skills: string[];
  languages: Array<{ language: string; level: string }>;
}
