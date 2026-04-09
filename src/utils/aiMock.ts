import { optimizeDescription } from './openrouter';

/** Used by the "Optimize with AI" button on job description fields */
export async function optimizeTextMock(
  description: string,
  title = '',
  company = '',
): Promise<string> {
  try {
    return await optimizeDescription(description, title, company);
  } catch {
    // Fallback if API fails
    return description;
  }
}
