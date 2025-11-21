import { create } from 'zustand';
import { useAuthStore } from './authStore';

interface Volunteer {
  id: string;
  registrationCode: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  city: string;
  division: string;
  role: string;
  profileImageUrl: string | null;
  profileImageKey: string | null;
  governmentIdType: string;
  governmentIdUrl: string | null;
  governmentIdKey: string | null;
  selfieUrl: string | null;
  selfieKey: string | null;
  addressLine1: string;
  addressLine2: string;
  state: string;
  postalCode: string;
  termsAccepted: boolean;
  termsAcceptedAt: string;
  profileStatus: string;
  createdAt: string;
  updatedAt: string;
}

interface Meta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

interface VolunteerState {
  volunteers: Volunteer[];
  meta: Meta | null;
  isLoading: boolean;
  error: string | null;
  fetchVolunteers: (page?: number, limit?: number) => Promise<void>;
  updateVolunteerStatus: (id: string, status: 'APPROVED' | 'REJECTED') => Promise<boolean>;
}

export const useVolunteerStore = create<VolunteerState>((set) => ({
  volunteers: [],
  meta: null,
  isLoading: false,
  error: null,
  fetchVolunteers: async (page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const accessToken = useAuthStore.getState().accessToken;
      const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://scapi.elitceler.com/api/v1'; 
      const response = await fetch(`${baseURL}/admins/get-volunteer?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch volunteers');
      }

      const data = await response.json();
      set({ volunteers: data.data, meta: data.meta, isLoading: false });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      set({ error: errorMessage, isLoading: false });
    }
  },
  updateVolunteerStatus: async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const accessToken = useAuthStore.getState().accessToken;
      const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://scapi.elitceler.com/api/v1';
      
      const response = await fetch(`${baseURL}/admins/volunteer/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          profileStatus: status,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update volunteer status');
      }

      // Remove the volunteer from the list after successful update
      set((state) => ({
        volunteers: state.volunteers.filter((v) => v.id !== id),
        meta: state.meta ? {
          ...state.meta,
          totalItems: state.meta.totalItems - 1,
        } : null,
      }));

      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      set({ error: errorMessage });
      return false;
    }
  },
}));

