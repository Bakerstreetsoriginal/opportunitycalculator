import { useState, useMemo } from 'react';
import { InputField } from './InputField';
import { ResultCard, ScenarioCard } from './ResultCard';
import {
  calculateOpportuniteitskost,
  formatCurrency,
  formatPercentage,
  type LoanInputs,
} from '../utils/calculations';
import styles from './Calculator.module.css';

export function OpportuniteitskostCalculator() {
  const [inputs, setInputs] = useState<LoanInputs>({
    kredietbedrag: 250000,
    intrest: 0.03,
    looptijd: 10,
    instapkosten: 0.01,
  });

  const results = useMemo(() => calculateOpportuniteitskost(inputs), [inputs]);

  const updateInput = <K extends keyof LoanInputs>(key: K, value: LoanInputs[K]) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className={styles.calculator}>
      <div className={styles.intro}>
        <p>
          Bereken hoeveel je zou kunnen verdienen door te beleggen in plaats van je spaargeld 
          direct te gebruiken voor een grote aankoop. Vergelijk een klassiek krediet met een 
          bulletkrediet.
        </p>
      </div>

      <section className={styles.inputSection}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>⚙️</span>
          Parameters
        </h2>
        <div className={styles.inputGrid}>
          <InputField
            label="Kredietbedrag"
            value={inputs.kredietbedrag}
            onChange={(v) => updateInput('kredietbedrag', v)}
            type="currency"
            min={10000}
            max={2000000}
            hint="Het bedrag dat je wil lenen"
          />
          <InputField
            label="Jaarlijkse rente"
            value={inputs.intrest}
            onChange={(v) => updateInput('intrest', v)}
            type="percentage"
            min={0.005}
            max={0.15}
            hint="De jaarlijkse kredietrente"
          />
          <InputField
            label="Looptijd"
            value={inputs.looptijd}
            onChange={(v) => updateInput('looptijd', v)}
            type="years"
            min={1}
            max={30}
            hint="Aantal jaren voor het krediet"
          />
          <InputField
            label="Instapkosten belegging"
            value={inputs.instapkosten}
            onChange={(v) => updateInput('instapkosten', v)}
            type="percentage"
            min={0}
            max={0.05}
            hint="Kosten bij aankoop belegging"
          />
        </div>
      </section>

      {/* Regular Loan Results */}
      <section className={styles.resultSection}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>📊</span>
          Scenario 1: Klassiek Krediet
        </h2>
        <p className={styles.sectionDescription}>
          Je neemt een klassiek krediet en belegt je spaargeld. Je betaalt maandelijks kapitaal + rente af.
        </p>

        <div className={styles.summaryGrid}>
          <ResultCard
            label="Maandelijkse aflossing"
            value={formatCurrency(results.regularLoan.maandelijkseAflossing)}
            icon="💳"
          />
          <ResultCard
            label="Totale rente over looptijd"
            value={formatCurrency(results.regularLoan.totaleIntresten)}
            variant="negative"
            icon="📉"
          />
          <ResultCard
            label="Startkapitaal belegd"
            value={formatCurrency(results.regularLoan.startkapitaal)}
            icon="💰"
          />
        </div>

        <h3 className={styles.subTitle}>Beleggingsscenario's</h3>
        <div className={styles.scenarioGrid}>
          {results.regularLoan.scenarios.map((scenario) => (
            <ScenarioCard
              key={scenario.label}
              label={scenario.label}
              rate={formatPercentage(scenario.returnRate)}
              eindkapitaal={formatCurrency(scenario.eindkapitaal)}
              rendement={formatCurrency(scenario.rendement)}
              netto={formatCurrency(scenario.netto)}
              isPositive={scenario.netto > 0}
            />
          ))}
        </div>
      </section>

      {/* Bullet Loan Results */}
      <section className={styles.resultSection}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>🎯</span>
          Scenario 2: Bulletkrediet
        </h2>
        <p className={styles.sectionDescription}>
          Je betaalt enkel rente, en lost het kapitaal pas aan het einde af. Het verschil in 
          maandelijkse kost beleg je ook!
        </p>

        <div className={styles.summaryGrid}>
          <ResultCard
            label="Maandelijkse aflossing (enkel rente)"
            value={formatCurrency(results.bulletLoan.maandelijkseAflossing)}
            icon="💳"
          />
          <ResultCard
            label="Maandelijks verschil"
            value={formatCurrency(results.bulletLoan.maandelijksVerschil)}
            variant="positive"
            icon="✨"
            subValue="Extra om te beleggen"
          />
          <ResultCard
            label="Totale rente over looptijd"
            value={formatCurrency(results.bulletLoan.totaleIntresten)}
            variant="negative"
            icon="📉"
          />
          <ResultCard
            label="Extra kapitaal over looptijd"
            value={formatCurrency(results.bulletLoan.totaalExtraKapitaal)}
            variant="highlight"
            icon="📈"
          />
        </div>

        <h3 className={styles.subTitle}>Beleggingsscenario's</h3>
        <div className={styles.scenarioGrid}>
          {results.bulletLoan.scenarios.map((scenario) => (
            <ScenarioCard
              key={scenario.label}
              label={scenario.label}
              rate={formatPercentage(scenario.returnRate)}
              eindkapitaal={formatCurrency(scenario.eindkapitaal)}
              rendement={formatCurrency(scenario.rendement)}
              netto={formatCurrency(scenario.netto)}
              isPositive={scenario.netto > 0}
            />
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className={styles.comparisonSection}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>⚖️</span>
          Vergelijking
        </h2>
        <div className={styles.comparisonTable}>
          <div className={styles.comparisonHeader}>
            <span>Scenario</span>
            <span>Klassiek Krediet</span>
            <span>Bulletkrediet</span>
            <span>Verschil</span>
          </div>
          {results.regularLoan.scenarios.map((regularScenario, i) => {
            const bulletScenario = results.bulletLoan.scenarios[i];
            const difference = bulletScenario.netto - regularScenario.netto;
            return (
              <div key={regularScenario.label} className={styles.comparisonRow}>
                <span className={styles.comparisonLabel}>{regularScenario.label}</span>
                <span className={regularScenario.netto >= 0 ? styles.positive : styles.negative}>
                  {formatCurrency(regularScenario.netto)}
                </span>
                <span className={bulletScenario.netto >= 0 ? styles.positive : styles.negative}>
                  {formatCurrency(bulletScenario.netto)}
                </span>
                <span className={`${styles.difference} ${difference >= 0 ? styles.positive : styles.negative}`}>
                  {difference >= 0 ? '+' : ''}{formatCurrency(difference)}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

