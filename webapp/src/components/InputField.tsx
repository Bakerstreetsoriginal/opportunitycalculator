import { useId } from 'react';
import styles from './InputField.module.css';

interface InputFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  type?: 'currency' | 'percentage' | 'years' | 'number';
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  prefix?: string;
  hint?: string;
}

export function InputField({
  label,
  value,
  onChange,
  type = 'number',
  min = 0,
  max,
  step = 1,
  suffix,
  prefix,
  hint,
}: InputFieldProps) {
  const id = useId();
  
  const getStepAndDisplay = () => {
    switch (type) {
      case 'currency':
        return { step: 1000, prefix: '€', displayValue: value };
      case 'percentage':
        return { step: 0.1, suffix: '%', displayValue: value * 100 };
      case 'years':
        return { step: 1, suffix: 'jaar', displayValue: value };
      default:
        return { step, suffix, prefix, displayValue: value };
    }
  };
  
  const config = getStepAndDisplay();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = parseFloat(e.target.value) || 0;
    if (type === 'percentage') {
      onChange(rawValue / 100);
    } else {
      onChange(rawValue);
    }
  };
  
  return (
    <div className={styles.container}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <div className={styles.inputWrapper}>
        {config.prefix && <span className={styles.prefix}>{config.prefix}</span>}
        <input
          id={id}
          type="number"
          value={config.displayValue}
          onChange={handleChange}
          min={type === 'percentage' ? (min ?? 0) * 100 : min}
          max={type === 'percentage' ? (max ?? 100) * 100 : max}
          step={config.step}
          className={styles.input}
        />
        {config.suffix && <span className={styles.suffix}>{config.suffix}</span>}
      </div>
      {hint && <p className={styles.hint}>{hint}</p>}
    </div>
  );
}

