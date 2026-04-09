import React, { useRef, useEffect } from 'react';

interface InlineEditProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  tagName?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  multiline?: boolean;
}

const InlineEdit: React.FC<InlineEditProps> = ({
  value,
  onChange,
  placeholder = '',
  tagName: Tag = 'span',
  className = '',
  style,
  multiline = false,
}) => {
  const elRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Only update innerText if it differs from the current text to prevent cursor jumps
    if (elRef.current && elRef.current.innerText !== value) {
      elRef.current.innerText = value || '';
    }
  }, [value]);

  const handleBlur = () => {
    if (elRef.current) {
      const newValue = elRef.current.innerText.trim();
      if (newValue !== value) {
        onChange(newValue);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      elRef.current?.blur();
    }
  };

  return (
    <Tag
      ref={elRef}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`inline-edit ${className}`}
      data-placeholder={placeholder}
      style={{
        outline: 'none',
        minWidth: '1px',
        cursor: 'text',
        ...style,
      }}
    />
  );
};

export default InlineEdit;
