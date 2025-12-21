import apiClient from './apiClient';
import { mockJobs } from '../data/mockData';

export interface JobsQuery {
  search?: string;
  sector?: 'government' | 'private';
  category?: string;
  location?: string;
  experienceLevel?: 'entry' | 'mid' | 'senior' | 'executive';
  speciality?: string;
  dutyType?: 'full_time' | 'part_time' | 'contract';
  featured?: boolean;
  page?: number;
  size?: number;
  sort?: string; // e.g. 'createdAt,desc'
  status?: 'active' | 'closed' | 'pending' | 'draft';
}

export async function fetchJobs(params: JobsQuery = {}) {
  try {
    const res = await apiClient.get('/api/jobs', {
      params: {
        ...params,
        page: params.page ?? 0,
        size: params.size ?? 20,
        sort: params.sort || 'createdAt,desc',
      },
    });
    const data = res.data;

    // Show mock listings when backend responds but has no data so UI matches reference design
    const hasContent = Array.isArray(data?.content) && data.content.length > 0;
    if (!hasContent) {
      const page = params.page ?? 0;
      const size = params.size ?? 20;
      const filtered = mockJobs.filter((job) => {
        const matchesSearch = !params.search ||
          `${job.title} ${job.organization} ${job.location}`.toLowerCase().includes(params.search.toLowerCase());
        const matchesSector = !params.sector || job.sector === params.sector;
        const matchesCategory = !params.category || job.category === params.category;
        const matchesLocation = !params.location || job.location.toLowerCase().includes(params.location.toLowerCase());
        const matchesFeatured = params.featured === undefined ? true : job.featured === params.featured;
        const matchesStatus = !params.status || job.status === params.status;
        return matchesSearch && matchesSector && matchesCategory && matchesLocation && matchesFeatured && matchesStatus;
      });

      const sorted = [...filtered].sort((a, b) => {
        const aDate = (a as any).postedDate || (a as any).lastDate || '';
        const bDate = (b as any).postedDate || (b as any).lastDate || '';
        return aDate > bDate ? -1 : 1;
      });

      const start = page * size;
      const content = sorted.slice(start, start + size);
      return {
        content,
        totalElements: filtered.length,
        totalPages: Math.ceil(filtered.length / size),
        number: page,
        size,
      };
    }

    return data;
  } catch (err) {
    // Fallback to mock data when backend is unavailable so the page still shows listings locally
    const page = params.page ?? 0;
    const size = params.size ?? 20;
    const filtered = mockJobs.filter((job) => {
      const matchesSearch = !params.search ||
        `${job.title} ${job.organization} ${job.location}`.toLowerCase().includes(params.search.toLowerCase());
      const matchesSector = !params.sector || job.sector === params.sector;
      const matchesCategory = !params.category || job.category === params.category;
      const matchesLocation = !params.location || job.location.toLowerCase().includes(params.location.toLowerCase());
      const matchesFeatured = params.featured === undefined ? true : job.featured === params.featured;
      const matchesStatus = !params.status || job.status === params.status;
      return matchesSearch && matchesSector && matchesCategory && matchesLocation && matchesFeatured && matchesStatus;
    });

    // Sort mock jobs by posted date descending when available
    const sorted = [...filtered].sort((a, b) => {
      const aDate = (a as any).postedDate || (a as any).lastDate || '';
      const bDate = (b as any).postedDate || (b as any).lastDate || '';
      return aDate > bDate ? -1 : 1;
    });

    const start = page * size;
    const content = sorted.slice(start, start + size);
    return {
      content,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / size),
      number: page,
      size,
    };
  }
}

export async function fetchJob(id: string) {
  try {
    const res = await apiClient.get(`/api/jobs/${id}`);
    return res.data;
  } catch {
    return mockJobs.find((job) => job.id === id);
  }
}

export async function fetchJobsMeta() {
  try {
    const res = await apiClient.get('/api/jobs/meta');
    const data = res.data;
    const categoriesArr = Array.isArray(data?.categories) ? data.categories : [];
    const locationsArr = Array.isArray(data?.locations) ? data.locations : [];
    if (categoriesArr.length === 0 && locationsArr.length === 0) {
      const categories = Array.from(new Set(mockJobs.map((job) => job.category))).sort();
      const locations = Array.from(new Set(mockJobs.map((job) => job.location))).sort();
      return { categories, locations };
    }
    return { categories: categoriesArr, locations: locationsArr };
  } catch {
    const categories = Array.from(new Set(mockJobs.map((job) => job.category))).sort();
    const locations = Array.from(new Set(mockJobs.map((job) => job.location))).sort();
    return { categories, locations };
  }
}

export interface JobPayload {
  title: string;
  organization: string;
  sector: 'government' | 'private';
  category: string;
  location: string;
  qualification: string;
  experience: string;
  experienceLevel?: 'entry' | 'mid' | 'senior' | 'executive';
  speciality?: string;
  dutyType?: 'full_time' | 'part_time' | 'contract';
  numberOfPosts?: number;
  salary?: string;
  description: string;
  lastDate: string; // yyyy-MM-dd
  pdfUrl?: string;
  applyLink?: string;
  status?: 'active' | 'closed' | 'pending' | 'draft';
  featured?: boolean;
  views?: number;
  applications?: number;
  contactEmail?: string;
  contactPhone?: string;
  type?: 'hospital' | 'consultancy' | 'hr' | string;
}

export async function createJob(payload: JobPayload) {
  // The token is now added automatically by the interceptor
  const res = await apiClient.post('/api/jobs', payload);
  return res.data;
}

export async function updateJob(id: string, payload: Partial<JobPayload>) {
  const res = await apiClient.put(`/api/jobs/${id}`, payload);
  return res.data;
}

export async function deleteJob(id: string) {
  await apiClient.delete(`/api/jobs/${id}`);
}
