import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { formatDate } from '../../utils/constants';
import DescriptionBullets from './DescriptionBullets';
import InlineEdit from './InlineEdit';

// Modern template — bold emerald top bar, clean sans-serif, coloured section markers
const ModernTemplate: React.FC = () => {
  const { personalInfo, experiences, educations, skills, languages } = useResumeStore();
  const accent = '#059669'; // emerald-600

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', color: '#111827', fontSize: '10pt', lineHeight: 1.55, paddingBottom: '20mm' }}>

      {/* Header */}
      <div style={{ background: accent, color: 'white', padding: '10mm 14mm 8mm' }}>
        {personalInfo.photo && (
          <img src={personalInfo.photo} alt="Profile"
            style={{ width: '22mm', height: '22mm', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.5)', float: 'right', marginLeft: '8mm' }} />
        )}
        <InlineEdit
          tagName="h1"
          placeholder="Your Name"
          value={personalInfo.name}
          onChange={(val) => useResumeStore.getState().setPersonalInfo({ name: val })}
          style={{ fontSize: '22pt', fontWeight: 700, margin: '0 0 2mm', letterSpacing: '-0.02em' }}
        />
        <div style={{ display: 'flex', gap: '5mm', fontSize: '8.5pt', color: 'rgba(255,255,255,0.85)', flexWrap: 'wrap' }}>
          <InlineEdit placeholder="Email" value={personalInfo.email ? `✉ ${personalInfo.email}` : ''} onChange={(val) => useResumeStore.getState().setPersonalInfo({ email: val.replace(/^✉\s*/, '') })} />
          <InlineEdit placeholder="Phone" value={personalInfo.phone ? `· ${personalInfo.phone}` : ''} onChange={(val) => useResumeStore.getState().setPersonalInfo({ phone: val.replace(/^·\s*/, '') })} />
          <InlineEdit placeholder="Portfolio" value={personalInfo.portfolioLine ? `· ${personalInfo.portfolioLine}` : ''} onChange={(val) => useResumeStore.getState().setPersonalInfo({ portfolioLine: val.replace(/^·\s*/, '') })} />
        </div>
      </div>

      <div style={{ padding: '8mm 14mm 0' }}>

        {/* Experience */}
        {experiences.length > 0 && (
          <section style={{ marginBottom: '7mm' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3mm', marginBottom: '4mm' }}>
              <div style={{ width: '4mm', height: '4mm', borderRadius: '50%', background: accent }} />
              <h2 style={{ fontSize: '10pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: accent, margin: 0 }}>Experience</h2>
              <div style={{ flex: 1, height: '1px', background: '#d1fae5' }} />
            </div>
            {experiences.map(exp => (
              <div key={exp.id} style={{ marginBottom: '5mm' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <InlineEdit
                    tagName="h3"
                    placeholder="Job Title"
                    value={exp.title}
                    onChange={(val) => useResumeStore.getState().updateExperience(exp.id, { title: val })}
                    style={{ fontSize: '11pt', fontWeight: 600, margin: 0 }}
                  />
                  <span style={{ fontSize: '8.5pt', color: '#6b7280', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                    {formatDate(exp.startMonth, exp.startYear, false)}{exp.startYear ? ' – ' : ''}{exp.current ? 'Present' : formatDate(exp.endMonth, exp.endYear, false)}
                  </span>
                </div>
                <InlineEdit
                  tagName="div"
                  placeholder="Company Name"
                  value={exp.company}
                  onChange={(val) => useResumeStore.getState().updateExperience(exp.id, { company: val })}
                  style={{ fontSize: '9.5pt', color: accent, fontWeight: 500, marginBottom: '1.5mm' }}
                />
                {exp.description !== undefined && (
                  <DescriptionBullets
                    text={exp.description}
                    onChange={(val) => useResumeStore.getState().updateExperience(exp.id, { description: val })}
                    style={{ color: '#374151' }}
                  />
                )}
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {educations.length > 0 && (
          <section style={{ marginBottom: '7mm' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3mm', marginBottom: '4mm' }}>
              <div style={{ width: '4mm', height: '4mm', borderRadius: '50%', background: accent }} />
              <h2 style={{ fontSize: '10pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: accent, margin: 0 }}>Education</h2>
              <div style={{ flex: 1, height: '1px', background: '#d1fae5' }} />
            </div>
            {educations.map(edu => (
              <div key={edu.id} style={{ marginBottom: '4mm', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <InlineEdit
                    tagName="h3"
                    placeholder="Degree / Course"
                    value={edu.course}
                    onChange={(val) => useResumeStore.getState().updateEducation(edu.id, { course: val })}
                    style={{ fontSize: '10.5pt', fontWeight: 600, margin: '0 0 0.5mm' }}
                  />
                  <InlineEdit
                    tagName="div"
                    placeholder="Institution / University"
                    value={edu.university}
                    onChange={(val) => useResumeStore.getState().updateEducation(edu.id, { university: val })}
                    style={{ fontSize: '9.5pt', color: '#4b5563' }}
                  />
                </div>
                {edu.cgpa !== undefined && (
                  <InlineEdit
                    placeholder="GPA"
                    value={edu.cgpa ? `GPA ${edu.cgpa}` : ''}
                    onChange={(val) => useResumeStore.getState().updateEducation(edu.id, { cgpa: val.replace(/^GPA\s*/, '') })}
                    style={{ fontSize: '9pt', color: '#6b7280' }}
                  />
                )}
              </div>
            ))}
          </section>
        )}

        {/* Skills & Languages */}
        <div style={{ display: 'flex', gap: '10mm' }}>
          {skills.length > 0 && (
            <section style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '3mm', marginBottom: '3mm' }}>
                <div style={{ width: '4mm', height: '4mm', borderRadius: '50%', background: accent }} />
                <h2 style={{ fontSize: '10pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: accent, margin: 0 }}>Skills</h2>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2mm' }}>
                {skills.map(s => (
                  <span key={s} style={{ padding: '0.5mm 3mm', background: '#ecfdf5', border: `1px solid ${accent}`, borderRadius: '999px', fontSize: '8.5pt', color: '#065f46', fontWeight: 500 }}>{s}</span>
                ))}
              </div>
            </section>
          )}
          {languages.length > 0 && (
            <section style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '3mm', marginBottom: '3mm' }}>
                <div style={{ width: '4mm', height: '4mm', borderRadius: '50%', background: accent }} />
                <h2 style={{ fontSize: '10pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: accent, margin: 0 }}>Languages</h2>
              </div>
              {languages.map((l, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5pt', marginBottom: '1.5mm' }}>
                  <span>{l.language}</span>
                  {l.level && <span style={{ color: '#6b7280' }}>{l.level}</span>}
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
