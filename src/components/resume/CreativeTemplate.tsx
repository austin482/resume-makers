import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { formatDate } from '../../utils/constants';
import DescriptionBullets from './DescriptionBullets';
import InlineEdit from './InlineEdit';

const CreativeTemplate: React.FC = () => {
  const { personalInfo, experiences, educations, skills, languages } = useResumeStore();

  return (
    <div style={{ fontFamily: 'Outfit, sans-serif', display: 'flex', minHeight: '297mm', color: '#1f2937', fontSize: '10pt' }}>

      {/* Sidebar */}
      <div style={{ width: '34%', backgroundColor: '#1e1b4b', color: '#c7d2fe', padding: '12mm 8mm', display: 'flex', flexDirection: 'column', gap: '8mm' }}>

        {/* Avatar / Photo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3mm' }}>
          {personalInfo.photo
            ? <img src={personalInfo.photo} alt="Profile" style={{ width: '28mm', height: '28mm', borderRadius: '50%', objectFit: 'cover', border: '2px solid #818cf8' }} />
            : <div style={{ width: '28mm', height: '28mm', borderRadius: '50%', backgroundColor: '#312e81', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18pt', color: '#818cf8', fontWeight: 700 }}>
                {personalInfo.name ? personalInfo.name.charAt(0).toUpperCase() : '?'}
              </div>
          }
          <InlineEdit
            tagName="h1"
            placeholder="Your Name"
            value={personalInfo.name}
            onChange={(val) => useResumeStore.getState().setPersonalInfo({ name: val })}
            style={{ fontSize: '13pt', fontWeight: 700, margin: 0, color: 'white', textAlign: 'center', lineHeight: 1.2 }}
          />
        </div>

        {/* Contact */}
        <div>
          <h2 style={{ fontSize: '8pt', color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.12em', borderBottom: '1px solid #3730a3', paddingBottom: '1.5mm', marginBottom: '3mm' }}>Contact</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2mm', fontSize: '8.5pt' }}>
            {personalInfo.phone && <InlineEdit placeholder="Phone" value={`📞 ${personalInfo.phone}`} onChange={(val) => useResumeStore.getState().setPersonalInfo({ phone: val.replace(/^📞\s*/, '') })} />}
            {personalInfo.email && <InlineEdit placeholder="Email" value={`✉ ${personalInfo.email}`} onChange={(val) => useResumeStore.getState().setPersonalInfo({ email: val.replace(/^✉\s*/, '') })} style={{ wordBreak: 'break-all' }} />}
            {personalInfo.portfolioLine && <InlineEdit placeholder="Portfolio" value={`🌐 ${personalInfo.portfolioLine}`} onChange={(val) => useResumeStore.getState().setPersonalInfo({ portfolioLine: val.replace(/^🌐\s*/, '') })} style={{ wordBreak: 'break-all' }} />}
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <h2 style={{ fontSize: '8pt', color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.12em', borderBottom: '1px solid #3730a3', paddingBottom: '1.5mm', marginBottom: '3mm' }}>Skills</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5mm' }}>
              {skills.map(skill => (
                <span key={skill} style={{ backgroundColor: '#3730a3', padding: '0.5mm 3mm', borderRadius: '2px', fontSize: '8pt', color: 'white' }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div>
            <h2 style={{ fontSize: '8pt', color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.12em', borderBottom: '1px solid #3730a3', paddingBottom: '1.5mm', marginBottom: '3mm' }}>Languages</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2mm' }}>
              {languages.map((l, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8.5pt' }}>
                  <span>{l.language}</span>
                  {l.level && <span style={{ color: '#a5b4fc', fontSize: '8pt' }}>{l.level}</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, backgroundColor: 'white', padding: '12mm 11mm', paddingBottom: '20mm', display: 'flex', flexDirection: 'column', gap: '7mm' }}>

        {experiences.length > 0 && (
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4mm', marginBottom: '5mm' }}>
              <div style={{ width: '8mm', height: '2px', backgroundColor: '#3730a3' }} />
              <h2 style={{ fontSize: '11pt', fontWeight: 700, color: '#111827', textTransform: 'uppercase', margin: 0, letterSpacing: '0.06em' }}>Experience</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5mm' }}>
              {experiences.map(exp => (
                <div key={exp.id} style={{ paddingLeft: '3mm', borderLeft: '2px solid #e0e7ff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5mm' }}>
                    <InlineEdit
                      tagName="h3"
                      placeholder="Job Title"
                      value={exp.title}
                      onChange={(val) => useResumeStore.getState().updateExperience(exp.id, { title: val })}
                      style={{ fontSize: '11pt', fontWeight: 600, margin: 0, color: '#1f2937' }}
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
                    style={{ fontSize: '9.5pt', color: '#4f46e5', fontWeight: 500, marginBottom: '1.5mm' }}
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
            </div>
          </section>
        )}

        {educations.length > 0 && (
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4mm', marginBottom: '5mm' }}>
              <div style={{ width: '8mm', height: '2px', backgroundColor: '#3730a3' }} />
              <h2 style={{ fontSize: '11pt', fontWeight: 700, color: '#111827', textTransform: 'uppercase', margin: 0, letterSpacing: '0.06em' }}>Education</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4mm' }}>
              {educations.map(edu => (
                <div key={edu.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <InlineEdit
                      tagName="h3"
                      placeholder="Degree / Course"
                      value={edu.course}
                      onChange={(val) => useResumeStore.getState().updateEducation(edu.id, { course: val })}
                      style={{ fontSize: '10.5pt', fontWeight: 600, margin: 0, color: '#1f2937' }}
                    />
                    {edu.cgpa !== undefined && (
                      <InlineEdit
                        placeholder="GPA"
                        value={edu.cgpa ? `GPA: ${edu.cgpa}` : ''}
                        onChange={(val) => useResumeStore.getState().updateEducation(edu.id, { cgpa: val.replace(/^GPA:\s*/, '') })}
                        style={{ fontSize: '9pt', color: '#4f46e5', fontWeight: 500 }}
                      />
                    )}
                  </div>
                  <InlineEdit
                    tagName="div"
                    placeholder="Institution / University"
                    value={edu.university}
                    onChange={(val) => useResumeStore.getState().updateEducation(edu.id, { university: val })}
                    style={{ fontSize: '9.5pt', color: '#4b5563' }}
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default CreativeTemplate;
