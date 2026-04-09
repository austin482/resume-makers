import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud, ArrowRight, ArrowLeft, FileText,
  CheckCircle2, Loader2, Sparkles, AlertCircle, User,
  Briefcase, GraduationCap, Code2
} from 'lucide-react';
import { useResumeStore } from '../store/useResumeStore';
import { extractTextFromFile } from '../utils/fileExtractor';
import { parseResumeWithAI, tailorResumeToJob } from '../utils/openrouter';

type FlowStep = 'upload' | 'parsing' | 'review' | 'tailor' | 'tailoring';

const HasResumeFlow: React.FC = () => {
  const navigate = useNavigate();
  const store = useResumeStore();

  // File & form state
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [company, setCompany] = useState('');
  const [jd, setJd] = useState('');
  const [link, setLink] = useState('');

  // Flow state
  const [flowStep, setFlowStep] = useState<FlowStep>('upload');
  const [parseError, setParseError] = useState<string | null>(null);
  const [parsedSummary, setParsedSummary] = useState<{ experiences: number; skills: number; education: number } | null>(null);

  const ALLOWED_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const ALLOWED_EXTS = ['.pdf', '.docx'];
  const MAX_MB = 5;

  const validateAndSetFile = (f: File) => {
    const ext = f.name.toLowerCase().slice(f.name.lastIndexOf('.'));
    if (!ALLOWED_TYPES.includes(f.type) && !ALLOWED_EXTS.includes(ext)) {
      setFileError('Only PDF and DOCX files are accepted.');
      setFile(null);
      return;
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      setFileError(`File too large. Maximum is ${MAX_MB}MB.`);
      setFile(null);
      return;
    }
    setFileError(null);
    setFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files[0]) validateAndSetFile(e.dataTransfer.files[0]);
  };

  // ── Step 1: Parse the uploaded file ──────────────────────────
  const handleParse = async () => {
    if (!file) return;
    setFlowStep('parsing');
    setParseError(null);
    try {
      const rawText = await extractTextFromFile(file);
      if (!rawText.trim()) {
        throw new Error('Your file appears to be a scanned image or contains no readable text. Please try a different document format.');
      }
      
      const parsed = await parseResumeWithAI(rawText);

      // Populate store
      store.setPersonalInfo({
        name: parsed.name,
        email: parsed.email,
        phone: parsed.phone,
        portfolioLine: parsed.portfolioLine,
        photo: '',
      });
      parsed.experiences.forEach(exp =>
        store.addExperience({ ...exp, id: Date.now().toString() + Math.random().toString(36).slice(2) })
      );
      parsed.educations.forEach(edu =>
        store.addEducation({ ...edu, id: Date.now().toString() + Math.random().toString(36).slice(2) })
      );
      store.setSkills(parsed.skills);
      parsed.languages.forEach(l => store.addLanguage(l));

      // Also save job targeting info
      store.setTargetMatch({ targetCompany: company, jobDescription: jd, jobLink: link });

      setParsedSummary({
        experiences: parsed.experiences.length,
        skills: parsed.skills.length,
        education: parsed.educations.length,
      });
      setFlowStep('review');
    } catch (err) {
      setParseError(err instanceof Error ? err.message : 'Failed to parse resume. Try a different file.');
      setFlowStep('upload');
    }
  };

  // ── Step 2: Tailor resume to JD ──────────────────────────────
  const handleTailor = async () => {
    if (!jd) { navigate('/builder'); return; }
    setFlowStep('tailoring');
    try {
      const updatedDescriptions = await tailorResumeToJob(
        store.experiences.map(e => ({ title: e.title, company: e.company, description: e.description })),
        company,
        jd,
      );
      updatedDescriptions.forEach((desc, i) => {
        if (store.experiences[i]) store.updateExperience(store.experiences[i].id, { description: desc });
      });
    } catch {
      // Silent fail — just go to builder with original content
    }
    navigate('/builder');
  };

  // ────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--bg-main)' }}>

      {/* Header */}
      <header className="glass-header">
        <div style={{ padding: '0.875rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => flowStep === 'review' ? setFlowStep('upload') : navigate(-1)}
            className="btn btn-secondary flex items-center gap-2" style={{ padding: '0.45rem 1rem', fontSize: '0.875rem' }}>
            <ArrowLeft size={15} /> Back
          </button>
          <div className="flex items-center gap-2" style={{ color: 'var(--primary-600)', fontWeight: 700, fontFamily: 'var(--font-heading)', fontSize: '1rem' }}>
            <FileText size={18} /> Resume Makers
          </div>
        </div>
        {/* Progress bar */}
        <div className="step-progress-bar" style={{ borderRadius: 0 }}>
          <div className="step-progress-fill" style={{ width: flowStep === 'upload' ? '33%' : flowStep === 'parsing' ? '66%' : '100%' }} />
        </div>
      </header>

      <div style={{ maxWidth: '680px', width: '100%', margin: '0 auto', padding: '2.5rem 1.25rem 3rem' }}>

        {/* ── UPLOAD STEP ────────────────────────────────── */}
        {(flowStep === 'upload') && (
          <div className="animate-fade-in flex flex-col" style={{ gap: '1.5rem' }}>
            <div>
              <span className="chip chip-primary" style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>Upload Resume</span>
              <h1 style={{ fontSize: '1.875rem', margin: '0 0 0.4rem', fontWeight: 700 }}>Upload your resume</h1>
              <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9375rem', lineHeight: 1.6 }}>
                We'll extract your data automatically so you can review and edit it.
              </p>
            </div>

            {/* Drop zone */}
            <div
              className="premium-card"
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input')?.click()}
              style={{
                border: `2px dashed ${isDragging ? 'var(--primary-500)' : file ? 'var(--primary-300)' : 'var(--border-color)'}`,
                background: isDragging ? 'var(--primary-50)' : file ? '#f0fdf4' : 'white',
                padding: '2.5rem', textAlign: 'center',
                transition: 'all var(--transition-normal)', cursor: 'pointer',
              }}
            >
              {file ? (
                <div className="flex flex-col items-center gap-3">
                  <CheckCircle2 size={44} style={{ color: '#16a34a' }} />
                  <div>
                    <p style={{ fontWeight: 600, color: '#15803d', fontSize: '1rem', margin: '0 0 0.25rem' }}>{file.name}</p>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>
                      {(file.size / (1024 * 1024)).toFixed(2)} MB · Click to change
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: isDragging ? 'var(--primary-100)' : 'var(--primary-50)', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <UploadCloud size={32} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '1rem', margin: '0 0 0.25rem' }}>Drag & drop or click to browse</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', margin: 0 }}>PDF or DOCX · max 5 MB</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="chip chip-primary">PDF</span>
                    <span className="chip chip-primary">DOCX</span>
                    <span className="chip chip-neutral">Max 5 MB</span>
                  </div>
                </div>
              )}
              {fileError && (
                <div style={{ marginTop: '0.75rem', padding: '0.6rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', color: '#dc2626', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={15} /> {fileError}
                </div>
              )}
              <input id="file-input" type="file" accept=".pdf,.docx" style={{ display: 'none' }}
                onChange={e => e.target.files?.[0] && validateAndSetFile(e.target.files[0])} />
            </div>

            {parseError && (
              <div style={{ padding: '0.75rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', color: '#dc2626', fontSize: '0.875rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{parseError}</span>
              </div>
            )}

            {/* Optional job details */}
            <div className="premium-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="divider-label">
                Target Job Details <span className="chip chip-neutral" style={{ fontSize: '0.75rem' }}>Optional · AI will tailor your resume</span>
              </div>
              <div>
                <label className="form-label">Target Company</label>
                <input type="text" className="form-input" placeholder="e.g. Google, Stripe…" value={company} onChange={e => setCompany(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Job Posting URL</label>
                <input type="url" className="form-input" placeholder="https://…" value={link} onChange={e => setLink(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Job Description</label>
                <textarea className="form-input" rows={5} style={{ resize: 'vertical' }}
                  placeholder="Paste the full job description — AI will use this to subtly tailor your resume keywords…"
                  value={jd} onChange={e => setJd(e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary" style={{ gap: '0.5rem', padding: '0.8rem 2rem' }}
                disabled={!file || !!fileError} onClick={handleParse}>
                <Sparkles size={16} /> Extract & Auto-fill
              </button>
            </div>
          </div>
        )}

        {/* ── PARSING STEP ──────────────────────────────── */}
        {flowStep === 'parsing' && (
          <div className="animate-fade-in flex flex-col items-center text-center" style={{ gap: '1.5rem', paddingTop: '4rem' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary-50)', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Loader2 size={40} className="animate-spin" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem', fontWeight: 700 }}>Reading your resume…</h2>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>AI is extracting your experience, skills, and education. This takes a few seconds.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', maxWidth: '320px' }}>
              {['Extracting text from file', 'Identifying sections', 'Structuring your data'].map((step, i) => (
                <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 1rem', background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', color: 'var(--text-secondary)', animation: `fadeIn 0.5s ease ${i * 0.3}s both` }}>
                  <Loader2 size={14} className="animate-spin" style={{ color: 'var(--primary-500)', flexShrink: 0 }} />
                  {step}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── REVIEW STEP ───────────────────────────────── */}
        {flowStep === 'review' && parsedSummary && (
          <div className="animate-fade-in flex flex-col" style={{ gap: '1.5rem' }}>
            <div>
              <span className="chip chip-primary" style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>✅ Extraction Complete</span>
              <h1 style={{ fontSize: '1.875rem', margin: '0 0 0.4rem', fontWeight: 700 }}>Here's what we found</h1>
              <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9375rem' }}>
                Review the summary below. You can edit everything in the builder.
              </p>
            </div>

            {/* Summary cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
              {[
                { icon: <User size={20} />, label: 'Profile', value: store.personalInfo.name || 'Detected', ok: !!store.personalInfo.name },
                { icon: <Briefcase size={20} />, label: 'Experiences', value: `${parsedSummary.experiences} role${parsedSummary.experiences !== 1 ? 's' : ''}`, ok: parsedSummary.experiences > 0 },
                { icon: <GraduationCap size={20} />, label: 'Education', value: `${parsedSummary.education} entry`, ok: parsedSummary.education > 0 },
                { icon: <Code2 size={20} />, label: 'Skills', value: `${parsedSummary.skills} skill${parsedSummary.skills !== 1 ? 's' : ''}`, ok: parsedSummary.skills > 0 },
              ].map(card => (
                <div key={card.label} className="premium-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <div style={{ color: card.ok ? 'var(--primary-600)' : 'var(--text-tertiary)' }}>{card.icon}</div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', margin: '0 0 0.1rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</p>
                    <p style={{ fontSize: '0.9375rem', fontWeight: 600, margin: 0, color: card.ok ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>{card.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Profile preview */}
            <div className="premium-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', margin: '0 0 0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Extracted Profile</p>
              <p style={{ margin: 0, fontWeight: 600, fontSize: '1.1rem' }}>{store.personalInfo.name || '—'}</p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                {store.personalInfo.email && <span>✉ {store.personalInfo.email}</span>}
                {store.personalInfo.phone && <span>📞 {store.personalInfo.phone}</span>}
                {store.personalInfo.portfolioLine && <span>🌐 {store.personalInfo.portfolioLine}</span>}
              </div>
            </div>

            {/* Job tailoring callout */}
            {jd && (
              <div style={{ padding: '1rem 1.25rem', background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)', border: '1px solid #c7d2fe', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <p style={{ fontWeight: 600, color: '#3730a3', margin: '0 0 0.2rem', fontSize: '0.9375rem' }}>
                    🎯 Tailor for {company || 'this job'}?
                  </p>
                  <p style={{ fontSize: '0.8125rem', color: '#4338ca', margin: 0 }}>
                    AI will subtly align your descriptions with the job keywords — without rewriting them.
                  </p>
                </div>
                <button className="btn-ai" style={{ padding: '0.6rem 1.25rem', whiteSpace: 'nowrap' }} onClick={handleTailor}>
                  <Sparkles size={14} /> Tailor My Resume
                </button>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem' }}>
              <button className="btn btn-secondary" onClick={() => setFlowStep('upload')}>
                Re-upload
              </button>
              <button className="btn btn-primary" style={{ gap: '0.5rem', padding: '0.8rem 2rem' }} onClick={() => navigate('/builder')}>
                Go to Builder <ArrowRight size={17} />
              </button>
            </div>
          </div>
        )}

        {/* ── TAILORING STEP ────────────────────────────── */}
        {flowStep === 'tailoring' && (
          <div className="animate-fade-in flex flex-col items-center text-center" style={{ gap: '1.5rem', paddingTop: '4rem' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #eef2ff, #ede9fe)', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={40} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem', fontWeight: 700 }}>Tailoring your resume…</h2>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                AI is aligning your experience with <strong>{company || 'the job description'}</strong>. Keeping your voice intact.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default HasResumeFlow;
