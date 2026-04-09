import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { formatDate } from '../../utils/constants';
import DescriptionBullets from './DescriptionBullets';
import InlineEdit from './InlineEdit';

const ProfessionalTemplate: React.FC = () => {
  const { personalInfo, experiences, educations, skills, languages } = useResumeStore();

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', padding: '12mm 16mm', paddingBottom: '20mm', color: '#1f2937', fontSize: '10pt', lineHeight: 1.6 }}>

      {/* Header */}
      <div style={{ borderBottom: '2px solid #111827', paddingBottom: '6mm', marginBottom: '7mm', textAlign: 'center' }}>
        <InlineEdit
          tagName="h1"
          placeholder="Your Name"
          value={personalInfo.name}
          onChange={(val) => useResumeStore.getState().setPersonalInfo({ name: val })}
          style={{ fontSize: '22pt', margin: '0 0 2mm', fontWeight: 700, color: '#111827', letterSpacing: '-0.02em', textTransform: 'uppercase' }}
        />
        <div style={{ fontSize: '9pt', color: '#4b5563', display: 'flex', justifyContent: 'center', gap: '5mm', flexWrap: 'wrap' }}>
          {personalInfo.email && <InlineEdit placeholder="Email" value={personalInfo.email} onChange={(val) => useResumeStore.getState().setPersonalInfo({ email: val })} />}
          {personalInfo.phone && <InlineEdit placeholder="Phone" value={`${personalInfo.email ? '· ' : ''}${personalInfo.phone}`} onChange={(val) => useResumeStore.getState().setPersonalInfo({ phone: val.replace(/^·\s*/, '') })} />}
          {personalInfo.portfolioLine && <InlineEdit placeholder="Portfolio" value={`${(personalInfo.email || personalInfo.phone) ? '· ' : ''}${personalInfo.portfolioLine}`} onChange={(val) => useResumeStore.getState().setPersonalInfo({ portfolioLine: val.replace(/^·\s*/, '') })} />}
        </div>
      </div>

      {/* Experience */}
      {experiences.length > 0 && (
        <section style={{ marginBottom: '7mm' }}>
          <h2 style={{ fontSize: '9pt', fontWeight: 700, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4mm', borderBottom: '1px solid #e5e7eb', paddingBottom: '1.5mm' }}>
            Experience
          </h2>
          {experiences.map(exp => (
            <div key={exp.id} style={{ marginBottom: '5mm' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1mm' }}>
                <InlineEdit
                  tagName="h3"
                  placeholder="Job Title"
                  value={exp.title}
                  onChange={(val) => useResumeStore.getState().updateExperience(exp.id, { title: val })}
                  style={{ fontSize: '11pt', fontWeight: 600, margin: 0 }}
                />
                <span style={{ fontSize: '8.5pt', color: '#6b7280', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                  {formatDate(exp.startMonth, exp.startYear, false)} – {exp.current ? 'Present' : formatDate(exp.endMonth, exp.endYear, false)}
                </span>
              </div>
              <InlineEdit
                tagName="div"
                placeholder="Company Name"
                value={exp.company}
                onChange={(val) => useResumeStore.getState().updateExperience(exp.id, { company: val })}
                style={{ fontSize: '10pt', fontWeight: 500, color: '#374151', marginBottom: '1.5mm' }}
              />
              {exp.description !== undefined && (
                <DescriptionBullets
                  text={exp.description}
                  onChange={(val) => useResumeStore.getState().updateExperience(exp.id, { description: val })}
                  style={{ color: '#4b5563' }}
                />
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {educations.length > 0 && (
        <section style={{ marginBottom: '7mm' }}>
          <h2 style={{ fontSize: '9pt', fontWeight: 700, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4mm', borderBottom: '1px solid #e5e7eb', paddingBottom: '1.5mm' }}>
            Education
          </h2>
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
                  style={{ fontSize: '9.5pt', color: '#374151' }}
                />
              </div>
              {edu.cgpa !== undefined && (
                <InlineEdit
                  placeholder="CGPA"
                  value={edu.cgpa ? `CGPA: ${edu.cgpa}` : ''}
                  onChange={(val) => useResumeStore.getState().updateEducation(edu.id, { cgpa: val.replace(/^CGPA:\s*/, '') })}
                  style={{ fontSize: '9pt', color: '#6b7280' }}
                />
              )}
            </div>
          ))}
        </section>
      )}

      {/* Skills & Languages */}
      <div style={{ display: 'flex', gap: '12mm' }}>
        {skills.length > 0 && (
          <section style={{ flex: 1 }}>
            <h2 style={{ fontSize: '9pt', fontWeight: 700, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '3mm', borderBottom: '1px solid #e5e7eb', paddingBottom: '1.5mm' }}>Skills</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2mm' }}>
              {skills.map(s => (
                <span key={s} style={{ padding: '0.5mm 3mm', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '2px', fontSize: '9pt' }}>{s}</span>
              ))}
            </div>
          </section>
        )}
        {languages.length > 0 && (
          <section style={{ flex: 1 }}>
            <h2 style={{ fontSize: '9pt', fontWeight: 700, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '3mm', borderBottom: '1px solid #e5e7eb', paddingBottom: '1.5mm' }}>Languages</h2>
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
  );
};

export default ProfessionalTemplate;
