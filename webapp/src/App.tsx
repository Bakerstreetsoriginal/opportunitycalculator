import { useState } from 'react';
import { OpportuniteitskostCalculator } from './components/OpportuniteitskostCalculator';
import { FIRECalculator } from './components/FIRECalculator';
import styles from './App.module.css';

type Tab = 'opportuniteitskost' | 'fire';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('opportuniteitskost');

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            <span className={styles.titleIcon}>📊</span>
            <span className={styles.titleText}>Financiële Calculator</span>
          </h1>
          <p className={styles.subtitle}>
            Maak slimme financiële beslissingen met data
          </p>
        </div>
      </header>

      <nav className={styles.nav}>
        <div className={styles.tabList}>
          <button
            className={`${styles.tab} ${activeTab === 'opportuniteitskost' ? styles.active : ''}`}
            onClick={() => setActiveTab('opportuniteitskost')}
          >
            <span className={styles.tabIcon}>💰</span>
            <span className={styles.tabLabel}>Opportuniteitskost</span>
            <span className={styles.tabDescription}>Lenen vs. Beleggen</span>
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'fire' ? styles.active : ''}`}
            onClick={() => setActiveTab('fire')}
          >
            <span className={styles.tabIcon}>🔥</span>
            <span className={styles.tabLabel}>FIRE Calculator</span>
            <span className={styles.tabDescription}>Financiële Vrijheid</span>
          </button>
        </div>
      </nav>

      <main className={styles.main}>
        {activeTab === 'opportuniteitskost' ? (
          <OpportuniteitskostCalculator />
        ) : (
          <FIRECalculator />
        )}
      </main>

      <footer className={styles.footer}>
        <p>
          💡 <strong>Disclaimer:</strong> Deze tool is bedoeld voor educatieve doeleinden. 
          Raadpleeg altijd een financieel adviseur voor persoonlijk advies.
        </p>
      </footer>
    </div>
  );
}

export default App;
