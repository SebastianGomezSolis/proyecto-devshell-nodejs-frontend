import React from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
  maxHeight?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, maxHeight }) => {
  return (
    <div style={{
      background: '#0a0a0a',
      border: '1px solid #2a2a2a',
      overflow: 'auto',
      maxHeight: maxHeight || '400px',
    }}>
      {language && (
        <div style={{
          fontSize: '9px', color: '#504f4a',
          padding: '6px 12px',
          borderBottom: '1px solid #2a2a2a',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}>
          {language}
        </div>
      )}
      <pre style={{
        padding: '14px',
        margin: 0,
        fontSize: '11px',
        lineHeight: 1.7,
        color: '#a0a09a',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all',
      }}>
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
