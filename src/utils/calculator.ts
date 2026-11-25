export type NetworkId = 'all' | 'jazz' | 'zong' | 'telenor' | 'ufone';

export const DEFAULT_TAX_RATE = 13.04;

export const QUICK_AMOUNTS = [100, 200, 320, 500, 1000] as const;

export const TAX_PRESETS = [
  { label: 'Standard', rate: 13.04 },
  { label: '15% WHT', rate: 15.0 },
  { label: 'Zero Tax', rate: 0 },
] as const;

export interface UssdCode {
  id: string;
  label: string;
  code: string;
  note: string;
}

export interface PackagePreset {
  id: string;
  name: string;
  validity: string;
  targetPrice: number;
  summary: string;
}

export interface NetworkInfo {
  id: NetworkId;
  name: string;
  accentHex: string;
  dotClass: string;
  badgeClass: string;
  ussdCodes: UssdCode[];
  packages: PackagePreset[];
}

export const NETWORKS: NetworkInfo[] = [
  {
    id: 'all',
    name: 'Standard',
    accentHex: '#059669',
    dotClass: 'bg-emerald-500',
    badgeClass: 'text-emerald-700 dark:text-emerald-300',
    ussdCodes: [],
    packages: [],
  },
  {
    id: 'jazz',
    name: 'Jazz',
    accentHex: '#d9252a',
    dotClass: 'bg-[#d9252a]',
    badgeClass: 'text-[#d9252a] dark:text-red-400',
    ussdCodes: [
      { id: 'jazz-bal', label: 'Balance Check', code: '*111#', note: 'Main balance inquiry' },
      { id: 'jazz-adv', label: 'Jazz Advance', code: '*112#', note: 'Emergency loan balance' },
      { id: 'jazz-num', label: 'Check SIM Number', code: '*99#', note: 'Display own number' },
      { id: 'jazz-menu', label: 'Jazz Menu', code: '*444#', note: 'Self-service offers' },
    ],
    packages: [
      { id: 'jazz-w-sup', name: 'Weekly Super Plus', validity: '7 Days', targetPrice: 435, summary: '15 GB data + minutes' },
      { id: 'jazz-m-max', name: 'Monthly Max', validity: '30 Days', targetPrice: 1300, summary: '50 GB data + all-net' },
      { id: 'jazz-d-soc', name: 'Daily Social & Call', validity: '1 Day', targetPrice: 45, summary: 'Daily data & on-net' },
    ],
  },
  {
    id: 'zong',
    name: 'Zong',
    accentHex: '#84b616',
    dotClass: 'bg-[#84b616]',
    badgeClass: 'text-[#6a9310] dark:text-lime-400',
    ussdCodes: [
      { id: 'zong-bal', label: 'Balance Check', code: '*222#', note: 'Main balance inquiry' },
      { id: 'zong-adv', label: 'Zong Yaari Load', code: '*911#', note: 'Emergency advance balance' },
      { id: 'zong-num', label: 'Check SIM Number', code: '*8#', note: 'Display own number' },
      { id: 'zong-data', label: 'Remaining MBs', code: '*102#', note: 'Data & minutes check' },
    ],
    packages: [
      { id: 'zong-w-pro', name: 'Weekly Pro Plus', validity: '7 Days', targetPrice: 460, summary: '40 GB data + calls' },
      { id: 'zong-m-sup', name: 'Monthly Pro', validity: '30 Days', targetPrice: 1450, summary: '60 GB data + minutes' },
      { id: 'zong-d-max', name: 'Daily Shandaar', validity: '1 Day', targetPrice: 35, summary: 'Daily call & SMS' },
    ],
  },
  {
    id: 'telenor',
    name: 'Telenor',
    accentHex: '#00a3e0',
    dotClass: 'bg-[#00a3e0]',
    badgeClass: 'text-[#0284c7] dark:text-sky-400',
    ussdCodes: [
      { id: 'telenor-bal', label: 'Balance Check', code: '*444#', note: 'Main balance inquiry' },
      { id: 'telenor-adv', label: 'Emergency Load', code: '*0#', note: 'Advance loan balance' },
      { id: 'telenor-num', label: 'Check SIM Number', code: '*8888#', note: 'Display own number' },
      { id: 'telenor-mb', label: 'Internet Balance', code: '*999#', note: 'Remaining data MBs' },
    ],
    packages: [
      { id: 'telenor-w-easy', name: 'Weekly EasyCard', validity: '7 Days', targetPrice: 390, summary: '12 GB + all-net mins' },
      { id: 'telenor-m-ult', name: 'Monthly Extreme', validity: '30 Days', targetPrice: 1200, summary: '40 GB + calls' },
      { id: 'telenor-d-all', name: 'Daily All-in-One', validity: '1 Day', targetPrice: 40, summary: '24h data & calls' },
    ],
  },
  {
    id: 'ufone',
    name: 'Ufone',
    accentHex: '#ff6600',
    dotClass: 'bg-[#ff6600]',
    badgeClass: 'text-[#ea580c] dark:text-orange-400',
    ussdCodes: [
      { id: 'ufone-bal', label: 'Balance Check', code: '*124#', note: 'Main balance inquiry' },
      { id: 'ufone-adv', label: 'UAdvance', code: '*456#', note: 'Emergency loan balance' },
      { id: 'ufone-num', label: 'Check SIM Number', code: '*780*3#', note: 'Display own number' },
      { id: 'ufone-rem', label: 'Remaining Resources', code: '*706#', note: 'Free MBs & minutes' },
    ],
    packages: [
      { id: 'ufone-w-sup', name: 'Sab Se Bari Weekly', validity: '7 Days', targetPrice: 410, summary: '18 GB + calls' },
      { id: 'ufone-m-sup', name: 'Super Card Max', validity: '30 Days', targetPrice: 1150, summary: 'Monthly all-in-one' },
      { id: 'ufone-d-best', name: 'Daily Pakistan', validity: '1 Day', targetPrice: 32, summary: 'Daily on-net & data' },
    ],
  },
];

export interface LoadToBalanceResult {
  rechargeAmount: number;
  taxAmount: number;
  netBalance: number;
  retentionPercent: number;
  taxRatePercent: number;
}

export interface RequiredLoadResult {
  targetBalance: number;
  exactLoadNeeded: number;
  recommendedLoad: number;
  actualNetReceived: number;
  actualTaxDeducted: number;
  bufferAmount: number;
}

export interface HistoryEntry {
  id: string;
  mode: 'load' | 'target';
  network: NetworkId;
  taxRatePercent: number;
  inputAmount: number;
  outputAmount: number;
  secondaryAmount: number;
  createdAt: string;
}

export function sanitizeAmount(value: string | number): number {
  const parsed = typeof value === 'number' ? value : parseFloat(value);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return parsed;
}

export function sanitizeRate(value: string | number): number {
  const parsed = typeof value === 'number' ? value : parseFloat(value);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  if (parsed > 99) return 99;
  return Math.round(parsed * 100) / 100;
}

export function calculateLoadToBalance(
  loadAmount: number,
  taxRatePercent: number = DEFAULT_TAX_RATE
): LoadToBalanceResult {
  const safeLoad = sanitizeAmount(loadAmount);
  const safeRate = sanitizeRate(taxRatePercent);
  const rateDecimal = safeRate / 100;
  const taxAmount = Math.round(safeLoad * rateDecimal * 100) / 100;
  const netBalance = Math.round((safeLoad - taxAmount) * 100) / 100;
  const retentionPercent = Math.round((100 - safeRate) * 100) / 100;

  return {
    rechargeAmount: safeLoad,
    taxAmount,
    netBalance,
    retentionPercent,
    taxRatePercent: safeRate,
  };
}

export function calculateRequiredLoad(
  targetBalance: number,
  taxRatePercent: number = DEFAULT_TAX_RATE
): RequiredLoadResult {
  const safeTarget = sanitizeAmount(targetBalance);
  const safeRate = sanitizeRate(taxRatePercent);
  const retentionDecimal = (100 - safeRate) / 100;

  if (safeTarget === 0 || retentionDecimal <= 0) {
    return {
      targetBalance: safeTarget,
      exactLoadNeeded: 0,
      recommendedLoad: 0,
      actualNetReceived: 0,
      actualTaxDeducted: 0,
      bufferAmount: 0,
    };
  }

  const exactLoadNeeded = Math.round((safeTarget / retentionDecimal) * 100) / 100;
  // Round up to nearest rupee so net usable balance never falls short of target
  const recommendedLoad = Math.ceil(safeTarget / retentionDecimal - 1e-9);
  const actualNetReceived = Math.round(recommendedLoad * retentionDecimal * 100) / 100;
  const actualTaxDeducted = Math.round((recommendedLoad - actualNetReceived) * 100) / 100;
  const bufferAmount = Math.max(0, Math.round((actualNetReceived - safeTarget) * 100) / 100);

  return {
    targetBalance: safeTarget,
    exactLoadNeeded,
    recommendedLoad,
    actualNetReceived,
    actualTaxDeducted,
    bufferAmount,
  };
}

export function formatPkr(amount: number, decimals: number = 2): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  return (
    'Rs. ' +
    safe.toLocaleString('en-PK', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  );
}

export function getNetworkInfo(id: NetworkId): NetworkInfo {
  return NETWORKS.find((n) => n.id === id) ?? NETWORKS[0];
}
