import React from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'date' | 'range';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  error?: string;
  touched?: boolean;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  min?: number;
  max?: number;
  options?: { value: string; label: string }[];
  children?: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({
  label, name, type = 'text', value, onChange, onBlur,
  error, touched, placeholder, required, disabled, rows,
  min, max, options, children,
}) => {
  const showError = touched && error;

  return (
    <div className="form-group">
      <label className="form-label" htmlFor={name}>
        {label}
        {required && <span style={{ color: '#ef4444', marginLeft: '2px' }}>*</span>}
      </label>

      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={rows || 3}
        />
      ) : type === 'select' ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          disabled={disabled}
        >
          {options?.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : type === 'range' ? (
        <div>
          <input
            type="range"
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            min={min ?? 0}
            max={max ?? 100}
            disabled={disabled}
            style={{ accentColor: '#f59e0b' }}
          />
          <div style={{ textAlign: 'right', fontSize: '10px', color: '#504f4a' }}>{value}</div>
        </div>
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          min={type === 'number' ? min : undefined}
          max={type === 'number' ? max : undefined}
        />
      )}

      {children}

      {showError && <div className="form-error">{error}</div>}
    </div>
  );
};

export default FormField;
