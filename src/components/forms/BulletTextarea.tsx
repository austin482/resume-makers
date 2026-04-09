import React, { useRef, useCallback } from 'react';
import { Sparkles, Loader2, List, X } from 'lucide-react';

const BULLET = '• ';

interface Props {
  value: string;
  onChange: (val: string) => void;
  rows?: number;
  placeholder?: string;
  // AI Optimize
  onOptimize?: () => void;
  isOptimizing?: boolean;
  canOptimize?: boolean;
}

const BulletTextarea: React.FC<Props> = ({
  value,
  onChange,
  rows = 5,
  placeholder = 'Describe your achievements and impact…',
  onOptimize,
  isOptimizing = false,
  canOptimize = false,
}) => {
  const ref = useRef<HTMLTextAreaElement>(null);

  // ── Add bullet to current line ──────────────────────────────────
  const addBulletToLine = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const lines = value.split('\n');
    let charCount = 0;
    let lineIdx = 0;
    for (let i = 0; i < lines.length; i++) {
      if (charCount + lines[i].length >= start) { lineIdx = i; break; }
      charCount += lines[i].length + 1;
    }
    if (!lines[lineIdx].startsWith(BULLET)) {
      lines[lineIdx] = BULLET + lines[lineIdx];
      onChange(lines.join('\n'));
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + BULLET.length;
        el.focus();
      });
    }
  }, [value, onChange]);

  // ── Clear all bullets ───────────────────────────────────────────
  const clearBullets = useCallback(() => {
    onChange(value.split('\n').map(l => l.startsWith(BULLET) ? l.slice(BULLET.length) : l).join('\n'));
    ref.current?.focus();
  }, [value, onChange]);

  // ── Auto-bullet on Enter ────────────────────────────────────────
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const el = ref.current;
    if (!el) return;

    if (e.key === 'Enter') {
      e.preventDefault();
      const start = el.selectionStart;
      const before = value.slice(0, start);
      const after = value.slice(el.selectionEnd);
      const currentLine = before.split('\n').at(-1) ?? '';

      let insert: string;
      if (currentLine === BULLET.trimEnd() || currentLine === BULLET) {
        // Empty bullet line → remove bullet and just newline
        const newBefore = before.slice(0, before.length - currentLine.length);
        const newVal = newBefore + '\n' + after;
        onChange(newVal);
        requestAnimationFrame(() => {
          el.selectionStart = el.selectionEnd = newBefore.length + 1;
        });
        return;
      } else if (currentLine.startsWith(BULLET)) {
        insert = '\n' + BULLET;
      } else {
        insert = '\n';
      }

      const newVal = before + insert + after;
      onChange(newVal);
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + insert.length;
      });
    }

    // Backspace on empty bullet prefix → remove bullet
    if (e.key === 'Backspace') {
      const start = el.selectionStart;
      const before = value.slice(0, start);
      const currentLine = before.split('\n').at(-1) ?? '';
      if (currentLine === BULLET.trimEnd()) {
        e.preventDefault();
        const newBefore = before.slice(0, before.length - currentLine.length);
        onChange(newBefore + value.slice(start));
        requestAnimationFrame(() => {
          el.selectionStart = el.selectionEnd = newBefore.length;
        });
      }
    }
  }, [value, onChange]);

  const hasBullets = value.split('\n').some(l => l.startsWith(BULLET));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {/* ── Toolbar ─────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.375rem',
        padding: '0.4rem 0.6rem',
        background: '#f8f8fc',
        border: '1.5px solid var(--border-color)',
        borderBottom: 'none',
        borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
        flexWrap: 'wrap',
      }}>
        {/* Add Bullet */}
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); addBulletToLine(); }}
          title="Add bullet to current line"
          style={{
            display: 'flex', alignItems: 'center', gap: '0.25rem',
            padding: '0.2rem 0.55rem', borderRadius: '6px',
            border: '1px solid #e0e0f0', background: 'white',
            fontSize: '0.75rem', fontWeight: 600, color: '#4f46e5',
            cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#eef2ff')}
          onMouseLeave={e => (e.currentTarget.style.background = 'white')}
        >
          <List size={12} />
          Add Bullet
        </button>

        {/* Clear Bullets */}
        {hasBullets && (
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); clearBullets(); }}
            title="Remove all bullets"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.25rem',
              padding: '0.2rem 0.55rem', borderRadius: '6px',
              border: '1px solid #e0e0e0', background: 'white',
              fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af',
              cursor: 'pointer', transition: 'all 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
            onMouseLeave={e => (e.currentTarget.style.background = 'white')}
          >
            <X size={11} />
            Clear Bullets
          </button>
        )}

        {/* AI Optimize */}
        {onOptimize && (
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); onOptimize(); }}
            disabled={isOptimizing || !canOptimize}
            title="Optimize with AI"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.25rem',
              padding: '0.2rem 0.6rem', borderRadius: '6px',
              border: '1px solid rgba(139,92,246,0.3)',
              background: isOptimizing || !canOptimize ? '#f5f3ff' : 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.12))',
              fontSize: '0.75rem', fontWeight: 600,
              color: isOptimizing || !canOptimize ? '#c4b5fd' : '#7c3aed',
              cursor: isOptimizing || !canOptimize ? 'not-allowed' : 'pointer',
              opacity: isOptimizing || !canOptimize ? 0.7 : 1,
              transition: 'all 0.15s',
              marginLeft: 'auto',
            }}
            onMouseEnter={e => { if (canOptimize && !isOptimizing) e.currentTarget.style.background = 'rgba(139,92,246,0.15)'; }}
            onMouseLeave={e => { if (canOptimize && !isOptimizing) e.currentTarget.style.background = 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.12))'; }}
          >
            {isOptimizing
              ? <><Loader2 size={12} className="animate-spin" /> Optimizing…</>
              : <><Sparkles size={12} /> AI Optimize</>
            }
          </button>
        )}
      </div>

      {/* ── Textarea ─────────────────────────────────────────── */}
      <textarea
        ref={ref}
        className="form-input"
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{
          resize: 'vertical',
          borderRadius: '0 0 var(--radius-sm) var(--radius-sm)',
          borderTop: 'none',
          fontFamily: 'inherit',
          lineHeight: 1.65,
        }}
      />

      {/* ── Hint ─────────────────────────────────────────────── */}
      <p style={{ fontSize: '0.7rem', color: '#aaa', margin: '0.25rem 0 0', paddingLeft: '2px' }}>
        Press Enter to auto-add a new bullet · Click <strong>Add Bullet</strong> to bullet an existing line
      </p>
    </div>
  );
};

export default BulletTextarea;
