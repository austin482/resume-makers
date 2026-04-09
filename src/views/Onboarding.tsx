import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Edit3, Eye, Target, Layout, ChevronRight, Zap } from 'lucide-react';
import { useResumeStore } from '../store/useResumeStore';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const setHasResume = useResumeStore((state) => state.setHasResume);
  const reset = useResumeStore((state) => state.reset);

  const handleChoice = (hasResume: boolean) => {
    // Always start with a completely fresh state to avoid carrying over persisted data
    reset();
    setHasResume(hasResume);
    navigate(hasResume ? '/onboarding/has-resume' : '/onboarding/create-resume');
  };

  const features = [
    { icon: <Eye size={28} />, title: 'Real-Time Preview', desc: 'See your resume update live as you type — no guesswork.' },
    { icon: <Zap size={28} />, title: 'AI Optimization', desc: 'Let AI polish your job descriptions with a single click.' },
    { icon: <Target size={28} />, title: 'Job Targeting', desc: 'Paste a job description and tailor your resume to it.' },
    { icon: <Layout size={28} />, title: 'Premium Templates', desc: 'Switch between stunning layouts instantly.' },
  ];

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--bg-main)' }}>

      {/* Sticky Glass Header */}
      <header className="glass-header">
        <div className="container flex items-center justify-between" style={{ padding: '1rem 1.5rem' }}>
          <div className="flex items-center gap-2" style={{ color: 'var(--primary-600)', fontWeight: 700, fontSize: '1.2rem', fontFamily: 'var(--font-heading)' }}>
            <FileText size={22} /> Resume Makers
          </div>
          <button
            className="btn btn-primary"
            style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}
            onClick={() => document.getElementById('start-building')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Get Started <ChevronRight size={16} />
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center">

        {/* Hero */}
        <section className="w-full flex items-center justify-center animate-fade-in" style={{ minHeight: '70vh', padding: '4rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
          {/* Background blobs */}
          <div style={{ position: 'absolute', top: '-80px', left: '-120px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-80px', right: '-120px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div className="flex flex-col items-center text-center" style={{ maxWidth: '760px', gap: '1.75rem' }}>
            <span className="chip chip-primary">✨ AI-Powered · Free to Use · Instant PDF</span>

            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.75rem)', lineHeight: 1.1, fontWeight: 700, letterSpacing: '-0.03em', maxWidth: '600px', textAlign: 'center' }}>
              Build a Resume that <span className="text-gradient">Gets You Noticed</span>
            </h1>

            <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '520px', textAlign: 'center', margin: 0 }}>
              Build a recruiter-ready resume in minutes. AI-powered writing and professional formatting, made simple.
            </p>

            <div className="flex gap-4">
              <button
                className="btn btn-primary"
                style={{ padding: '0.9rem 2.25rem', fontSize: '1.05rem', gap: '0.5rem' }}
                onClick={() => document.getElementById('start-building')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Build My Resume <ChevronRight size={18} />
              </button>
            </div>

            {/* Social proof row */}
            <div className="flex items-center gap-2" style={{ marginTop: '0.25rem', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
              <span>⭐⭐⭐⭐⭐</span>
              <span>Trusted by 10,000+ job seekers</span>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="w-full" style={{ background: 'white', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '4rem 1.5rem' }}>
          <div className="container">
            <h2 className="text-center" style={{ fontSize: '1.875rem', marginBottom: '0.75rem' }}>Everything you need</h2>
            <p className="text-center" style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>All the tools to craft a standout resume, in one place.</p>
            <div className="flex gap-6 justify-center" style={{ flexWrap: 'wrap' }}>
              {features.map((f, i) => (
                <div
                  key={i}
                  className="premium-card card-hover flex flex-col items-center text-center p-6 gap-4"
                  style={{ flex: '1 1 200px', maxWidth: '260px' }}
                >
                  <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-lg)', background: 'var(--primary-50)', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {f.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.4rem' }}>{f.title}</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Choice Section */}
        <section id="start-building" className="w-full flex flex-col items-center" style={{ padding: '5rem 1.5rem', minHeight: '60vh', justifyContent: 'center' }}>
          <div className="text-center" style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>How would you like to start?</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Pick the path that works best for you.</p>
          </div>

          <div className="flex gap-6 justify-center" style={{ maxWidth: '780px', width: '100%', flexWrap: 'wrap' }}>
            {/* Card: I have a resume */}
            <button
              onClick={() => handleChoice(true)}
              className="premium-card card-hover flex flex-col items-center text-center"
              style={{ flex: '1 1 320px', border: '2px solid var(--border-color)', cursor: 'pointer', background: 'white', padding: '2.5rem 2rem 2rem' }}
            >
              <div style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-xl)', background: 'linear-gradient(135deg, var(--primary-100), var(--primary-50))', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <FileText size={28} />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', fontWeight: 700 }}>I have a resume</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 1.25rem', fontSize: '0.9375rem', maxWidth: '260px' }}>
                Upload your existing resume and optionally provide a target job to tailor it.
              </p>
              <span className="chip chip-primary" style={{ marginTop: 'auto' }}>Quick · Upload & Go</span>
            </button>

            {/* Card: Start fresh */}
            <button
              onClick={() => handleChoice(false)}
              className="premium-card card-hover flex flex-col items-center text-center"
              style={{ flex: '1 1 320px', border: '2px solid var(--border-color)', cursor: 'pointer', background: 'white', padding: '2.5rem 2rem 2rem' }}
            >
              <div style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-xl)', background: 'linear-gradient(135deg, #ede9fe, #f5f3ff)', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Edit3 size={28} />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', fontWeight: 700 }}>Start from scratch</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 1.25rem', fontSize: '0.9375rem', maxWidth: '260px' }}>
                We'll walk you through a guided 4-step form to build your complete resume.
              </p>
              <span className="chip chip-neutral" style={{ marginTop: 'auto' }}>4 Steps · AI-assisted</span>
            </button>
          </div>
        </section>

      </main>

      <footer style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.875rem', borderTop: '1px solid var(--border-color)' }}>
        © {new Date().getFullYear()} Resume Makers. All rights reserved.
      </footer>
    </div>
  );
};

export default Onboarding;
