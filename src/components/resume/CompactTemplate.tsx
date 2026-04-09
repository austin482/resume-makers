import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { formatDate } from '../../utils/constants';
import DescriptionBullets from './DescriptionBullets';
import InlineEdit from './InlineEdit';

// Compact template — two-column top, dense structure, classic serif feel
const CompactTemplate: React.FC = () => {
  const { personalInfo, experiences, educations, skills, languages } = useResumeStore();

  return (
    <div style={{ fontFamily: 'Georgia, serif', color: '#1a1a1a', fontSize: '9.5pt', lineHeight: 1.5, padding: '12mm 14mm', paddingBottom: '20mm' }}>

      {/* Header — name left, contact right */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #1a1a1a', paddingBottom: '4mm', marginBottom: '5mm' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4mm' }}>
          {personalInfo.photo && (
            <img src={personalInfo.photo} alt="Profile"
              style={{ width: '18mm', height: '18mm', borderRadius: '2px', objectFit: 'cover', border: '1px solid #ddd' }} />
          )}
          <div>
            <InlineEdit
              tagName="h1"
              placeholder="Your Name"
              value={personalInfo.name}
              onChange={(val) => useResumeStore.getState().setPersonalInfo({ name: val })}
              style={{ fontSize: '20pt', fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}
            />
          </div>
        </div>
        <div style={{ textAlign: 'right', fontSize: '8.5pt', color: '#555', lineHeight: 1.7 }}>
          <InlineEdit tagName="div" placeholder="Email" value={personalInfo.email} onChange={(val) => useResumeStore.getState().setPersonalInfo({ email: val })} />
          <InlineEdit tagName="div" placeholder="Phone" value={personalInfo.phone} onChange={(val) => useResumeStore.getState().setPersonalInfo({ phone: val })} />
          <InlineEdit tagName="div" placeholder="Portfolio" value={personalInfo.portfolioLine} onChange={(val) => useResumeStore.getState().setPersonalInfo({ portfolioLine: val })} />
        </div>
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'flex', gap: '8mm' }}>

        {/* Left column — 60% */}
        <div style={{ flex: 3 }}>
          {experiences.length > 0 && (
            <section style={{ marginBottom: '5mm' }}>
              <h2 style={{ fontSize: '8pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', borderBottom: '1px solid #1a1a1a', paddingBottom: '1mm', marginBottom: '3.5mm' }}>Experience</h2>
              {experiences.map(exp => (
                <div key={exp.id} style={{ marginBottom: '4.5mm' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <InlineEdit
                      tagName="strong"
                      placeholder="Job Title"
                      value={exp.title}
                      onChange={(val) => useResumeStore.getState().updateExperience(exp.id, { title: val })}
                      style={{ fontSize: '10pt' }}
                    />
                    <span style={{ fontSize: '8pt', color: '#666', whiteSpace: 'nowrap', marginLeft: '6px' }}>
                      {formatDate(exp.startMonth, exp.startYear, false)}{exp.startYear ? ' – ' : ''}{exp.current ? 'Present' : formatDate(exp.endMonth, exp.endYear, false)}
                    </span>
                  </div>
                  <InlineEdit
                    tagName="div"
                    placeholder="Company Name"
                    value={exp.company}
                    onChange={(val) => useResumeStore.getState().updateExperience(exp.id, { company: val })}
                    style={{ fontStyle: 'italic', color: '#444', fontSize: '9pt', marginBottom: '1mm' }}
                  />
                  {exp.description !== undefined && (
                    <DescriptionBullets
                      text={exp.description}
                      onChange={(val) => useResumeStore.getState().updateExperience(exp.id, { description: val })}
                      style={{ color: '#333' }}
                    />
                  )}
                </div>
              ))}
            </section>
          )}

          {educations.length > 0 && (
            <section>
              <h2 style={{ fontSize: '8pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', borderBottom: '1px solid #1a1a1a', paddingBottom: '1mm', marginBottom: '3.5mm' }}>Education</h2>
              {educations.map(edu => (
                <div key={edu.id} style={{ marginBottom: '3mm' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <InlineEdit
                      tagName="strong"
                      placeholder="Degree / Course"
                      value={edu.course}
                      onChange={(val) => useResumeStore.getState().updateEducation(edu.id, { course: val })}
                      style={{ fontSize: '9.5pt' }}
                    />
                    {edu.cgpa !== undefined && (
                      <InlineEdit
                        tagName="span"
                        placeholder="GPA"
                        value={edu.cgpa ? `GPA ${edu.cgpa}` : ''}
                        onChange={(val) => useResumeStore.getState().updateEducation(edu.id, { cgpa: val.replace(/^GPA\s*/, '') })}
                        style={{ fontSize: '8.5pt', color: '#666' }}
                      />
                    )}
                  </div>
                  <InlineEdit
                    tagName="div"
                    placeholder="Institution / University"
                    value={edu.university}
                    onChange={(val) => useResumeStore.getState().updateEducation(edu.id, { university: val })}
                    style={{ fontStyle: 'italic', color: '#555', fontSize: '9pt' }}
                  />
                </div>
              ))}
            </section>
          )}
        </div>

        {/* Right column — 40% */}
        <div style={{ flex: 2, borderLeft: '1px solid #e5e7eb', paddingLeft: '8mm' }}>
          {skills.length > 0 && (
            <section style={{ marginBottom: '5mm' }}>
              <h2 style={{ fontSize: '8pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', borderBottom: '1px solid #1a1a1a', paddingBottom: '1mm', marginBottom: '3mm' }}>Skills</h2>
              {skills.map(s => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '2mm', marginBottom: '1.5mm', fontSize: '9pt' }}>
                  <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#1a1a1a', flexShrink: 0, display: 'inline-block' }} />
                  {s}
                </div>
              ))}
            </section>
          )}
          {languages.length > 0 && (
            <section>
              <h2 style={{ fontSize: '8pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', borderBottom: '1px solid #1a1a1a', paddingBottom: '1mm', marginBottom: '3mm' }}>Languages</h2>
              {languages.map((l, i) => (
                <div key={i} style={{ marginBottom: '1.5mm', fontSize: '9pt' }}>
                  <span style={{ fontWeight: 600 }}>{l.language}</span>
                  {l.level && <span style={{ color: '#666', fontStyle: 'italic' }}> — {l.level}</span>}
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompactTemplate;
