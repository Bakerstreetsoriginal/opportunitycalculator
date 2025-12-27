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
  
  const getConfig = () => {
    switch (type) {
      case 'currency':
        return { 
          step: 1000, 
          prefix: '€', 
          displayValue: value,
          inputMin: min,
          inputMax: max,
        };
      case 'percentage':
        // Display as percentage (e.g., 3.5 for 3.5%)
        // Store as decimal (e.g., 0.035)
        return { 
          step: 0.1, 
          suffix: '%', 
          displayValue: Math.round(value * 10000) / 100, // Convert to display percentage
          inputMin: min !== undefined ? min * 100 : undefined,
          inputMax: max !== undefined ? max * 100 : undefined,
        };
      case 'years':
        return { 
          step: 1, 
          suffix: 'jaar', 
          displayValue: value,
          inputMin: min,
          inputMax: max,
        };
      default:
        return { 
          step, 
          suffix, 
          prefix, 
          displayValue: value,
          inputMin: min,
          inputMax: max,
        };
    }
  };
  
  const config = getConfig();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    
    // Allow empty input
    if (rawValue === '' || rawValue === '-') {
      return;
    }
    
    const numValue = parseFloat(rawValue);
    if (isNaN(numValue)) return;
    
    if (type === 'percentage') {
      // Convert from display percentage to decimal
      onChange(numValue / 100);
    } else {
      onChange(numValue);
    }
  };
  
  const handleBlur = () => {
    // Ensure value is within bounds on blur
    let finalValue = value;
    if (min !== undefined && value < min) finalValue = min;
    if (max !== undefined && value > max) finalValue = max;
    if (finalValue !== value) {
      onChange(finalValue);
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
          onBlur={handleBlur}
          min={config.inputMin}
          max={config.inputMax}
          step={config.step}
          className={styles.input}
        />
        {config.suffix && <span className={styles.suffix}>{config.suffix}</span>}
      </div>
      {hint && <p className={styles.hint}>{hint}</p>}
    </div>
  );
}
