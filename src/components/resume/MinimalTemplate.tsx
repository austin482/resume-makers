import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { formatDate } from '../../utils/constants';
import DescriptionBullets from './DescriptionBullets';
import InlineEdit from './InlineEdit';

const MinimalTemplate: React.FC = () => {
  const { personalInfo, experiences, educations, skills, languages } = useResumeStore();

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', padding: '14mm 16mm', paddingBottom: '20mm', color: '#1a1a1a', fontSize: '10pt', lineHeight: 1.5 }}>

      {/* Name & Contact */}
      <div style={{ marginBottom: '8mm' }}>
        <InlineEdit
          tagName="h1"
          placeholder="Your Name"
          value={personalInfo.name}
          onChange={(val) => useResumeStore.getState().setPersonalInfo({ name: val })}
          style={{ fontSize: '26pt', fontWeight: 700, margin: '0 0 2mm', letterSpacing: '-0.03em' }}
        />
        <div style={{ display: 'flex', gap: '6mm', fontSize: '9pt', color: '#555', flexWrap: 'wrap' }}>
          <InlineEdit placeholder="Email" value={personalInfo.email} onChange={(val) => useResumeStore.getState().setPersonalInfo({ email: val })} />
          <InlineEdit placeholder="Phone" value={personalInfo.phone} onChange={(val) => useResumeStore.getState().setPersonalInfo({ phone: val })} />
          <InlineEdit placeholder="Portfolio" value={personalInfo.portfolioLine} onChange={(val) => useResumeStore.getState().setPersonalInfo({ portfolioLine: val })} />
        </div>
      </div>

      <div style={{ height: '0.5mm', background: '#1a1a1a', marginBottom: '6mm' }} />

      {/* Experience */}
      {experiences.length > 0 && (
        <section style={{ marginBottom: '6mm' }}>
          <h2 style={{ fontSize: '9pt', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', marginBottom: '4mm' }}>Experience</h2>
          {experiences.map(exp => (
            <div key={exp.id} style={{ marginBottom: '5mm' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div>
                  <InlineEdit
                    tagName="span"
                    placeholder="Job Title"
                    value={exp.title}
                    onChange={(val) => useResumeStore.getState().updateExperience(exp.id, { title: val })}
                    style={{ fontWeight: 600, fontSize: '11pt' }}
                  />
                  <InlineEdit
                    tagName="span"
                    placeholder="Company"
                    value={exp.company ? `· ${exp.company}` : ''}
                    onChange={(val) => useResumeStore.getState().updateExperience(exp.id, { company: val.replace(/^·\s*/, '') })}
                    style={{ color: '#555', marginLeft: '5px' }}
                  />
                </div>
                <span style={{ fontSize: '8.5pt', color: '#888', whiteSpace: 'nowrap', marginLeft: '10px' }}>
                  {formatDate(exp.startMonth, exp.startYear, false)} {exp.startYear && '–'} {exp.current ? 'Present' : formatDate(exp.endMonth, exp.endYear, false)}
                </span>
              </div>
              {exp.description !== undefined && (
                <DescriptionBullets
                  text={exp.description}
                  onChange={(val) => useResumeStore.getState().updateExperience(exp.id, { description: val })}
                  style={{ color: '#444', marginTop: '2mm' }}
                />
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {educations.length > 0 && (
        <section style={{ marginBottom: '6mm' }}>
          <h2 style={{ fontSize: '9pt', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', marginBottom: '4mm' }}>Education</h2>
          {educations.map(edu => (
            <div key={edu.id} style={{ marginBottom: '3mm', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <InlineEdit
                  tagName="span"
                  placeholder="Degree / Course"
                  value={edu.course}
                  onChange={(val) => useResumeStore.getState().updateEducation(edu.id, { course: val })}
                  style={{ fontWeight: 600 }}
                />
                <InlineEdit
                  tagName="span"
                  placeholder="Institution / University"
                  value={edu.university ? ` · ${edu.university}` : ''}
                  onChange={(val) => useResumeStore.getState().updateEducation(edu.id, { university: val.replace(/^·\s*/, '').trim() })}
                  style={{ color: '#555' }}
                />
              </div>
              {edu.cgpa !== undefined && (
                <InlineEdit
                  tagName="span"
                  placeholder="GPA"
                  value={edu.cgpa ? `GPA ${edu.cgpa}` : ''}
                  onChange={(val) => useResumeStore.getState().updateEducation(edu.id, { cgpa: val.replace(/^GPA\s*/, '') })}
                  style={{ fontSize: '9pt', color: '#888' }}
                />
              )}
            </div>
          ))}
        </section>
      )}

      {/* Skills & Languages row */}
      <div style={{ display: 'flex', gap: '12mm' }}>
        {skills.length > 0 && (
          <section style={{ flex: 1 }}>
            <h2 style={{ fontSize: '9pt', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', marginBottom: '3mm' }}>Skills</h2>
            <p style={{ fontSize: '9.5pt', color: '#444' }}>{skills.join(' · ')}</p>
          </section>
        )}
        {languages.length > 0 && (
          <section style={{ flex: 1 }}>
            <h2 style={{ fontSize: '9pt', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', marginBottom: '3mm' }}>Languages</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1mm' }}>
              {languages.map((l, i) => (
                <span key={i} style={{ fontSize: '9.5pt', color: '#444' }}>{l.language}{l.level ? ` · ${l.level}` : ''}</span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default MinimalTemplate;
