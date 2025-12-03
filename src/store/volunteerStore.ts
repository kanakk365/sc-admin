import { create } from 'zustand';
import { apiClient } from '@/utils/api';

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
  updateVolunteerStatus: (id: string, status: 'APPROVED' | 'REJECTED' | 'SUSPENDED' | 'FROZEN') => Promise<boolean>;
  selectedVolunteer: Volunteer | null;
  fetchVolunteerDetails: (id: string) => Promise<void>;
}

export const useVolunteerStore = create<VolunteerState>((set) => ({
  volunteers: [],
  selectedVolunteer: null,
  meta: null,
  isLoading: false,
  error: null,
  fetchVolunteers: async (page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const data = await apiClient.get<{ data: Volunteer[]; meta: Meta }>(`/admins/get-volunteer?page=${page}&limit=${limit}`);
      set({ volunteers: data.data, meta: data.meta, isLoading: false });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      set({ error: errorMessage, isLoading: false });
    }
  },
  updateVolunteerStatus: async (id: string, status: 'APPROVED' | 'REJECTED' | 'SUSPENDED' | 'FROZEN') => {
    try {
      await apiClient.patch(`/admins/volunteer/${id}/status`, {
        profileStatus: status,
      });

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
  fetchVolunteerDetails: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await apiClient.get<{ volunteer: Volunteer }>(`/admins/volunteers/${id}`);
      set({ selectedVolunteer: data.volunteer, isLoading: false });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      set({ error: errorMessage, isLoading: false });
    }
  },
}));

