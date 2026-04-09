import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { CheckCircle2, AlertCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

type Status = 'done' | 'warn' | 'error';

interface CheckItem {
  label: string;
  status: Status;
  message?: string;
}

const STATUS_CONFIG: Record<Status, { icon: React.ReactNode; color: string; bg: string }> = {
  done:  { icon: <CheckCircle2 size={14} />, color: '#10b981', bg: '#f0fdf4' },
  warn:  { icon: <AlertCircle  size={14} />, color: '#f59e0b', bg: '#fffbeb' },
  error: { icon: <XCircle      size={14} />, color: '#ef4444', bg: '#fef2f2' },
};

export const ResumeChecklist: React.FC = () => {
  const [open, setOpen] = useState(true);

  const { personalInfo, experiences, educations, skills, languages } = useResumeStore(s => ({
    personalInfo: s.personalInfo,
    experiences: s.experiences,
    educations: s.educations,
    skills: s.skills,
    languages: s.languages,
  }));

  // ── Build checklist items ────────────────────────────────────────
  const items: CheckItem[] = [];

  // Personal Info
  const hasName  = !!personalInfo.name.trim();
  const hasEmail = !!personalInfo.email.trim();
  if (hasName && hasEmail) {
    items.push({ label: 'Personal Info', status: 'done', message: personalInfo.name });
  } else if (!hasName && !hasEmail) {
    items.push({ label: 'Personal Info', status: 'error', message: 'Name & email required' });
  } else {
    items.push({ label: 'Personal Info', status: 'warn', message: !hasName ? 'Missing name' : 'Missing email' });
  }

  // Work Experience
  if (experiences.length === 0) {
    items.push({ label: 'Work Experience', status: 'warn', message: 'No experience added' });
  } else {
    const incomplete = experiences.filter(e => !e.title || !e.description);
    if (incomplete.length > 0) {
      items.push({ label: 'Work Experience', status: 'warn', message: `${incomplete.length} entry missing title or description` });
    } else {
      items.push({ label: 'Work Experience', status: 'done', message: `${experiences.length} ${experiences.length === 1 ? 'entry' : 'entries'}` });
    }
  }

  // Education
  if (educations.length === 0) {
    items.push({ label: 'Education', status: 'warn', message: 'No education added' });
  } else {
    const incomplete = educations.filter(e => !e.university || !e.course);
    if (incomplete.length > 0) {
      items.push({ label: 'Education', status: 'warn', message: `${incomplete.length} entry missing school or degree` });
    } else {
      items.push({ label: 'Education', status: 'done', message: `${educations.length} ${educations.length === 1 ? 'entry' : 'entries'}` });
    }
  }

  // Skills
  if (skills.length === 0) {
    items.push({ label: 'Skills', status: 'warn', message: 'No skills added' });
  } else {
    items.push({ label: 'Skills', status: 'done', message: `${skills.length} skill${skills.length === 1 ? '' : 's'}` });
  }

  // Languages (optional — just info)
  if (languages.length > 0) {
    items.push({ label: 'Languages', status: 'done', message: `${languages.length} language${languages.length === 1 ? '' : 's'}` });
  }

  const errorCount = items.filter(i => i.status === 'error').length;
  const warnCount  = items.filter(i => i.status === 'warn').length;
  const doneCount  = items.filter(i => i.status === 'done').length;

  const overallStatus: Status = errorCount > 0 ? 'error' : warnCount > 0 ? 'warn' : 'done';
  const cfg = STATUS_CONFIG[overallStatus];

  return (
    <div style={{
      margin: '0 0 1.5rem',
      border: `1.5px solid ${cfg.color}30`,
      borderRadius: '10px',
      overflow: 'hidden',
      background: 'white',
    }}>
      {/* Header row */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0.6rem 0.875rem',
          background: cfg.bg,
          border: 'none', cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: cfg.color, fontWeight: 700, fontSize: '0.8rem' }}>
          {cfg.icon}
          Resume Completeness
          <span style={{
            marginLeft: '0.25rem', fontSize: '0.7rem', fontWeight: 500,
            background: `${cfg.color}18`, color: cfg.color,
            borderRadius: '99px', padding: '1px 7px',
          }}>
            {doneCount}/{items.length}
          </span>
        </div>
        {open ? <ChevronUp size={14} color={cfg.color} /> : <ChevronDown size={14} color={cfg.color} />}
      </button>

      {/* Items */}
      {open && (
        <div style={{ padding: '0.5rem 0' }}>
          {items.map((item) => {
            const s = STATUS_CONFIG[item.status];
            return (
              <div key={item.label} style={{
                display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
                padding: '0.35rem 0.875rem',
              }}>
                <span style={{ color: s.color, marginTop: '1px', flexShrink: 0 }}>{s.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontWeight: 600, fontSize: '0.8rem', color: '#1e293b' }}>{item.label}</span>
                  {item.message && (
                    <span style={{ fontSize: '0.73rem', color: item.status === 'done' ? '#64748b' : s.color, marginLeft: '0.35rem' }}>
                      — {item.message}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ResumeChecklist;
