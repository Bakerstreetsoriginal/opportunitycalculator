import { useMemo } from 'react';
import { InputField } from './InputField';
import { ResultCard } from './ResultCard';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
  calculateFIRE,
  formatCurrency,
  formatPercentage,
  type FIREInputs,
} from '../utils/calculations';
import styles from './Calculator.module.css';

const DEFAULT_INPUTS: FIREInputs = {
  startkapitaal: 10000,
  jaarlijksRendement: 0.07,
  beleggingshorizon: 20,
  maandelijkseBijdrage: 500,
};

export function FIRECalculator() {
  const [inputs, setInputs] = useLocalStorage<FIREInputs>('fire-inputs', DEFAULT_INPUTS);

  const results = useMemo(() => calculateFIRE(inputs), [inputs]);

  const updateInput = <K extends keyof FIREInputs>(key: K, value: FIREInputs[K]) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  // Calculate the proportion of returns vs invested
  const returnRatio = results.behaaldRendement / results.eindkapitaal;
  const investedRatio = results.geinvesteerdKapitaal / results.eindkapitaal;

  return (
    <div className={styles.calculator}>
      <div className={styles.intro}>
        <p>
          Bereken wanneer je financieel onafhankelijk kunt worden. Ontdek hoeveel je 
          eindkapitaal zal zijn en welk maandelijks inkomen dit kan genereren.
        </p>
      </div>

      <section className={styles.inputSection}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>⚙️</span>
          Parameters
        </h2>
        <div className={styles.inputGrid}>
          <InputField
            label="Startkapitaal"
            value={inputs.startkapitaal}
            onChange={(v) => updateInput('startkapitaal', v)}
            type="currency"
            min={0}
            max={10000000}
            hint="Je huidige beleggingsportefeuille"
          />
          <InputField
            label="Jaarlijks verwacht rendement"
            value={inputs.jaarlijksRendement}
            onChange={(v) => updateInput('jaarlijksRendement', v)}
            type="percentage"
            min={0}
            max={0.20}
            hint="Historisch gemiddeld: 7% voor aandelen"
          />
          <InputField
            label="Beleggingshorizon"
            value={inputs.beleggingshorizon}
            onChange={(v) => updateInput('beleggingshorizon', v)}
            type="years"
            min={1}
            max={50}
            hint="Aantal jaren tot je met pensioen gaat"
          />
          <InputField
            label="Maandelijkse bijdrage"
            value={inputs.maandelijkseBijdrage}
            onChange={(v) => updateInput('maandelijkseBijdrage', v)}
            type="currency"
            min={0}
            max={50000}
            hint="Hoeveel je maandelijks bijlegt"
          />
        </div>
      </section>

      <section className={styles.resultSection}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>🎯</span>
          Je Eindkapitaal
        </h2>

        <div className={styles.heroResult}>
          <div className={styles.heroValue}>{formatCurrency(results.eindkapitaal)}</div>
          <div className={styles.heroLabel}>
            na {inputs.beleggingshorizon} jaar beleggen
          </div>
        </div>

        {/* Visual breakdown */}
        <div className={styles.breakdownBar}>
          <div 
            className={styles.investedPortion}
            style={{ width: `${investedRatio * 100}%` }}
          >
            <span className={styles.portionLabel}>Geïnvesteerd</span>
          </div>
          <div 
            className={styles.returnPortion}
            style={{ width: `${returnRatio * 100}%` }}
          >
            <span className={styles.portionLabel}>Rendement</span>
          </div>
        </div>
        <div className={styles.breakdownLegend}>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: 'var(--accent-blue)' }} />
            <span>Geïnvesteerd: {formatCurrency(results.geinvesteerdKapitaal)}</span>
            <span className={styles.legendPercent}>({formatPercentage(investedRatio)})</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: 'var(--accent-emerald)' }} />
            <span>Rendement: {formatCurrency(results.behaaldRendement)}</span>
            <span className={styles.legendPercent}>({formatPercentage(returnRatio)})</span>
          </div>
        </div>
      </section>

      <section className={styles.resultSection}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>🏖️</span>
          Financiële Onafhankelijkheid
        </h2>
        <p className={styles.sectionDescription}>
          Met de 3% withdrawal rule kan je jaarlijks 3% van je kapitaal opnemen zonder dat 
          je vermogen op lange termijn daalt. Je beleggingen compenseren de opnames.
        </p>

        <div className={styles.fireResultGrid}>
          <div className={styles.fireCard}>
            <div className={styles.fireCardHeader}>
              <span className={styles.fireCardIcon}>💸</span>
              <span className={styles.fireCardLabel}>Maandelijks inkomen</span>
            </div>
            <div className={styles.fireCardValue}>
              {formatCurrency(results.maandelijksInkomen)}
            </div>
            <div className={styles.fireCardSubtext}>
              per maand (nominaal)
            </div>
          </div>

          <div className={`${styles.fireCard} ${styles.fireCardHighlight}`}>
            <div className={styles.fireCardHeader}>
              <span className={styles.fireCardIcon}>📊</span>
              <span className={styles.fireCardLabel}>Reële koopkracht</span>
            </div>
            <div className={styles.fireCardValue}>
              {formatCurrency(results.maandelijksInkomenInflatie)}
            </div>
            <div className={styles.fireCardSubtext}>
              per maand (in euro's van vandaag)
            </div>
          </div>
        </div>

        <div className={styles.infoBox}>
          <div className={styles.infoIcon}>💡</div>
          <div className={styles.infoContent}>
            <strong>Wat betekent dit?</strong>
            <p>
              Het nominale bedrag is wat je effectief ontvangt over {inputs.beleggingshorizon} jaar. 
              Maar door inflatie (gemiddeld 2% per jaar) heeft dat geld minder koopkracht. 
              Het reële bedrag toont wat je inkomen vandaag waard zou zijn.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.resultSection}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>📈</span>
          Overzicht
        </h2>

        <div className={styles.summaryGrid}>
          <ResultCard
            label="Totaal geïnvesteerd"
            value={formatCurrency(results.geinvesteerdKapitaal)}
            icon="💰"
            subValue={`${formatCurrency(inputs.startkapitaal)} start + ${formatCurrency(inputs.maandelijkseBijdrage * 12 * inputs.beleggingshorizon)} bijdragen`}
          />
          <ResultCard
            label="Behaald rendement"
            value={formatCurrency(results.behaaldRendement)}
            variant="positive"
            icon="📈"
            subValue={`${formatPercentage(returnRatio)} van eindkapitaal`}
          />
          <ResultCard
            label="Jaarlijks opneembaar"
            value={formatCurrency(results.eindkapitaal * 0.03)}
            variant="highlight"
            icon="✨"
            subValue="@ 3% withdrawal rate"
          />
        </div>
      </section>
    </div>
  );
}
