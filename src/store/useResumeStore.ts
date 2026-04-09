import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Experience {
  id: string;
  title: string;
  company: string;
  description: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  current: boolean;
}

export interface Education {
  id: string;
  university: string;
  course: string;
  cgpa: string;
}

export interface LanguageEntry {
  language: string;
  level: string;
}

export interface ResumeState {
  hasResume: boolean | null;
  setHasResume: (has: boolean) => void;

  /* Path A Additional Info */
  targetCompany: string;
  jobDescription: string;
  jobLink: string;
  setTargetMatch: (data: Partial<{ targetCompany: string; jobDescription: string; jobLink: string }>) => void;

  /* Personal Info */
  personalInfo: {
    name: string;
    phone: string;
    email: string;
    photo: string;
    portfolioLine: string;
  };
  setPersonalInfo: (info: Partial<ResumeState['personalInfo']>) => void;

  /* Experience */
  experiences: Experience[];
  addExperience: (exp: Experience) => void;
  updateExperience: (id: string, exp: Partial<Experience>) => void;
  removeExperience: (id: string) => void;

  /* Education */
  educations: Education[];
  addEducation: (edu: Education) => void;
  updateEducation: (id: string, edu: Partial<Education>) => void;
  removeEducation: (id: string) => void;

  /* Skills */
  skills: string[];
  setSkills: (skills: string[]) => void;

  /* Languages with levels */
  languages: LanguageEntry[];
  addLanguage: (entry: LanguageEntry) => void;
  updateLanguage: (index: number, entry: Partial<LanguageEntry>) => void;
  removeLanguage: (index: number) => void;

  /* Builder Settings */
  template: 'professional' | 'creative' | 'minimal' | 'executive' | 'modern' | 'compact';
  setTemplate: (tpl: ResumeState['template']) => void;
  
  reset: () => void;
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => ({
      hasResume: null,
      setHasResume: (has) => set({ hasResume: has }),

      targetCompany: '',
      jobDescription: '',
      jobLink: '',
      setTargetMatch: (data) => set((state) => ({ ...state, ...data })),

      personalInfo: { name: '', phone: '', email: '', photo: '', portfolioLine: '' },
      setPersonalInfo: (info) => set((state) => ({ personalInfo: { ...state.personalInfo, ...info } })),

      experiences: [],
      addExperience: (exp) => set((state) => ({ experiences: [...state.experiences, exp] })),
      updateExperience: (id, newExp) => set((state) => ({
        experiences: state.experiences.map((e) => e.id === id ? { ...e, ...newExp } : e),
      })),
      removeExperience: (id) => set((state) => ({ experiences: state.experiences.filter((e) => e.id !== id) })),

      educations: [],
      addEducation: (edu) => set((state) => ({ educations: [...state.educations, edu] })),
      updateEducation: (id, newEdu) => set((state) => ({
        educations: state.educations.map((e) => e.id === id ? { ...e, ...newEdu } : e),
      })),
      removeEducation: (id) => set((state) => ({ educations: state.educations.filter((e) => e.id !== id) })),

      skills: [],
      setSkills: (skills) => set({ skills }),

      languages: [],
      addLanguage: (entry) => set((state) => ({ languages: [...state.languages, entry] })),
      updateLanguage: (index, entry) => set((state) => ({
        languages: state.languages.map((l, i) => i === index ? { ...l, ...entry } : l),
      })),
      removeLanguage: (index) => set((state) => ({ languages: state.languages.filter((_, i) => i !== index) })),

      template: 'professional',
      setTemplate: (template) => set({ template }),
      
      reset: () => set({
        hasResume: null,
        targetCompany: '',
        jobDescription: '',
        jobLink: '',
        personalInfo: { name: '', phone: '', email: '', photo: '', portfolioLine: '' },
        experiences: [],
        educations: [],
        skills: [],
        languages: [],
        template: 'professional',
      }),
    }),
    {
      name: 'resume-builder-storage',
    }
  )
);
