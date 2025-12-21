import apiClient from './apiClient';

export type PulseType = 'GOVT' | 'PRIVATE' | 'EXAM' | 'DEADLINE' | 'UPDATE';

export interface PulseUpdate {
  id: string;
  title: string;
  type: PulseType;
  date: string;
  breaking?: boolean;
}

// Local fallback items so the UI always has content even if the API is down.
const fallbackPulseUpdates: PulseUpdate[] = [
  {
    id: 'pulse-1',
    title: 'NMC releases revised academic calendar for MBBS 2025 batch',
    type: 'GOVT',
    date: '2025-10-14',
    breaking: true,
  },
  {
    id: 'pulse-2',
    title: 'AIIMS institutes common recruitment portal for Group A medical posts',
    type: 'GOVT',
    date: '2025-10-12',
  },
  {
    id: 'pulse-3',
    title: 'NBEMS announces tentative NEET-SS counseling window',
    type: 'EXAM',
    date: '2025-10-10',
  },
  {
    id: 'pulse-4',
    title: 'Private hospital chains open 1,200 resident doctor positions across metros',
    type: 'PRIVATE',
    date: '2025-10-08',
  },
  {
    id: 'pulse-5',
    title: 'Last date extended for DM/MCh registration under NMC portal',
    type: 'DEADLINE',
    date: '2025-10-06',
  },
  {
    id: 'pulse-6',
    title: 'ICMR updates guidance on antimicrobial stewardship in tertiary care',
    type: 'UPDATE',
    date: '2025-10-05',
  },
];

export async function fetchPulseUpdates(): Promise<PulseUpdate[]> {
  try {
    const res = await apiClient.get('/api/news/pulse');
    const data = res.data;
    if (Array.isArray(data) && data.length > 0) return data;
    return fallbackPulseUpdates;
  } catch {
    return fallbackPulseUpdates;
  }
}
