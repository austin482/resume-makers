import React, { useRef, useEffect, useState, useCallback } from 'react';
import BuilderEditor from '../components/forms/BuilderEditor';
import ResumePreview from '../components/resume/ResumePreview';
import { ArrowLeft, Download, FileText, Loader2, Check, CloudOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useResumeStore } from '../store/useResumeStore';
import RicebowlSyncModal from '../components/resume/RicebowlSyncModal';
import { useAutoSave, loadResumeById } from '../hooks/useAutoSave';
import ResumeChecklist from '../components/resume/ResumeChecklist';

// A4 dimensions
const A4_W_MM = 210;
const A4_H_MM = 297;
const SAFE_MARGIN_MM = 15;
const CONTENT_H_MM = A4_H_MM - SAFE_MARGIN_MM; // 282mm usable per page
const PAGE_GAP_PX = 24;

const MM_TO_PX = 96 / 25.4;
const A4_H_PX = Math.round(A4_H_MM * MM_TO_PX);       // ≈ 1122px full card
const CONTENT_H_PX = Math.round(CONTENT_H_MM * MM_TO_PX); // ≈ 1065px content area

// ── Smart page break computation ─────────────────────────────────────
// Finds y positions (in DOM pixels) where each new page should start.
// Ensures no text element is sliced by moving the break point above it.
function computeSmartBreaks(el: HTMLElement): number[] {
  const breaks: number[] = [];
  const totalH = el.scrollHeight;
  const elTop = el.getBoundingClientRect().top;

  // All elements that should never be split (headings, paragraphs, list items)
  const blocks = Array.from(
    el.querySelectorAll('h1, h2, h3, h4, h5, p, li')
  ).map(b => {
    const rect = (b as HTMLElement).getBoundingClientRect();
    return { top: rect.top - elTop, bottom: rect.bottom - elTop };
  }).filter(b => b.bottom - b.top > 2); // ignore zero-height elements

  let pageStart = 0;

  while (pageStart + CONTENT_H_PX < totalH) {
    const idealBreak = pageStart + CONTENT_H_PX;
    let smartBreak = idealBreak;

    // If any block straddles the ideal break, pull break up above that block
    for (const block of blocks) {
      if (block.top < idealBreak && block.bottom > idealBreak) {
        smartBreak = Math.max(pageStart + 20, block.top - 2);
        break;
      }
    }

    // Safety: never get stuck
    if (smartBreak <= pageStart) smartBreak = idealBreak;

    breaks.push(smartBreak);
    pageStart = smartBreak;
  }

  return breaks;
}

// ── Per-page canvas slicing for PDF ──────────────────────────────────
async function exportToPDF(
  el: HTMLElement,
  breaks: number[],
  totalH: number
) {
  const { default: html2canvas } = await import('html2canvas');
  const { default: jsPDF } = await import('jspdf');

  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
  });

  // Scale from DOM pixels to canvas pixels (canvas is at scale 2)
  const domToCanvas = canvas.height / totalH;

  const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

  const pageStarts = [0, ...breaks];

  for (let i = 0; i < pageStarts.length; i++) {
    if (i > 0) pdf.addPage();

    const startDom = pageStarts[i];
    const endDom = i < breaks.length ? breaks[i] : totalH;

    const startCanvas = Math.round(startDom * domToCanvas);
    const endCanvas = Math.min(Math.round(endDom * domToCanvas), canvas.height);
    const sliceH = endCanvas - startCanvas;

    // Draw just this slice into a temporary canvas
    const slice = document.createElement('canvas');
    slice.width = canvas.width;
    slice.height = sliceH;
    const ctx = slice.getContext('2d')!;
    ctx.drawImage(canvas, 0, startCanvas, canvas.width, sliceH, 0, 0, canvas.width, sliceH);

    const imgData = slice.toDataURL('image/png');
    // Height in mm: (sliceH / scale) / (canvas.width / scale) * A4_W_MM
    const sliceHmm = (sliceH / 2) / (canvas.width / 2) * A4_W_MM;

    pdf.addImage(imgData, 'PNG', 0, 0, A4_W_MM, sliceHmm);
  }

  return pdf;
}

// ─────────────────────────────────────────────────────────────────────
const BuilderView: React.FC = () => {
  const navigate = useNavigate();
  const template = useResumeStore(s => s.template);
  const experiences = useResumeStore(s => s.experiences);
  const latestJobTitle = experiences[0]?.title || '';

  const fullRef = useRef<HTMLDivElement>(null);
  const [pageBreaks, setPageBreaks] = useState<number[]>([]);
  const [exporting, setExporting] = useState(false);
  const [showRicebowlModal, setShowRicebowlModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle'|'saving'|'saved'|'error'>('idle');

  // ── Auto-save every 30s ──────────────────────────────────────────────
  const { saveNow } = useAutoSave(setSaveStatus, 30_000);

  // ── Load resume from URL ?id= on first mount ─────────────────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return;
    loadResumeById(id).then(data => {
      if (!data) return;
      const store = useResumeStore.getState();
      if (data.personalInfo) store.setPersonalInfo(data.personalInfo as Parameters<typeof store.setPersonalInfo>[0]);
      if (data.experiences) (data.experiences as Parameters<typeof store.addExperience>[0][]).forEach(e => store.updateExperience(e.id, e));
      if (data.template) store.setTemplate(data.template as Parameters<typeof store.setTemplate>[0]);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pageCount = pageBreaks.length + 1;

  // Recompute smart breaks whenever content changes
  const recompute = useCallback(() => {
    const el = fullRef.current;
    if (!el) return;
    const breaks = computeSmartBreaks(el);
    setPageBreaks(breaks);
  }, []);

  useEffect(() => {
    const el = fullRef.current;
    if (!el) return;
    const obs = new ResizeObserver(() => setTimeout(recompute, 80));
    obs.observe(el);
    recompute();
    return () => obs.disconnect();
  }, [template, recompute]);

  // Page start/end in DOM pixels
  const pageStart = (i: number) => (i === 0 ? 0 : pageBreaks[i - 1]);
  const pageEnd = (i: number) => (i < pageBreaks.length ? pageBreaks[i] : fullRef.current?.scrollHeight ?? CONTENT_H_PX);
  const pageContentH = (i: number) => Math.min(pageEnd(i) - pageStart(i), CONTENT_H_PX);

  const handleExportPDF = useCallback(async () => {
    // Just show the modal first
    setShowRicebowlModal(true);
  }, []);

  const handleModalProceed = async (prefs: { shareRicebowl: boolean; recommendationEmail: boolean }) => {
    const el = fullRef.current;
    if (!el || exporting) return;
    
    setExporting(true);
    try {
      const pdf = await exportToPDF(el, pageBreaks, el.scrollHeight);
      
      if (prefs.shareRicebowl) {
        // Prepare base64 encoded PDF
        const pdfBlob = pdf.output('blob');
        const buffer = await pdfBlob.arrayBuffer();
        // Browser compatible base64 conversion
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const pdfBase64 = window.btoa(binary);

        const storeState = useResumeStore.getState();
        const personalInfo = storeState.personalInfo;

        const payload = {
          name: personalInfo.name,
          email: personalInfo.email,
          phone: personalInfo.phone,
          shareWithRicebowl: prefs.shareRicebowl,
          recommendationEmail: prefs.recommendationEmail,
          pdfBase64,
          pdfName: `${personalInfo.name.replace(/\\s+/g, '_')}_Resume.pdf`
        };

        const res = await fetch('/api/sync-ricebowl', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          console.error('Failed to sync to Ricebowl');
        }
      }

      // Download it regardless of sync choice
      pdf.save('resume.pdf');
      setShowRicebowlModal(false);
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('PDF export failed. Please try again.');
      setShowRicebowlModal(false);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex w-full h-screen overflow-hidden" style={{ background: 'var(--bg-main)' }}>

      {/* ── Hidden full resume — measures height, source for PDF ── */}
      <div style={{ position: 'fixed', top: 0, left: '-9999px', width: `${A4_W_MM}mm`, background: 'white', zIndex: -1, pointerEvents: 'none' }}>
        {/* @ts-ignore */}
        <ResumePreview ref={fullRef} />
      </div>

      {/* ── Left Editor Panel ── */}
      <div className="flex flex-col"
        style={{ width: '400px', minWidth: '320px', background: 'white', borderRight: '1px solid var(--border-color)', height: '100%', overflowY: 'auto', flexShrink: 0 }}>
        <div className="glass-header" style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 0 }}>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', padding: '0.25rem' }}>
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-2" style={{ color: 'var(--primary-600)', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
              <FileText size={18} /> Resume Makers
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Save status indicator */}
            {saveStatus === 'saving' && (
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Loader2 size={12} className="animate-spin" /> Saving…
              </span>
            )}
            {saveStatus === 'saved' && (
              <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Check size={12} /> Saved
              </span>
            )}
            {saveStatus === 'error' && (
              <span style={{ fontSize: '0.75rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <CloudOff size={12} /> Save failed
              </span>
            )}
            <button onClick={() => { saveNow(); handleExportPDF(); }} disabled={exporting} className="btn btn-primary"
              style={{ padding: '0.55rem 1.1rem', fontSize: '0.875rem', gap: '0.5rem', opacity: exporting ? 0.7 : 1 }}>
              {exporting ? <><Loader2 size={14} className="animate-spin" /> Exporting…</> : <><Download size={15} /> Export PDF</>}
            </button>
          </div>
        </div>
        <div style={{ padding: '1.5rem', flex: 1 }}>
          <ResumeChecklist />
          <BuilderEditor />
        </div>
      </div>

      {/* ── Right Preview Panel ── */}
      <div className="flex-1 flex flex-col items-center overflow-y-auto"
        style={{ padding: '2rem 2rem 4rem', background: '#dde1ea' }}>

        {/* Header */}
        <div style={{ width: `${A4_W_MM}mm`, marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 500 }}>📄 Live Preview</span>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            A4 · 210 × 297 mm{pageCount > 1 ? ` · ${pageCount} pages` : ''}
          </span>
        </div>

        {/* Page cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: `${PAGE_GAP_PX}px`, flexShrink: 0 }}>
          {Array.from({ length: pageCount }).map((_, i) => {
            const contentH = pageContentH(i);

            return (
              <div key={i} style={{
                width: `${A4_W_MM}mm`,
                height: `${A4_H_PX}px`,
                background: 'white',
                boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
                borderRadius: '3px',
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
              }}>
                {/* Top margin strip — pages 2+ only */}
                {i > 0 && (
                  <div style={{
                    height: '24px',
                    borderBottom: '1px dashed rgba(239,68,68,0.28)',
                    background: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 12px',
                    flexShrink: 0,
                  }}>
                    <span style={{ fontSize: '0.6rem', color: 'rgba(239,68,68,0.4)', letterSpacing: '0.05em' }}>
                      CONTINUED FROM PAGE {i}
                    </span>
                  </div>
                )}

                {/* Content — clipped exactly at smart break */}
                <div style={{ height: `${contentH}px`, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                  <div style={{ position: 'absolute', top: `-${pageStart(i)}px`, left: 0, width: '100%' }}>
                    <ResumePreview />
                  </div>
                </div>

                {/* Safe zone buffer */}
                <div style={{
                  flex: 1,
                  borderTop: '1px dashed rgba(239,68,68,0.28)',
                  background: 'white',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 12px',
                }}>
                  {pageCount > 1
                    ? <span style={{ fontSize: '0.6rem', color: 'rgba(239,68,68,0.4)', letterSpacing: '0.05em' }}>SAFE ZONE — CONTENT ABOVE THIS LINE</span>
                    : <span />}
                  <span style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>
                    {pageCount > 1 ? `Page ${i + 1} of ${pageCount}` : 'A4'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Hidden container for modal portal fallback just in case or render direct */}
      {showRicebowlModal && (
        <RicebowlSyncModal 
          onClose={() => setShowRicebowlModal(false)}
          onProceed={handleModalProceed}
          isExporting={exporting}
          latestJobTitle={latestJobTitle}
        />
      )}
    </div>
  );
};

export default BuilderView;
