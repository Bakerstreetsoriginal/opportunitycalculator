import styles from './ResultCard.module.css';

interface ResultCardProps {
  label: string;
  value: string;
  subValue?: string;
  variant?: 'default' | 'positive' | 'negative' | 'neutral' | 'highlight';
  size?: 'normal' | 'large';
  icon?: string;
}

export function ResultCard({
  label,
  value,
  subValue,
  variant = 'default',
  size = 'normal',
  icon,
}: ResultCardProps) {
  return (
    <div className={`${styles.card} ${styles[variant]} ${styles[size]}`}>
      <div className={styles.header}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <span className={styles.label}>{label}</span>
      </div>
      <div className={styles.value}>{value}</div>
      {subValue && <div className={styles.subValue}>{subValue}</div>}
    </div>
  );
}

interface ScenarioCardProps {
  label: string;
  eindkapitaal: string;
  rendement: string;
  netto: string;
  scenarioType: 'pessimistic' | 'neutral' | 'optimistic';
  rate: string;
}

export function ScenarioCard({
  label,
  eindkapitaal,
  rendement,
  netto,
  scenarioType,
  rate,
}: ScenarioCardProps) {
  const getScenarioClass = () => {
    switch (scenarioType) {
      case 'pessimistic':
        return styles.pessimistic;
      case 'neutral':
        return styles.neutralScenario;
      case 'optimistic':
        return styles.optimistic;
      default:
        return '';
    }
  };

  const getNettoClass = () => {
    // Parse the netto value to determine if positive or negative
    const numericNetto = parseFloat(netto.replace(/[^0-9,-]/g, '').replace(',', '.'));
    if (numericNetto > 0) return styles.positiveText;
    if (numericNetto < 0) return styles.negativeText;
    return '';
  };

  return (
    <div className={`${styles.scenarioCard} ${getScenarioClass()}`}>
      <div className={styles.scenarioHeader}>
        <span className={styles.scenarioLabel}>{label}</span>
        <span className={styles.scenarioRate}>{rate}</span>
      </div>
      <div className={styles.scenarioGrid}>
        <div className={styles.scenarioItem}>
          <span className={styles.scenarioItemLabel}>Eindkapitaal</span>
          <span className={styles.scenarioItemValue}>{eindkapitaal}</span>
        </div>
        <div className={styles.scenarioItem}>
          <span className={styles.scenarioItemLabel}>Rendement</span>
          <span className={styles.scenarioItemValue}>{rendement}</span>
        </div>
        <div className={`${styles.scenarioItem} ${styles.nettoItem}`}>
          <span className={styles.scenarioItemLabel}>Netto resultaat</span>
          <span className={`${styles.scenarioItemValue} ${styles.nettoValue} ${getNettoClass()}`}>
            {netto}
          </span>
        </div>
      </div>
    </div>
  );
}
