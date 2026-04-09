export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const YEARS: string[] = (() => {
  const current = new Date().getFullYear();
  return Array.from({ length: 40 }, (_, i) => String(current - i));
})();

export const LANGUAGE_LEVELS = [
  'Native',
  'Fluent',
  'Professional',
  'Conversational',
  'Basic',
];

export const COMMON_LANGUAGES = [
  'English', 'Spanish', 'Mandarin', 'French', 'German',
  'Japanese', 'Arabic', 'Malay', 'Hindi', 'Portuguese',
  'Korean', 'Italian', 'Russian', 'Thai', 'Vietnamese',
];

export const COMMON_SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python',
  'Figma', 'UX Design', 'Marketing', 'SQL', 'AWS', 'Docker', 'Agile',
  'Leadership', 'Communication', 'Project Management', 'Excel',
];

export const formatDate = (month: string, year: string, current: boolean) => {
  if (current) return 'Present';
  if (!month && !year) return '';
  if (!month) return year;
  return `${month.slice(0, 3)} ${year}`;
};
