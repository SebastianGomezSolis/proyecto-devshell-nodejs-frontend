import React, { useState, useRef, useEffect, useCallback } from 'react';
import { api } from '../utils/api';
import GlobalBanner from '../components/GlobalBanner';

interface Line {
  type: 'cmd' | 'out' | 'ok' | 'error';
  text: string;
}

const simeCommands = ['whoami', 'ls projects', 'ls blog', 'skills', 'contact', 'help', 'clear'];

const TerminalPage: React.FC = () => {
  const [lines, setLines] = useState<Line[]>([
    { type: 'out', text: '╔══════════════════════════════════════╗' },
    { type: 'out', text: '║     DevShell Terminal v1.0.0         ║' },
    { type: 'out', text: '║  Type "help" for available commands  ║' },
    { type: 'out', text: '╚══════════════════════════════════════╝' },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const handleCommand = useCallback(async (cmd: string) => {
    const trimmed = cmd.trim();
    setLines(prev => [...prev, { type: 'cmd', text: `~/devshell $ ${trimmed}` }]);
    setHistory(prev => [trimmed, ...prev]);
    setHistoryIndex(-1);

    if (trimmed.toLowerCase() === 'clear') {
      setLines([]);
      return;
    }

    if (trimmed.toLowerCase() === 'help') {
      setLines(prev => [...prev,
        { type: 'out', text: '' },
        { type: 'ok', text: '  Comandos disponibles:' },
        { type: 'out', text: '  ┌──────────────────────────────────────┐' },
        { type: 'out', text: '  │ whoami      – info del desarrollador │' },
        { type: 'out', text: '  │ ls projects – proyectos activos      │' },
        { type: 'out', text: '  │ ls blog     – últimos posts          │' },
        { type: 'out', text: '  │ skills      – habilidades técnicas   │' },
        { type: 'out', text: '  │ contact     – info de contacto       │' },
        { type: 'out', text: '  │ help        – esta ayuda             │' },
        { type: 'out', text: '  │ clear       – limpiar terminal       │' },
        { type: 'out', text: '  └──────────────────────────────────────┘' },
        { type: 'out', text: '' },
      ]);
      return;
    }

    try {
      const res = await api.post<{ output: string }>('/publico/terminal', { comando: trimmed });
      const outputLines = res.output.split('\n');
      outputLines.forEach((line: string) => {
        let type: 'out' | 'ok' | 'error' = 'out';
        if (line.includes('not found')) type = 'error';
        else if (line.includes('Found') || line.includes('Email') || line.includes('→')) type = 'ok';
        setLines(prev => [...prev, { type, text: line }]);
      });
    } catch {
      setLines(prev => [...prev, { type: 'error', text: 'Error: no se pudo conectar con el servidor' }]);
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      handleCommand(input.trim());
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = Math.min(historyIndex + 1, history.length - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const partial = input.toLowerCase();
      const matches = simeCommands.filter(c => c.startsWith(partial));
      if (matches.length > 0) {
        setInput(matches[suggestionIndex % matches.length]);
        setSuggestionIndex(prev => prev + 1);
      }
    }
  };

  return (
    <div className="page-enter">
      <GlobalBanner />

      <div className="card" style={{ marginBottom: '16px' }}>
        <div className="card-title">{'// Controles'}</div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['whoami', 'ls projects', 'skills', 'help', 'clear'].map(cmd => (
            <button
              key={cmd}
              className="btn-secondary"
              onClick={() => { handleCommand(cmd); }}
              style={{ fontSize: '9px', padding: '3px 8px' }}
            >
              {cmd}
            </button>
          ))}
        </div>
        <div style={{ fontSize: '9px', color: 'var(--ds-comment)', marginTop: '8px' }}>
          ↑/↓ historial · Tab autocompletar · "help" para todos los comandos
        </div>
      </div>

      <div
        className="terminal-box"
        ref={terminalRef}
        style={{ maxHeight: '520px', overflowY: 'auto', cursor: 'text', fontSize: '12px' }}
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((line, i) => (
          <div key={i} className={`terminal-line ${line.type}`} style={{ whiteSpace: 'pre-wrap' }}>
            {line.text}
          </div>
        ))}
        <div className="terminal-input-line">
          <span className="terminal-line cmd" style={{ margin: 0, whiteSpace: 'nowrap' }}>~/devshell $</span>
          <input
            ref={inputRef}
            className="terminal-input"
            type="text"
            value={input}
            onChange={(e) => { setInput(e.target.value); setSuggestionIndex(0); }}
            onKeyDown={handleKeyDown}
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
};

export default TerminalPage;
