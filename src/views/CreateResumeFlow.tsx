import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Plus, Trash2, FileText, Check } from 'lucide-react';
import { useResumeStore } from '../store/useResumeStore';

import { MONTHS, YEARS, COMMON_SKILLS, COMMON_LANGUAGES, LANGUAGE_LEVELS } from '../utils/constants';

const STEPS = ['Personal', 'Experience', 'Education', 'Skills'];

// ── Shared date dropdowns ──────────────────────────────────────────
const DateSelect = ({
  month, year, onMonthChange, onYearChange, placeholder = 'Month',
}: {
  month: string; year: string;
  onMonthChange: (v: string) => void;
  onYearChange: (v: string) => void;
  placeholder?: string;
}) => (
  <div className="flex gap-2 w-full">
    <select className="form-input w-full" value={month} onChange={e => onMonthChange(e.target.value)}>
      <option value="">{placeholder}</option>
      {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
    </select>
    <select className="form-input w-full" value={year} onChange={e => onYearChange(e.target.value)}>
      <option value="">Year</option>
      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
    </select>
  </div>
);

// ── Skills tag input ──────────────────────────────────────────────
const SkillsInput = () => {
  const store = useResumeStore();
  const [input, setInput] = useState('');

  const addSkill = (val: string) => {
    const trimmed = val.trim();
    if (trimmed && !store.skills.includes(trimmed)) {
      store.setSkills([...store.skills.filter(Boolean), trimmed]);
    }
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(input);
    } else if (e.key === 'Backspace' && !input && store.skills.length) {
      store.setSkills(store.skills.slice(0, -1));
    }
  };

  return (
    <div>
      {/* Tag pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', padding: '0.625rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-main)', minHeight: '48px', cursor: 'text' }}
        onClick={() => document.getElementById('skills-input')?.focus()}
      >
        {store.skills.filter(Boolean).map(s => (
          <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.2rem 0.6rem', background: 'var(--primary-100)', color: 'var(--primary-700)', borderRadius: 'var(--radius-pill)', fontSize: '0.8125rem', fontWeight: 500 }}>
            {s}
            <button type="button" onClick={(e) => { e.stopPropagation(); store.setSkills(store.skills.filter(x => x !== s)); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-500)', lineHeight: 1, padding: 0, fontSize: '1rem' }}>×</button>
          </span>
        ))}
        <input
          id="skills-input"
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => input && addSkill(input)}
          placeholder={store.skills.length === 0 ? 'Type a skill, press Enter or comma to add…' : ''}
          style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.9rem', minWidth: '120px', flex: 1, color: 'var(--text-primary)' }}
        />
      </div>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.3rem' }}>Press Enter or , to add. Backspace to remove last.</p>
      {/* Quick add chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.6rem' }}>
        {COMMON_SKILLS.filter(s => !store.skills.includes(s)).slice(0, 10).map(s => (
          <button key={s} type="button" className="chip chip-neutral" onClick={() => store.setSkills([...store.skills.filter(Boolean), s])}>+ {s}</button>
        ))}
      </div>
    </div>
  );
};

// ── Language row ──────────────────────────────────────────────────
const LanguageRow = ({ index }: { index: number }) => {
  const store = useResumeStore();
  const lang = store.languages[index];
  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <select
        className="form-input w-full"
        value={lang.language}
        onChange={e => store.updateLanguage(index, { language: e.target.value })}
      >
        <option value="">Select language…</option>
        {COMMON_LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
      </select>
      <select
        className="form-input"
        style={{ minWidth: '140px' }}
        value={lang.level}
        onChange={e => store.updateLanguage(index, { level: e.target.value })}
      >
        <option value="">Level…</option>
        {LANGUAGE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
      </select>
      <button type="button" onClick={() => store.removeLanguage(index)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', flexShrink: 0, padding: '0.25rem' }}>
        <Trash2 size={16} />
      </button>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────
const CreateResumeFlow: React.FC = () => {
  const navigate = useNavigate();
  const store = useResumeStore();
  const [step, setStep] = useState(1);

  const totalSteps = STEPS.length;
  const progress = (step / totalSteps) * 100;

  const nextStep = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (step < totalSteps) setStep(step + 1);
    else navigate('/builder');
  };
  const prevStep = () => { if (step > 1) setStep(step - 1); else navigate(-1); };

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--bg-main)' }}>

      {/* Header */}
      <header className="glass-header">
        <div style={{ padding: '0.875rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={prevStep} className="btn btn-secondary flex items-center gap-2" style={{ padding: '0.45rem 1rem', fontSize: '0.875rem' }}>
            <ArrowLeft size={15} /> Back
          </button>
          <div className="flex items-center gap-2" style={{ color: 'var(--primary-600)', fontWeight: 700, fontFamily: 'var(--font-heading)', fontSize: '1rem' }}>
            <FileText size={18} /> Resume Makers
          </div>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Step {step}/{totalSteps}</span>
        </div>
        <div className="step-progress-bar" style={{ borderRadius: 0 }}>
          <div className="step-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <div style={{ maxWidth: '620px', width: '100%', margin: '0 auto', padding: '2rem 1.25rem 3rem' }}>

        {/* Step tab indicators */}
        <div className="flex justify-between" style={{ marginBottom: '2rem', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '20px', left: 0, right: 0, height: '2px', background: 'var(--border-color)', zIndex: 0 }} />
          {STEPS.map((label, i) => {
            const s = i + 1;
            const done = step > s;
            const active = step === s;
            return (
              <div key={s} className="flex flex-col items-center gap-1" style={{ zIndex: 1, background: 'var(--bg-main)', padding: '0 6px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: done ? 'var(--primary-600)' : active ? 'white' : 'var(--surface-hover)',
                  color: done ? 'white' : active ? 'var(--primary-600)' : 'var(--text-tertiary)',
                  border: `2px solid ${done || active ? 'var(--primary-600)' : 'var(--border-color)'}`,
                  fontWeight: 700, fontSize: '0.875rem', transition: 'all 0.3s',
                  boxShadow: active ? '0 0 0 4px var(--primary-100)' : 'none',
                }}>
                  {done ? <Check size={17} /> : s}
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: active ? 600 : 400, color: active ? 'var(--primary-600)' : done ? 'var(--text-secondary)' : 'var(--text-tertiary)' }}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        <form onSubmit={nextStep} className="flex flex-col" style={{ gap: '1.25rem' }}>

          {/* ── STEP 1: Personal ─────────────────── */}
          {step === 1 && (
            <div className="animate-slide-right flex flex-col" style={{ gap: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', margin: '0 0 0.25rem', fontWeight: 700 }}>Personal Details</h2>
                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9375rem' }}>Let's start with the basics.</p>
              </div>

              <div className="premium-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Photo + Name row */}
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                    {store.personalInfo.photo
                      ? <img src={store.personalInfo.photo} alt="Preview" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-200)' }} />
                      : <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary-50)', border: '2px dashed var(--primary-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', color: 'var(--primary-300)', fontWeight: 700 }}>
                          {store.personalInfo.name ? store.personalInfo.name[0].toUpperCase() : '?'}
                        </div>
                    }
                    <label className="chip chip-neutral" style={{ cursor: 'pointer', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                      Upload photo
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
                        if (e.target.files?.[0]) store.setPersonalInfo({ photo: URL.createObjectURL(e.target.files[0]) });
                      }} />
                    </label>
                  </div>
                  <div style={{ flex: 1, minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div>
                      <label className="form-label">Full Name *</label>
                      <input type="text" required className="form-input" placeholder="Jane Smith" value={store.personalInfo.name} onChange={e => store.setPersonalInfo({ name: e.target.value })} />
                    </div>
                    <div>
                      <label className="form-label">Email *</label>
                      <input type="email" required className="form-input" placeholder="jane@example.com" value={store.personalInfo.email} onChange={e => store.setPersonalInfo({ email: e.target.value })} />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '160px' }}>
                    <label className="form-label">Phone *</label>
                    <input type="tel" required className="form-input" placeholder="+60 12-345 6789" value={store.personalInfo.phone} onChange={e => store.setPersonalInfo({ phone: e.target.value })} />
                  </div>
                  <div style={{ flex: 1, minWidth: '160px' }}>
                    <label className="form-label">Portfolio / LinkedIn</label>
                    <input type="url" className="form-input" placeholder="https://linkedin.com/in/..." value={store.personalInfo.portfolioLine} onChange={e => store.setPersonalInfo({ portfolioLine: e.target.value })} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Experience ───────────────── */}
          {step === 2 && (
            <div className="animate-slide-right flex flex-col" style={{ gap: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', margin: '0 0 0.25rem', fontWeight: 700 }}>Work Experience</h2>
                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9375rem' }}>Add roles — use AI to polish descriptions.</p>
              </div>

              {store.experiences.map((exp, i) => (
                <div key={exp.id} className="premium-card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--primary-700)', fontSize: '0.9rem' }}>Experience {i + 1}</span>
                    <button type="button" onClick={() => store.removeExperience(exp.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: '140px' }}>
                        <label className="form-label">Job Title *</label>
                        <input type="text" className="form-input" placeholder="Software Engineer" value={exp.title} onChange={e => store.updateExperience(exp.id, { title: e.target.value })} required />
                      </div>
                      <div style={{ flex: 1, minWidth: '140px' }}>
                        <label className="form-label">Company *</label>
                        <input type="text" className="form-input" placeholder="Acme Corp" value={exp.company} onChange={e => store.updateExperience(exp.id, { company: e.target.value })} required />
                      </div>
                    </div>

                    {/* Date selectors */}
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: '200px' }}>
                        <label className="form-label">Start Date</label>
                        <DateSelect
                          month={exp.startMonth} year={exp.startYear}
                          onMonthChange={v => store.updateExperience(exp.id, { startMonth: v })}
                          onYearChange={v => store.updateExperience(exp.id, { startYear: v })}
                          placeholder="Month"
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: '200px' }}>
                        <label className="form-label">End Date</label>
                        {exp.current
                          ? <div className="form-input" style={{ color: 'var(--text-tertiary)', background: 'var(--surface-hover)' }}>Present</div>
                          : <DateSelect
                              month={exp.endMonth} year={exp.endYear}
                              onMonthChange={v => store.updateExperience(exp.id, { endMonth: v })}
                              onYearChange={v => store.updateExperience(exp.id, { endYear: v })}
                              placeholder="Month"
                            />
                        }
                      </div>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', cursor: 'pointer', userSelect: 'none' }}>
                      <input type="checkbox" checked={exp.current} onChange={e => store.updateExperience(exp.id, { current: e.target.checked })} />
                      I currently work here
                    </label>

                    {/* Description */}
                    <div>
                      <label className="form-label">Job Description</label>
                      <textarea
                        className="form-input"
                        rows={4}
                        placeholder="Describe what you did, achievements, impact…"
                        value={exp.description}
                        onChange={e => store.updateExperience(exp.id, { description: e.target.value })}
                        style={{ resize: 'vertical' }}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button type="button" className="btn btn-secondary w-full" style={{ borderStyle: 'dashed', borderWidth: '1.5px' }}
                onClick={() => store.addExperience({ id: Date.now().toString(), title: '', company: '', description: '', startMonth: '', startYear: '', endMonth: '', endYear: '', current: false })}>
                <Plus size={15} /> Add Experience
              </button>
            </div>
          )}

          {/* ── STEP 3: Education ───────────────── */}
          {step === 3 && (
            <div className="animate-slide-right flex flex-col" style={{ gap: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', margin: '0 0 0.25rem', fontWeight: 700 }}>Education</h2>
                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9375rem' }}>Add your academic background.</p>
              </div>

              {store.educations.map((edu, i) => (
                <div key={edu.id} className="premium-card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--primary-700)', fontSize: '0.9rem' }}>Education {i + 1}</span>
                    <button type="button" onClick={() => store.removeEducation(edu.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div>
                      <label className="form-label">University / Institution *</label>
                      <input type="text" className="form-input" placeholder="University of Example" value={edu.university} onChange={e => store.updateEducation(edu.id, { university: e.target.value })} required />
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <div style={{ flex: 1 }}>
                        <label className="form-label">Course / Degree *</label>
                        <input type="text" className="form-input" placeholder="B.Sc Computer Science" value={edu.course} onChange={e => store.updateEducation(edu.id, { course: e.target.value })} required />
                      </div>
                      <div style={{ width: '110px' }}>
                        <label className="form-label">CGPA</label>
                        <input type="text" className="form-input" placeholder="3.8" value={edu.cgpa} onChange={e => store.updateEducation(edu.id, { cgpa: e.target.value })} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button type="button" className="btn btn-secondary w-full" style={{ borderStyle: 'dashed', borderWidth: '1.5px' }}
                onClick={() => store.addEducation({ id: Date.now().toString(), university: '', course: '', cgpa: '' })}>
                <Plus size={15} /> Add Education
              </button>
            </div>
          )}

          {/* ── STEP 4: Skills & Languages ──────── */}
          {step === 4 && (
            <div className="animate-slide-right flex flex-col" style={{ gap: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', margin: '0 0 0.25rem', fontWeight: 700 }}>Skills & Languages</h2>
                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9375rem' }}>Type custom or tap suggestions below.</p>
              </div>

              {/* Skills */}
              <div className="premium-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 0.75rem' }}>Skills</h3>
                <SkillsInput />
              </div>

              {/* Languages */}
              <div className="premium-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 0.75rem' }}>Languages</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {store.languages.map((_, i) => <LanguageRow key={i} index={i} />)}
                </div>
                <button type="button" className="btn btn-secondary" style={{ marginTop: '0.75rem', borderStyle: 'dashed', width: '100%' }}
                  onClick={() => store.addLanguage({ language: '', level: '' })}>
                  <Plus size={14} /> Add Language
                </button>
              </div>
            </div>
          )}

          {/* Footer nav */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>{STEPS[step - 1]}</span>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem', gap: '0.5rem' }}>
              {step < totalSteps ? `Next: ${STEPS[step]}` : '🎉 Generate Resume'} <ArrowRight size={17} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateResumeFlow;
