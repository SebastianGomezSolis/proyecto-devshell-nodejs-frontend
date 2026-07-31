import { useState, useCallback, ChangeEvent } from 'react';

interface UseFormProps<T> {
  initial: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit: (values: T) => Promise<void> | void;
}

interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isDirty: boolean;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleBlur: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  setFieldValue: (field: keyof T, value: unknown) => void;
  setFieldError: (field: keyof T, error: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
  setValues: (values: T) => void;
}

export function useForm<T extends Record<string, unknown>>({
  initial,
  validate,
  onSubmit,
}: UseFormProps<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>({ ...initial });
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const runValidation = useCallback((vals: T): Partial<Record<keyof T, string>> => {
    if (!validate) return {};
    const errs = validate(vals);
    setErrors(errs);
    return errs;
  }, [validate]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const typedName = name as keyof T;
    let parsedValue: unknown = value;
    if (type === 'number') parsedValue = value === '' ? '' : Number(value);
    else if (type === 'checkbox') parsedValue = (e.target as HTMLInputElement).checked;

    setValues(prev => {
      const next = { ...prev, [typedName]: parsedValue };
      setIsDirty(true);
      return next;
    });
  }, []);

  const handleBlur = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const field = e.target.name as keyof T;
    setTouched(prev => ({ ...prev, [field]: true }));
    runValidation(values);
  }, [runValidation, values]);

  const setFieldValue = useCallback((field: keyof T, value: unknown) => {
    setValues(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  }, []);

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = runValidation(values);
    const allTouched = Object.keys(values).reduce((acc, key) => ({ ...acc, [key as keyof T]: true }), {} as Partial<Record<keyof T, boolean>>);
    setTouched(allTouched);

    if (Object.keys(errs).length > 0) return;
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch {
      // let caller handle
    } finally {
      setIsSubmitting(false);
    }
  }, [runValidation, values, onSubmit]);

  const resetForm = useCallback(() => {
    setValues({ ...initial });
    setErrors({});
    setTouched({});
    setIsDirty(false);
    setIsSubmitting(false);
  }, [initial]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isDirty,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldError,
    handleSubmit,
    resetForm,
    setValues,
  };
}
