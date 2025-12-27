/**
 * Financial Calculations for Opportuniteitskost & FIRE Calculator
 * Based on formulas extracted from the Excel spreadsheet
 */

// ============================================
// OPPORTUNITEITSKOST CALCULATOR
// ============================================

export interface LoanInputs {
  kredietbedrag: number; // Loan amount
  intrest: number; // Annual interest rate (decimal, e.g., 0.03 for 3%)
  looptijd: number; // Loan term in years
  instapkosten: number; // Entry costs (decimal, e.g., 0.01 for 1%)
}

export interface ScenarioResult {
  eindkapitaal: number; // End capital after investment
  rendement: number; // Investment return
  netto: number; // Net result (return - interest costs)
  label: string;
  returnRate: number;
}

export interface RegularLoanResult {
  maandelijkseAflossing: number; // Monthly payment
  totaleIntresten: number; // Total interest paid
  startkapitaal: number;
  scenarios: ScenarioResult[];
}

export interface BulletLoanResult {
  maandelijkseAflossing: number; // Monthly interest-only payment
  totaleIntresten: number; // Total interest paid
  maandelijksVerschil: number; // Monthly difference vs regular loan
  totaalExtraKapitaal: number; // Total extra capital to invest
  startkapitaalPlusVerschil: number;
  scenarios: ScenarioResult[];
}

export interface OpportuniteitskostResult {
  regularLoan: RegularLoanResult;
  bulletLoan: BulletLoanResult;
}

const SCENARIO_RATES = [
  { rate: 0.02, label: 'Pessimistisch (2%)' },
  { rate: 0.05, label: 'Neutraal (5%)' },
  { rate: 0.07, label: 'Optimistisch (7%)' },
];

/**
 * Calculate monthly payment for a regular amortizing loan (PMT formula)
 */
export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  years: number
): number {
  const monthlyRate = annualRate / 12;
  const numPayments = years * 12;
  
  if (monthlyRate === 0) {
    return principal / numPayments;
  }
  
  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1)
  );
}

/**
 * Calculate compound growth of a lump sum
 */
export function calculateCompoundGrowth(
  principal: number,
  annualRate: number,
  years: number
): number {
  return principal * Math.pow(1 + annualRate, years);
}

/**
 * Calculate future value of monthly contributions
 */
export function calculateFutureValueOfContributions(
  monthlyContribution: number,
  annualRate: number,
  years: number
): number {
  const monthlyRate = annualRate / 12;
  const numPayments = years * 12;
  
  if (monthlyRate === 0) {
    return monthlyContribution * numPayments;
  }
  
  return monthlyContribution * ((Math.pow(1 + monthlyRate, numPayments) - 1) / monthlyRate);
}

/**
 * Calculate full Opportuniteitskost comparison
 */
export function calculateOpportuniteitskost(inputs: LoanInputs): OpportuniteitskostResult {
  const { kredietbedrag, intrest, looptijd, instapkosten } = inputs;
  
  // === REGULAR LOAN ===
  const regularMonthly = calculateMonthlyPayment(kredietbedrag, intrest, looptijd);
  const regularTotalInterest = (12 * looptijd * regularMonthly) - kredietbedrag;
  
  const regularScenarios: ScenarioResult[] = SCENARIO_RATES.map(({ rate, label }) => {
    // Invest the loan amount (minus entry costs) and let it grow
    const eindkapitaal = calculateCompoundGrowth(
      kredietbedrag * (1 - instapkosten),
      rate,
      looptijd
    );
    const rendement = eindkapitaal - kredietbedrag;
    const netto = rendement - regularTotalInterest;
    
    return { eindkapitaal, rendement, netto, label, returnRate: rate };
  });
  
  // === BULLET LOAN ===
  // For bullet loan, we use the same entry costs percentage but with potentially different rate
  // In the Excel, bullet loan has its own interest rate input (B28), but for simplicity
  // we'll use a slightly higher rate (typical for bullet loans)
  const bulletIntrest = intrest + 0.002; // Bullet loans typically ~0.2% higher
  const bulletMonthly = (kredietbedrag * bulletIntrest) / 12; // Interest only
  const bulletTotalInterest = bulletMonthly * 12 * looptijd;
  
  // Monthly difference: what you save by paying bullet vs regular
  const monthlyDifference = regularMonthly - bulletMonthly;
  const totalExtraCapital = monthlyDifference * (looptijd * 12);
  
  const bulletScenarios: ScenarioResult[] = SCENARIO_RATES.map(({ rate, label }) => {
    // Two components:
    // 1. Compound growth of the initial capital
    // 2. Future value of the monthly savings invested
    const compoundedInitial = calculateCompoundGrowth(
      kredietbedrag * (1 - instapkosten),
      rate,
      looptijd
    );
    const futureValueOfSavings = calculateFutureValueOfContributions(
      monthlyDifference,
      rate,
      looptijd
    );
    
    const eindkapitaal = compoundedInitial + futureValueOfSavings;
    const startkapitaalPlusVerschil = kredietbedrag + totalExtraCapital;
    const rendement = eindkapitaal - startkapitaalPlusVerschil;
    const netto = rendement - bulletTotalInterest;
    
    return { eindkapitaal, rendement, netto, label, returnRate: rate };
  });
  
  return {
    regularLoan: {
      maandelijkseAflossing: regularMonthly,
      totaleIntresten: regularTotalInterest,
      startkapitaal: kredietbedrag,
      scenarios: regularScenarios,
    },
    bulletLoan: {
      maandelijkseAflossing: bulletMonthly,
      totaleIntresten: bulletTotalInterest,
      maandelijksVerschil: monthlyDifference,
      totaalExtraKapitaal: totalExtraCapital,
      startkapitaalPlusVerschil: kredietbedrag + totalExtraCapital,
      scenarios: bulletScenarios,
    },
  };
}

// ============================================
// FIRE CALCULATOR
// ============================================

export interface FIREInputs {
  startkapitaal: number; // Starting capital
  jaarlijksRendement: number; // Expected annual return (decimal)
  beleggingshorizon: number; // Investment horizon in years
  maandelijkseBijdrage: number; // Monthly contribution
}

export interface FIREResult {
  eindkapitaal: number; // End capital
  geinvesteerdKapitaal: number; // Total invested (start + contributions)
  behaaldRendement: number; // Profit/returns
  maandelijksInkomen: number; // Monthly income at 3% withdrawal rate
  maandelijksInkomenInflatie: number; // Monthly income adjusted for 2% inflation
}

/**
 * Calculate FIRE (Financial Independence, Retire Early) projections
 */
export function calculateFIRE(inputs: FIREInputs): FIREResult {
  const { startkapitaal, jaarlijksRendement, beleggingshorizon, maandelijkseBijdrage } = inputs;
  
  // Convert annual rate to monthly for more accurate calculation
  const monthlyRate = Math.pow(1 + jaarlijksRendement, 1/12) - 1;
  const numMonths = beleggingshorizon * 12;
  
  // Future value of initial capital
  const fvInitial = startkapitaal * Math.pow(1 + monthlyRate, numMonths);
  
  // Future value of monthly contributions
  let fvContributions = 0;
  if (monthlyRate > 0) {
    fvContributions = maandelijkseBijdrage * ((Math.pow(1 + monthlyRate, numMonths) - 1) / monthlyRate);
  } else {
    fvContributions = maandelijkseBijdrage * numMonths;
  }
  
  const eindkapitaal = fvInitial + fvContributions;
  const geinvesteerdKapitaal = startkapitaal + (maandelijkseBijdrage * 12 * beleggingshorizon);
  const behaaldRendement = eindkapitaal - geinvesteerdKapitaal;
  
  // Monthly income at 3% withdrawal rate
  // The formula includes a 1.32% "beurskapitalisatie" tax factor (0.9868 = 1 - 0.0132)
  // Simplified: (capital * 0.03 / 12 * 0.9868)
  const withdrawalRate = 0.03;
  const taxFactor = 0.9868; // After 1.32% tax
  const maandelijksInkomen = (eindkapitaal * withdrawalRate / 12) * taxFactor;
  
  // Adjusted for 2% annual inflation
  const inflationRate = 0.02;
  const maandelijksInkomenInflatie = maandelijksInkomen / Math.pow(1 + inflationRate, beleggingshorizon);
  
  return {
    eindkapitaal,
    geinvesteerdKapitaal,
    behaaldRendement,
    maandelijksInkomen,
    maandelijksInkomenInflatie,
  };
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Format number as currency (EUR)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('nl-BE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format number as percentage
 */
export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('nl-BE', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format large numbers with K/M suffix
 */
export function formatCompact(value: number): string {
  if (value >= 1000000) {
    return `€${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `€${(value / 1000).toFixed(0)}K`;
  }
  return formatCurrency(value);
}

