import React, { useState } from 'react';
import { api } from '../utils/api';
import SEO from '../components/SEO';

interface FieldErrors {
  nombre?: string;
  correo?: string;
  mensaje?: string;
}

const ContactPage: React.FC = () => {
  const [form, setForm] = useState({ nombre: '', correo: '', asunto: '', mensaje: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const validate = (): boolean => {
    const errors: FieldErrors = {};
    if (!form.nombre.trim()) errors.nombre = 'El nombre es requerido';
    else if (form.nombre.trim().length < 2) errors.nombre = 'Mínimo 2 caracteres';
    if (!form.correo.trim()) errors.correo = 'El correo es requerido';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) errors.correo = 'Correo inválido';
    if (!form.mensaje.trim()) errors.mensaje = 'El mensaje es requerido';
    else if (form.mensaje.trim().length < 10) errors.mensaje = 'Mínimo 10 caracteres';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name as keyof FieldErrors]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: undefined });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('sending');
    setErrorMsg('');
    try {
      await api.post<string>('/publico/contacto', form);
      setStatus('success');
      setForm({ nombre: '', correo: '', asunto: '', mensaje: '' });
      setFieldErrors({});
    } catch (err: unknown) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Error al enviar mensaje');
    }
  };

  return (
    <>
      <SEO title="Contacto" description="Formulario de contacto para consultas y colaboraciones" />
      <div>
      <div className="page-header">
        <div className="page-title">Contacto</div>
        <div className="page-sub">{'// Envíame un mensaje'}</div>
      </div>

      <div style={{ maxWidth: '500px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">nombre</label>
            <input type="text" name="nombre" value={form.nombre} onChange={handleChange} />
            {fieldErrors.nombre && <div className="form-error">{fieldErrors.nombre}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">correo</label>
            <input type="email" name="correo" value={form.correo} onChange={handleChange} />
            {fieldErrors.correo && <div className="form-error">{fieldErrors.correo}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">asunto</label>
            <input type="text" name="asunto" value={form.asunto} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">mensaje</label>
            <textarea name="mensaje" value={form.mensaje} onChange={handleChange} rows={5} />
            {fieldErrors.mensaje && <div className="form-error">{fieldErrors.mensaje}</div>}
          </div>

          {status === 'success' && (
            <div style={{ color: 'var(--ds-green)', fontSize: '11px', marginBottom: '10px' }}>
              ✓ Mensaje enviado correctamente
            </div>
          )}
          {status === 'error' && (
            <div className="form-error">{errorMsg}</div>
          )}

          <button type="submit" className="btn-primary" disabled={status === 'sending'}>
            {status === 'sending' ? 'enviando...' : 'enviar mensaje'}
          </button>
        </form>
      </div>
    </div>
    </>
  );
};

export default ContactPage;
