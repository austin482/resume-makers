import React, { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Renders a job description as bullet points.
 * - Clicking on the block switches to a full textarea edit mode that looks invisible.
 * - Un-focusing saves the entire block and restores li tags.
 */
const DescriptionBullets: React.FC<{
  text: string;
  onChange?: (val: string) => void;
  style?: React.CSSProperties;
}> = ({ text, onChange, style }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempText, setTempText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Normalise text into an array of clean lines
  const getCleanLines = useCallback((raw: string) => {
    return (raw || '')
      .split('\n')
      .map(l => l.replace(/^[-•*·–—]\s*/, ''))
      .filter(Boolean);
  }, []);

  // Sync state cleanly
  useEffect(() => {
    if (!isEditing) {
      const lines = getCleanLines(text);
      if (lines.length > 1) {
        // give it bullets so the textarea looks natural immediately
        setTempText(lines.map(l => `• ${l}`).join('\n'));
      } else {
        setTempText(lines[0] || '');
      }
    }
  }, [text, isEditing, getCleanLines]);

  // Auto-resize the textarea while editing
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = '0px';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
      // Put cursor at the end
      textareaRef.current.focus();
    }
  }, [isEditing, tempText]);

  const handleSave = () => {
    setIsEditing(false);
    if (!onChange) return;
    
    // clean out the bullets before saving so we just have raw text
    const finalClean = getCleanLines(tempText).join('\n');
    onChange(finalClean);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
    // Auto-insert bullet on new line
    if (e.key === 'Enter') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const val = target.value;
      
      const newVal = val.substring(0, start) + '\n• ' + val.substring(end);
      setTempText(newVal);
      
      // Move cursor
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 3;
      }, 0);
    }
  };

  const lines = getCleanLines(text);

  if (isEditing) {
    return (
      <textarea
        ref={textareaRef}
        value={tempText}
        onChange={e => setTempText(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        style={{
          ...style,
          width: '100%',
          display: 'block',
          fontSize: '9.5pt',
          lineHeight: 1.55,
          padding: 0,
          margin: 0,
          background: 'transparent',
          border: 'none',
          outline: 'none',
          resize: 'none',
          overflow: 'hidden',
          fontFamily: 'inherit'
        }}
      />
    );
  }

  if (lines.length === 0) return null;

  return (
    <div 
      className="inline-edit"
      onClick={() => setIsEditing(true)} 
      style={{ cursor: 'text', padding: '0', margin: 0, ...style }}
    >
      {lines.length === 1 ? (
        <p style={{ margin: 0, fontSize: '9.5pt', lineHeight: 1.55 }}>
          {lines[0]}
        </p>
      ) : (
        <ul style={{ margin: 0, paddingLeft: '0', listStyle: 'none' }}>
          {lines.map((line, i) => (
            <li key={i} style={{ fontSize: '9.5pt', lineHeight: 1.55, display: 'flex', gap: '0.4em' }}>
              <span style={{ flexShrink: 0 }}>•</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DescriptionBullets;
