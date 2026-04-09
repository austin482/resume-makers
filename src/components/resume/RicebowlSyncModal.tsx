import React, { useState } from 'react';
import { X, Loader2, Check, ChevronRight, Mail } from 'lucide-react';

interface Props {
  onClose: () => void;
  onProceed: (prefs: { shareRicebowl: boolean; recommendationEmail: boolean }) => void;
  isExporting: boolean;
  latestJobTitle?: string;
}

const BRAND = '#25A67F';
const BRAND_DARK = '#1d8c6a';
const BRAND_LIGHT = '#e8f7f2';

const RicebowlSyncModal: React.FC<Props> = ({ onClose, onProceed, isExporting, latestJobTitle }) => {
  const [agreed, setAgreed] = useState(false);
  const [recommendationEmail, setRecommendationEmail] = useState(true);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        background: 'rgba(10, 20, 15, 0.5)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        animation: 'fadeInBg 0.2s ease',
      }}
      onClick={(e) => { if (e.target === e.currentTarget && !isExporting) onClose(); }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '420px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(37,166,127,0.1)',
          overflow: 'hidden',
          animation: 'slideUpModal 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          position: 'relative',
        }}
      >
        {/* Loading overlay */}
        {isExporting && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 10,
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(4px)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '1rem',
          }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 8px 24px rgba(37,166,127,0.35)`,
            }}>
              <Loader2 size={28} color="white" className="animate-spin" />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0d3d2e', margin: '0 0 4px' }}>Generating your PDF…</p>
              <p style={{ fontSize: '0.8125rem', color: BRAND, margin: 0 }}>Hang tight, almost done!</p>
            </div>
          </div>
        )}

        {/* Close */}
        <button
          onClick={onClose}
          disabled={isExporting}
          style={{
            position: 'absolute', top: '14px', right: '14px', zIndex: 5,
            width: '30px', height: '30px', borderRadius: '50%',
            border: 'none', background: 'rgba(255,255,255,0.8)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.6)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.8)')}
        >
          <X size={15} color="#333" />
        </button>

        {/* ── Header ─────────────────────────────────── */}
        <div style={{
          background: `linear-gradient(160deg, ${BRAND} 0%, ${BRAND_DARK} 100%)`,
          padding: '2rem 2rem 1.5rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: '-24px', right: '-24px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
          <div style={{ position: 'absolute', bottom: '-16px', left: '-16px', width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />

          {/* Logo */}
          <div style={{
            width: '72px', height: '72px', borderRadius: '20px',
            overflow: 'hidden',
            margin: '0 auto 0.875rem',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            position: 'relative', zIndex: 1,
          }}>
            <img
              src="/ricebowl-logo.png"
              alt="Ricebowl Logo"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <h2 style={{
            margin: '0 0 0.3rem',
            fontWeight: 800, fontSize: '1.25rem',
            color: 'white',
            fontFamily: 'var(--font-heading)',
            position: 'relative', zIndex: 1,
          }}>
            Boost Your Job Exposure
          </h2>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.75)', fontSize: '0.8125rem', fontWeight: 500, position: 'relative', zIndex: 1 }}>
            Powered by Ricebowl · by AJobThing
          </p>
        </div>

        {/* ── Body ─────────────────────────────────── */}
        <div style={{ padding: '1.5rem 1.75rem 1.75rem' }}>
          <p style={{
            color: '#374151', lineHeight: 1.65, fontSize: '0.9rem',
            margin: '0 0 1.25rem',
          }}>
            Share your <strong>Contact Info</strong> and <strong>Resume</strong> to get noticed by employers who are hiring right now.
          </p>

          {/* Benefits */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {[
              'Be Seen By Verified Employers',
              'AI-Powered Job Matching',
              'Real Time Job Alert',
            ].map((b) => (
              <div key={b} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <div style={{
                  width: '18px', height: '18px', borderRadius: '50%',
                  background: BRAND_LIGHT, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Check size={10} color={BRAND} strokeWidth={3} />
                </div>
                <span style={{ fontSize: '0.85rem', color: '#4b5563' }}>{b}</span>
              </div>
            ))}
          </div>

          {/* ── Inline email opt-in (revealed on agree) ── */}
          <div
            style={{
              maxHeight: agreed ? '300px' : '0',
              overflow: 'hidden',
              transition: 'max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, margin 0.3s ease',
              opacity: agreed ? 1 : 0,
              marginBottom: agreed ? '1.25rem' : '0',
            }}
          >
            <div
              onClick={() => setRecommendationEmail(!recommendationEmail)}
              style={{
                padding: '0.875rem 1rem',
                borderRadius: '12px',
                border: `1.5px solid ${recommendationEmail ? BRAND : '#e5e7eb'}`,
                background: recommendationEmail ? BRAND_LIGHT : '#fafafa',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.875rem',
                transition: 'all 0.2s',
              }}
            >
              <div style={{
                width: '22px', height: '22px', borderRadius: '7px', flexShrink: 0,
                border: `2px solid ${recommendationEmail ? BRAND : '#d1d5db'}`,
                background: recommendationEmail ? BRAND : 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}>
                {recommendationEmail && <Check size={13} color="white" strokeWidth={3} />}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={15} color={recommendationEmail ? BRAND : '#9ca3af'} />
                <div>
                  <p style={{ margin: '0 0 4px', fontWeight: 700, color: recommendationEmail ? BRAND_DARK : '#374151', fontSize: '0.9rem' }}>
                    Send Me Job Recommendations
                  </p>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: recommendationEmail ? BRAND : '#9ca3af', lineHeight: 1.5 }}>
                    I would like to receive{latestJobTitle ? <> <strong>{latestJobTitle}</strong></> : ''} related job recommendations from Ricebowl's latest matches for my experience via email.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Buttons ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {!agreed ? (
              <>
                <button
                  onClick={() => setAgreed(true)}
                  style={{
                    width: '100%', padding: '0.875rem',
                    border: 'none', borderRadius: '14px', cursor: 'pointer',
                    background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_DARK} 100%)`,
                    color: 'white', fontWeight: 700, fontSize: '0.9375rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    boxShadow: `0 8px 24px rgba(37,166,127,0.3)`,
                    transition: 'transform 0.15s, box-shadow 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 12px 32px rgba(37,166,127,0.4)`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 8px 24px rgba(37,166,127,0.3)`; }}
                >
                  Yes, sync my profile <ChevronRight size={16} />
                </button>
                <button
                  onClick={() => onProceed({ shareRicebowl: false, recommendationEmail: false })}
                  style={{
                    width: '100%', padding: '0.7rem',
                    border: `1.5px solid #e5e7eb`, borderRadius: '14px', cursor: 'pointer',
                    background: 'transparent', color: '#9ca3af',
                    fontWeight: 600, fontSize: '0.85rem',
                    transition: 'border-color 0.15s, color 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.color = '#6b7280'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#9ca3af'; }}
                >
                  No thanks, just export PDF
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onProceed({ shareRicebowl: true, recommendationEmail })}
                  style={{
                    width: '100%', padding: '0.875rem',
                    border: 'none', borderRadius: '14px', cursor: 'pointer',
                    background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_DARK} 100%)`,
                    color: 'white', fontWeight: 700, fontSize: '0.9375rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    boxShadow: `0 8px 24px rgba(37,166,127,0.3)`,
                    transition: 'transform 0.15s, box-shadow 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 12px 32px rgba(37,166,127,0.4)`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 8px 24px rgba(37,166,127,0.3)`; }}
                >
                  Confirm & Export PDF
                </button>
                <button
                  onClick={() => setAgreed(false)}
                  style={{
                    width: '100%', padding: '0.5rem',
                    border: 'none', borderRadius: '12px', cursor: 'pointer',
                    background: 'transparent', color: '#9ca3af',
                    fontWeight: 500, fontSize: '0.8rem',
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#6b7280'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; }}
                >
                  ← Go back
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInBg {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUpModal {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default RicebowlSyncModal;
