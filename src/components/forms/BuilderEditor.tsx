import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { Plus, Trash2, ChevronDown, ChevronUp, Camera, Sparkles, Loader2 } from 'lucide-react';
import { MONTHS, YEARS, COMMON_SKILLS, COMMON_LANGUAGES, LANGUAGE_LEVELS } from '../../utils/constants';
import { optimizeDescription } from '../../utils/openrouter';

// ── Date dropdowns ────────────────────────────────────────────────
const DateSelect = ({ month, year, onMonthChange, onYearChange }: {
  month: string; year: string;
  onMonthChange: (v: string) => void;
  onYearChange: (v: string) => void;
}) => (
  <div className="flex gap-2">
    <select className="form-input w-full" value={month} onChange={e => onMonthChange(e.target.value)}>
      <option value="">Month</option>
      {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
    </select>
    <select className="form-input w-full" value={year} onChange={e => onYearChange(e.target.value)}>
      <option value="">Year</option>
      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
    </select>
  </div>
);

// ── Skill tag input ───────────────────────────────────────────────
const SkillsTagInput = () => {
  const store = useResumeStore();
  const [input, setInput] = useState('');

  const addSkill = (val: string) => {
    const trimmed = val.trim();
    if (trimmed && !store.skills.includes(trimmed)) {
      store.setSkills([...store.skills.filter(Boolean), trimmed]);
    }
    setInput('');
  };

  return (
    <div>
      <div
        style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-main)', cursor: 'text', minHeight: '42px' }}
        onClick={() => document.getElementById('editor-skills-input')?.focus()}
      >
        {store.skills.filter(Boolean).map(s => (
          <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', padding: '0.15rem 0.5rem', background: 'var(--primary-100)', color: 'var(--primary-700)', borderRadius: 'var(--radius-pill)', fontSize: '0.75rem', fontWeight: 500 }}>
            {s}
            <button type="button" onClick={e => { e.stopPropagation(); store.setSkills(store.skills.filter(x => x !== s)); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-500)', lineHeight: 1, padding: 0, fontSize: '0.9rem' }}>×</button>
          </span>
        ))}
        <input
          id="editor-skills-input"
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addSkill(input); }
            else if (e.key === 'Backspace' && !input && store.skills.length) store.setSkills(store.skills.slice(0, -1));
          }}
          onBlur={() => input && addSkill(input)}
          placeholder={store.skills.length === 0 ? 'Type skill, Enter to add…' : ''}
          style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.8125rem', minWidth: '80px', flex: 1, color: 'var(--text-primary)' }}
        />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.5rem' }}>
        {COMMON_SKILLS.filter(s => !store.skills.includes(s)).slice(0, 8).map(s => (
          <button key={s} type="button" className="chip chip-neutral" style={{ fontSize: '0.7rem' }}
            onClick={() => store.setSkills([...store.skills.filter(Boolean), s])}>+ {s}</button>
        ))}
      </div>
    </div>
  );
};

// ── Template thumbnail mini layouts ──────────────────────────────
const TEMPLATES: Array<{ id: 'professional' | 'creative' | 'minimal' | 'executive' | 'modern' | 'compact'; thumb: React.ReactNode }> = [
  {
    id: 'professional',
    thumb: (
      <svg viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="15" y="6" width="30" height="3" rx="1" fill="#1f2937" />
        <rect x="20" y="11" width="20" height="1.5" rx="0.5" fill="#94a3b8" />
        <rect x="5" y="18" width="50" height="0.5" fill="#e5e7eb" />
        <rect x="5" y="22" width="30" height="2" rx="0.5" fill="#1f2937" />
        <rect x="5" y="26" width="50" height="1.5" rx="0.5" fill="#d1d5db" />
        <rect x="5" y="29" width="50" height="1.5" rx="0.5" fill="#d1d5db" />
        <rect x="5" y="32" width="40" height="1.5" rx="0.5" fill="#d1d5db" />
        <rect x="5" y="38" width="30" height="2" rx="0.5" fill="#1f2937" />
        <rect x="5" y="42" width="50" height="1.5" rx="0.5" fill="#d1d5db" />
        <rect x="5" y="45" width="50" height="1.5" rx="0.5" fill="#d1d5db" />
        <rect x="5" y="52" width="25" height="2" rx="0.5" fill="#1f2937" />
        <rect x="5" y="56" width="15" height="4" rx="1" fill="#f3f4f6" stroke="#e5e7eb" strokeWidth="0.3" />
        <rect x="22" y="56" width="15" height="4" rx="1" fill="#f3f4f6" stroke="#e5e7eb" strokeWidth="0.3" />
        <rect x="39" y="56" width="15" height="4" rx="1" fill="#f3f4f6" stroke="#e5e7eb" strokeWidth="0.3" />
      </svg>
    ),
  },
  {
    id: 'creative',
    thumb: (
      <svg viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="22" height="80" fill="#1e1b4b" />
        <circle cx="11" cy="14" r="6" fill="#312e81" />
        <rect x="5" y="24" width="12" height="1.5" rx="0.5" fill="#818cf8" />
        <rect x="4" y="28" width="14" height="1" rx="0.3" fill="#6366f1" opacity="0.5" />
        <rect x="4" y="31" width="14" height="1" rx="0.3" fill="#6366f1" opacity="0.5" />
        <rect x="5" y="38" width="12" height="1.5" rx="0.5" fill="#818cf8" />
        <rect x="4" y="42" width="14" height="3" rx="0.5" fill="#3730a3" />
        <rect x="4" y="46" width="14" height="3" rx="0.5" fill="#3730a3" />
        <rect x="26" y="8" width="30" height="2" rx="0.5" fill="#111827" />
        <rect x="26" y="12" width="25" height="1.5" rx="0.5" fill="#d1d5db" />
        <rect x="26" y="15" width="28" height="1.5" rx="0.5" fill="#d1d5db" />
        <rect x="26" y="22" width="20" height="2" rx="0.5" fill="#111827" />
        <rect x="26" y="26" width="28" height="1.5" rx="0.5" fill="#d1d5db" />
        <rect x="26" y="29" width="28" height="1.5" rx="0.5" fill="#d1d5db" />
        <rect x="26" y="36" width="20" height="2" rx="0.5" fill="#111827" />
        <rect x="26" y="40" width="28" height="1.5" rx="0.5" fill="#d1d5db" />
      </svg>
    ),
  },
  {
    id: 'minimal',
    thumb: (
      <svg viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="8" width="35" height="5" rx="1" fill="#1a1a1a" />
        <rect x="5" y="15" width="20" height="1" rx="0.3" fill="#aaa" />
        <rect x="5" y="20" width="50" height="0.5" fill="#1a1a1a" />
        <rect x="5" y="25" width="12" height="1.5" rx="0.5" fill="#888" />
        <rect x="5" y="29" width="35" height="1.5" rx="0.5" fill="#ccc" />
        <rect x="5" y="32" width="40" height="1.5" rx="0.5" fill="#ccc" />
        <rect x="5" y="35" width="30" height="1.5" rx="0.5" fill="#ccc" />
        <rect x="5" y="41" width="12" height="1.5" rx="0.5" fill="#888" />
        <rect x="5" y="45" width="40" height="1.5" rx="0.5" fill="#ccc" />
        <rect x="5" y="48" width="35" height="1.5" rx="0.5" fill="#ccc" />
        <rect x="5" y="55" width="12" height="1.5" rx="0.5" fill="#888" />
        <rect x="5" y="59" width="40" height="1" rx="0.3" fill="#ccc" />
      </svg>
    ),
  },
  {
    id: 'executive',
    thumb: (
      <svg viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="60" height="18" fill="#1a1a2e" />
        <rect x="8" y="6" width="30" height="3" rx="1" fill="white" />
        <rect x="8" y="11" width="20" height="1.5" rx="0.5" fill="#a0aec0" />
        <rect x="0" y="18" width="60" height="1.5" fill="#d4af37" />
        <rect x="8" y="24" width="20" height="2" rx="0.5" fill="#1a1a2e" />
        <rect x="30" y="25" width="22" height="0.5" fill="#d4af37" />
        <rect x="8" y="28" width="2" height="10" fill="#d4af37" />
        <rect x="12" y="28" width="28" height="1.5" rx="0.5" fill="#555" />
        <rect x="12" y="31" width="35" height="1.5" rx="0.5" fill="#ccc" />
        <rect x="12" y="34" width="30" height="1.5" rx="0.5" fill="#ccc" />
        <rect x="8" y="42" width="2" height="8" fill="#d4af37" />
        <rect x="12" y="42" width="28" height="1.5" rx="0.5" fill="#555" />
        <rect x="12" y="45" width="35" height="1.5" rx="0.5" fill="#ccc" />
      </svg>
    ),
  },
  {
    id: 'modern',
    thumb: (
      <svg viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="60" height="16" fill="#059669" />
        <rect x="8" y="5" width="28" height="3" rx="1" fill="white" />
        <rect x="8" y="10" width="18" height="1.5" rx="0.5" fill="rgba(255,255,255,0.7)" />
        <circle cx="5" cy="23" r="2" fill="#059669" />
        <rect x="10" y="22" width="15" height="2" rx="0.5" fill="#059669" />
        <rect x="28" y="23" width="25" height="0.5" fill="#d1fae5" />
        <rect x="5" y="28" width="40" height="1.5" rx="0.5" fill="#ccc" />
        <rect x="5" y="31" width="45" height="1.5" rx="0.5" fill="#ccc" />
        <rect x="5" y="34" width="35" height="1.5" rx="0.5" fill="#ccc" />
        <circle cx="5" cy="42" r="2" fill="#059669" />
        <rect x="10" y="41" width="15" height="2" rx="0.5" fill="#059669" />
        <rect x="5" y="47" width="40" height="1.5" rx="0.5" fill="#ccc" />
        <circle cx="5" cy="56" r="2" fill="#059669" />
        <rect x="10" y="55" width="10" height="2" rx="0.5" fill="#059669" />
        <rect x="5" y="60" width="12" height="4" rx="8" fill="#ecfdf5" stroke="#059669" strokeWidth="0.3" />
        <rect x="19" y="60" width="12" height="4" rx="8" fill="#ecfdf5" stroke="#059669" strokeWidth="0.3" />
      </svg>
    ),
  },
  {
    id: 'compact',
    thumb: (
      <svg viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="6" width="25" height="4" rx="1" fill="#1a1a1a" />
        <rect x="38" y="6" width="18" height="1" rx="0.3" fill="#999" />
        <rect x="38" y="8.5" width="18" height="1" rx="0.3" fill="#999" />
        <rect x="5" y="14" width="50" height="1" fill="#1a1a1a" />
        <rect x="5" y="19" width="20" height="1.5" rx="0.5" fill="#1a1a1a" />
        <rect x="5" y="22" width="32" height="1.5" rx="0.5" fill="#ccc" />
        <rect x="5" y="25" width="32" height="1.5" rx="0.5" fill="#ccc" />
        <rect x="5" y="28" width="28" height="1.5" rx="0.5" fill="#ccc" />
        <rect x="5" y="33" width="20" height="1.5" rx="0.5" fill="#1a1a1a" />
        <rect x="5" y="36" width="32" height="1.5" rx="0.5" fill="#ccc" />
        <rect x="40" y="14" width="0.5" height="40" fill="#e5e7eb" />
        <rect x="43" y="19" width="10" height="1.5" rx="0.5" fill="#1a1a1a" />
        <circle cx="44" cy="24" r="1" fill="#1a1a1a" /> <rect x="47" y="23.5" width="10" height="1" rx="0.3" fill="#aaa" />
        <circle cx="44" cy="28" r="1" fill="#1a1a1a" /> <rect x="47" y="27.5" width="10" height="1" rx="0.3" fill="#aaa" />
        <circle cx="44" cy="32" r="1" fill="#1a1a1a" /> <rect x="47" y="31.5" width="10" height="1" rx="0.3" fill="#aaa" />
      </svg>
    ),
  },
];

// ── Section accordion ────────────────────────────────────────────
type SectionId = 'personal' | 'experience' | 'education' | 'skills';

const BuilderEditor: React.FC = () => {
  const store = useResumeStore();
  const [optimizingId, setOptimizingId] = useState<string | null>(null);

  const handleOptimize = async (id: string, description: string, title: string, company: string) => {
    if (!description || !title) return;
    setOptimizingId(id);
    try {
      const improved = await optimizeDescription(description, title, company);
      store.updateExperience(id, { description: improved });
    } catch (e) {
      alert('Failed to optimize description. Please check your API key.');
    } finally {
      setOptimizingId(null);
    }
  };

  const [open, setOpen] = useState<Record<SectionId, boolean>>({
    personal: true, experience: false, education: false, skills: false,
  });
  const toggle = (id: SectionId) => setOpen(prev => ({ ...prev, [id]: !prev[id] }));

  const SectionHeader = ({ id, label }: { id: SectionId; label: string }) => (
    <button type="button" onClick={() => toggle(id)}
      style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
      <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{label}</span>
      {open[id] ? <ChevronUp size={15} color="var(--text-secondary)" /> : <ChevronDown size={15} color="var(--text-secondary)" />}
    </button>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

      {/* Target banner */}
      {store.targetCompany && (
        <div style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-100)', borderRadius: 'var(--radius-md)', padding: '0.6rem 0.875rem', marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-700)', margin: 0 }}>🎯 Targeting: {store.targetCompany}</p>
        </div>
      )}

      {/* Template selector — visual thumbnails */}
      <div style={{ marginBottom: '1rem' }}>
        <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Template</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
          {TEMPLATES.map(t => (
            <button key={t.id} type="button" onClick={() => store.setTemplate(t.id)}
              style={{
                padding: '6px',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                border: `2px solid ${store.template === t.id ? 'var(--primary-500)' : 'var(--border-color)'}`,
                background: store.template === t.id ? 'var(--primary-50)' : 'white',
                transition: 'all var(--transition-fast)',
                aspectRatio: '3 / 4',
                display: 'flex',
                alignItems: 'stretch',
              }}>
              <div style={{ width: '100%', background: '#fafafa', borderRadius: '3px', overflow: 'hidden', display: 'flex' }}>
                {t.thumb}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Personal ── */}
      <SectionHeader id="personal" label="Personal Details" />
      {open.personal && (
        <div className="animate-fade-in" style={{ padding: '0.875rem 0', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {/* Profile photo upload */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              {store.personalInfo.photo
                ? <img src={store.personalInfo.photo} alt="Profile" style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-200)' }} />
                : <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--primary-50)', border: '2px dashed var(--primary-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-300)', fontSize: '1.25rem', fontWeight: 700 }}>
                    {store.personalInfo.name ? store.personalInfo.name[0].toUpperCase() : '?'}
                  </div>
              }
              <label style={{
                position: 'absolute', bottom: '-2px', right: '-2px',
                width: '22px', height: '22px', borderRadius: '50%',
                background: 'var(--primary-600)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', border: '2px solid white',
              }}>
                <Camera size={11} />
                <input type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={e => { if (e.target.files?.[0]) store.setPersonalInfo({ photo: URL.createObjectURL(e.target.files[0]) }); }} />
              </label>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Profile Photo</p>
              {store.personalInfo.photo && (
                <button type="button" onClick={() => store.setPersonalInfo({ photo: '' })}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '0.75rem', padding: 0, textAlign: 'left' }}>
                  Remove photo
                </button>
              )}
            </div>
          </div>
          <input type="text" className="form-input" placeholder="Full Name" value={store.personalInfo.name} onChange={e => store.setPersonalInfo({ name: e.target.value })} />
          <input type="email" className="form-input" placeholder="Email" value={store.personalInfo.email} onChange={e => store.setPersonalInfo({ email: e.target.value })} />
          <input type="tel" className="form-input" placeholder="Phone" value={store.personalInfo.phone} onChange={e => store.setPersonalInfo({ phone: e.target.value })} />
          <input type="url" className="form-input" placeholder="Portfolio / LinkedIn" value={store.personalInfo.portfolioLine} onChange={e => store.setPersonalInfo({ portfolioLine: e.target.value })} />
        </div>
      )}

      {/* ── Experience ── */}
      <SectionHeader id="experience" label="Work Experience" />
      {open.experience && (
        <div className="animate-fade-in" style={{ padding: '0.875rem 0', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {store.experiences.map((exp, i) => (
            <div key={exp.id} style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.625rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-600)' }}>Experience {i + 1}</span>
                <button type="button" onClick={() => store.removeExperience(exp.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={14} /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <input type="text" className="form-input" placeholder="Job Title" value={exp.title} onChange={e => store.updateExperience(exp.id, { title: e.target.value })} />
                <input type="text" className="form-input" placeholder="Company" value={exp.company} onChange={e => store.updateExperience(exp.id, { company: e.target.value })} />
                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem', display: 'block' }}>Start Date</label>
                  <DateSelect month={exp.startMonth} year={exp.startYear}
                    onMonthChange={v => store.updateExperience(exp.id, { startMonth: v })}
                    onYearChange={v => store.updateExperience(exp.id, { startYear: v })} />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem', display: 'block' }}>End Date</label>
                  {exp.current
                    ? <div className="form-input" style={{ color: 'var(--text-tertiary)', background: 'var(--surface-hover)', fontSize: '0.875rem' }}>Present</div>
                    : <DateSelect month={exp.endMonth} year={exp.endYear}
                        onMonthChange={v => store.updateExperience(exp.id, { endMonth: v })}
                        onYearChange={v => store.updateExperience(exp.id, { endYear: v })} />
                  }
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', color: 'var(--text-secondary)', cursor: 'pointer', userSelect: 'none' }}>
                  <input type="checkbox" checked={exp.current} onChange={e => store.updateExperience(exp.id, { current: e.target.checked })} />
                  Currently working here
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label className="form-label" style={{ fontSize: '0.75rem', margin: 0 }}>Description</label>
                  <textarea className="form-input" rows={4} placeholder="Achievements, impact…" value={exp.description}
                    onChange={e => store.updateExperience(exp.id, { description: e.target.value })} style={{ resize: 'vertical' }} />
                  <button 
                    type="button" 
                    onClick={() => handleOptimize(exp.id, exp.description, exp.title, exp.company)}
                    disabled={optimizingId === exp.id || !exp.description || !exp.title}
                    className="btn"
                    style={{ 
                      alignSelf: 'flex-start', 
                      padding: '0.4rem 0.75rem', 
                      fontSize: '0.75rem', 
                      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))', 
                      color: 'var(--primary-700)', 
                      border: '1px solid rgba(99, 102, 241, 0.25)',
                      display: 'flex',
                      gap: '0.35rem',
                      alignItems: 'center',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 600,
                      cursor: optimizingId === exp.id || !exp.description || !exp.title ? 'not-allowed' : 'pointer',
                      opacity: optimizingId === exp.id || !exp.description || !exp.title ? 0.6 : 1,
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    {optimizingId === exp.id ? <><Loader2 size={13} className="animate-spin" /> Optimizing...</> : <><Sparkles size={13} color="#8b5cf6" /> Optimize with AI</>}
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button type="button" className="btn btn-secondary w-full" style={{ borderStyle: 'dashed', fontSize: '0.875rem' }}
            onClick={() => store.addExperience({ id: Date.now().toString(), title: '', company: '', description: '', startMonth: '', startYear: '', endMonth: '', endYear: '', current: false })}>
            <Plus size={14} /> Add Experience
          </button>
        </div>
      )}

      {/* ── Education ── */}
      <SectionHeader id="education" label="Education" />
      {open.education && (
        <div className="animate-fade-in" style={{ padding: '0.875rem 0', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {store.educations.map((edu, i) => (
            <div key={edu.id} style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.625rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-600)' }}>Education {i + 1}</span>
                <button type="button" onClick={() => store.removeEducation(edu.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={14} /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <input type="text" className="form-input" placeholder="University" value={edu.university} onChange={e => store.updateEducation(edu.id, { university: e.target.value })} />
                <div className="flex gap-2">
                  <input type="text" className="form-input w-full" placeholder="Course / Degree" value={edu.course} onChange={e => store.updateEducation(edu.id, { course: e.target.value })} />
                  <input type="text" className="form-input" placeholder="CGPA" value={edu.cgpa} onChange={e => store.updateEducation(edu.id, { cgpa: e.target.value })} style={{ maxWidth: '80px' }} />
                </div>
              </div>
            </div>
          ))}
          <button type="button" className="btn btn-secondary w-full" style={{ borderStyle: 'dashed', fontSize: '0.875rem' }}
            onClick={() => store.addEducation({ id: Date.now().toString(), university: '', course: '', cgpa: '' })}>
            <Plus size={14} /> Add Education
          </button>
        </div>
      )}

      {/* ── Skills & Languages ── */}
      <SectionHeader id="skills" label="Skills & Languages" />
      {open.skills && (
        <div className="animate-fade-in" style={{ padding: '0.875rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="form-label" style={{ marginBottom: '0.4rem', display: 'block' }}>Skills</label>
            <SkillsTagInput />
          </div>
          <div>
            <label className="form-label" style={{ marginBottom: '0.4rem', display: 'block' }}>Languages</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {store.languages.map((lang, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <select className="form-input w-full" value={lang.language} onChange={e => store.updateLanguage(i, { language: e.target.value })}>
                    <option value="">Language…</option>
                    {COMMON_LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                  <select className="form-input" style={{ minWidth: '110px' }} value={lang.level} onChange={e => store.updateLanguage(i, { level: e.target.value })}>
                    <option value="">Level…</option>
                    {LANGUAGE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                  <button type="button" onClick={() => store.removeLanguage(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', flexShrink: 0 }}><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
            <button type="button" className="btn btn-secondary w-full" style={{ fontSize: '0.875rem', borderStyle: 'dashed', marginTop: '0.5rem' }}
              onClick={() => store.addLanguage({ language: '', level: '' })}>
              <Plus size={14} /> Add Language
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuilderEditor;
