import { create } from 'zustand';
import { useAuthStore } from './authStore';

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
      const accessToken = useAuthStore.getState().accessToken;
      const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://scapi.elitceler.com/api/v1'; 
      const response = await fetch(`${baseURL}/admins/donations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch donations');
      }

      const data = await response.json();
      
      // The API might return just the array directly based on the prompt description:
      // "this will return [ ... ]"
      // But usually APIs return { data: [], meta: {} } or similar. 
      // If it returns just an array, we handle that.
      // However, typical admin panels have pagination. 
      // The prompt says "this will return [ ... ]". 
      // I will check if the response is an array or object.
      
      if (Array.isArray(data)) {
          set({ donations: data, meta: null, isLoading: false });
      } else if (data.data && Array.isArray(data.data)) {
          set({ donations: data.data, meta: data.meta, isLoading: false });
      } else {
          // Fallback if structure is different
           set({ donations: [], meta: null, isLoading: false });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      set({ error: errorMessage, isLoading: false });
    }
  },
}));

