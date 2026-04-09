import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { formatDate } from '../../utils/constants';
import DescriptionBullets from './DescriptionBullets';
import InlineEdit from './InlineEdit';

const ExecutiveTemplate: React.FC = () => {
  const { personalInfo, experiences, educations, skills, languages } = useResumeStore();

  return (
    <div style={{ fontFamily: 'Georgia, serif', color: '#1a1a2e', fontSize: '10pt', lineHeight: 1.6 }}>

      {/* Header band */}
      <div style={{ background: '#1a1a2e', color: 'white', padding: '12mm 16mm 10mm' }}>
        <InlineEdit
          tagName="h1"
          placeholder="Your Name"
          value={personalInfo.name}
          onChange={(val) => useResumeStore.getState().setPersonalInfo({ name: val })}
          style={{ fontSize: '24pt', fontWeight: 700, margin: '0 0 2mm', letterSpacing: '-0.01em', fontFamily: 'Georgia, serif' }}
        />
        <div style={{ display: 'flex', gap: '6mm', fontSize: '9pt', color: '#a0aec0', flexWrap: 'wrap' }}>
          <InlineEdit placeholder="Email" value={personalInfo.email ? `✉ ${personalInfo.email}` : ''} onChange={(val) => useResumeStore.getState().setPersonalInfo({ email: val.replace(/^✉\s*/, '') })} />
          <InlineEdit placeholder="Phone" value={personalInfo.phone ? `✆ ${personalInfo.phone}` : ''} onChange={(val) => useResumeStore.getState().setPersonalInfo({ phone: val.replace(/^✆\s*/, '') })} />
          <InlineEdit placeholder="Portfolio" value={personalInfo.portfolioLine ? `🌐 ${personalInfo.portfolioLine}` : ''} onChange={(val) => useResumeStore.getState().setPersonalInfo({ portfolioLine: val.replace(/^🌐\s*/, '') })} />
        </div>
      </div>

      {/* Gold accent bar */}
      <div style={{ height: '3px', background: 'linear-gradient(90deg, #d4af37, #f5e17a, #d4af37)' }} />

      <div style={{ padding: '10mm 16mm', paddingBottom: '20mm' }}>

        {/* Experience */}
        {experiences.length > 0 && (
          <section style={{ marginBottom: '8mm' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6mm', marginBottom: '5mm' }}>
              <h2 style={{ fontSize: '11pt', fontWeight: 700, color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 }}>Professional Experience</h2>
              <div style={{ flex: 1, height: '1px', background: '#d4af37' }} />
            </div>
            {experiences.map(exp => (
              <div key={exp.id} style={{ marginBottom: '6mm', paddingLeft: '4mm', borderLeft: '2px solid #d4af37' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1mm' }}>
                  <InlineEdit
                    tagName="h3"
                    placeholder="Job Title"
                    value={exp.title}
                    onChange={(val) => useResumeStore.getState().updateExperience(exp.id, { title: val })}
                    style={{ fontSize: '11pt', fontWeight: 700, margin: 0 }}
                  />
                  <span style={{ fontSize: '8.5pt', color: '#666', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                    {formatDate(exp.startMonth, exp.startYear, false)} – {exp.current ? 'Present' : formatDate(exp.endMonth, exp.endYear, false)}
                  </span>
                </div>
                <InlineEdit
                  tagName="div"
                  placeholder="Company Name"
                  value={exp.company}
                  onChange={(val) => useResumeStore.getState().updateExperience(exp.id, { company: val })}
                  style={{ fontSize: '10pt', fontStyle: 'italic', color: '#555', marginBottom: '2mm' }}
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

        {/* Education */}
        {educations.length > 0 && (
          <section style={{ marginBottom: '8mm' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6mm', marginBottom: '5mm' }}>
              <h2 style={{ fontSize: '11pt', fontWeight: 700, color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 }}>Education</h2>
              <div style={{ flex: 1, height: '1px', background: '#d4af37' }} />
            </div>
            {educations.map(edu => (
              <div key={edu.id} style={{ marginBottom: '4mm', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <InlineEdit
                    tagName="h3"
                    placeholder="Degree / Course"
                    value={edu.course}
                    onChange={(val) => useResumeStore.getState().updateEducation(edu.id, { course: val })}
                    style={{ fontSize: '10.5pt', fontWeight: 700, margin: '0 0 1mm' }}
                  />
                  <InlineEdit
                    tagName="p"
                    placeholder="Institution / University"
                    value={edu.university}
                    onChange={(val) => useResumeStore.getState().updateEducation(edu.id, { university: val })}
                    style={{ margin: 0, color: '#555', fontStyle: 'italic', fontSize: '9.5pt' }}
                  />
                </div>
                {edu.cgpa !== undefined && (
                  <InlineEdit
                    placeholder="GPA"
                    value={edu.cgpa ? `GPA: ${edu.cgpa}` : ''}
                    onChange={(val) => useResumeStore.getState().updateEducation(edu.id, { cgpa: val.replace(/^GPA:\s*/, '') })}
                    style={{ fontSize: '9pt', color: '#555' }}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '6mm', marginBottom: '4mm' }}>
                <h2 style={{ fontSize: '11pt', fontWeight: 700, color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 }}>Skills</h2>
                <div style={{ flex: 1, height: '1px', background: '#d4af37' }} />
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2mm' }}>
                {skills.map(skill => (
                  <span key={skill} style={{ padding: '1mm 4mm', background: '#f7f3e9', border: '1px solid #d4af37', borderRadius: '2px', fontSize: '9pt', color: '#1a1a2e' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}
          {languages.length > 0 && (
            <section style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6mm', marginBottom: '4mm' }}>
                <h2 style={{ fontSize: '11pt', fontWeight: 700, color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 }}>Languages</h2>
                <div style={{ flex: 1, height: '1px', background: '#d4af37' }} />
              </div>
              {languages.map((l, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5pt', marginBottom: '2mm' }}>
                  <span style={{ fontWeight: 600 }}>{l.language}</span>
                  {l.level && <span style={{ color: '#888', fontStyle: 'italic' }}>{l.level}</span>}
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExecutiveTemplate;
