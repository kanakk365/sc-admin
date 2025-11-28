import { create } from 'zustand';
import { apiClient } from '@/utils/api';

interface Donation {
  id: string;
  amount: number;
  status: string;
  subscriptionType: string;
  volunteerRegistrationCode: string;
  volunteerName: string;
  volunteerEmail: string;
  volunteerPhoneNumber: string;
  createdAt: string;
  userFullName: string;
  userEmail: string;
}

interface Meta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

interface DonationState {
  donations: Donation[];
  meta: Meta | null;
  isLoading: boolean;
  error: string | null;
  fetchDonations: (page?: number, limit?: number) => Promise<void>;
}

export const useDonationStore = create<DonationState>((set) => ({
  donations: [],
  meta: null,
  isLoading: false,
  error: null,
  fetchDonations: async (page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const data = await apiClient.get<{ data?: Donation[]; meta?: Meta } | Donation[]>(`/admins/donations?page=${page}&limit=${limit}`);
      
      if (Array.isArray(data)) {
        set({ donations: data, meta: null, isLoading: false });
      } else if (data.data && Array.isArray(data.data)) {
        set({ donations: data.data, meta: data.meta || null, isLoading: false });
      } else {
        set({ donations: [], meta: null, isLoading: false });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      set({ error: errorMessage, isLoading: false });
    }
  },
}));

