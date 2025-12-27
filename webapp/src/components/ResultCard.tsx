import styles from './ResultCard.module.css';

interface ResultCardProps {
  label: string;
  value: string;
  subValue?: string;
  variant?: 'default' | 'positive' | 'negative' | 'highlight';
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
  isPositive: boolean;
  rate: string;
}

export function ScenarioCard({
  label,
  eindkapitaal,
  rendement,
  netto,
  isPositive,
  rate,
}: ScenarioCardProps) {
  return (
    <div className={`${styles.scenarioCard} ${isPositive ? styles.positive : styles.negative}`}>
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
          <span className={`${styles.scenarioItemValue} ${styles.nettoValue} ${isPositive ? styles.positiveText : styles.negativeText}`}>
            {netto}
          </span>
        </div>
      </div>
    </div>
  );
}

