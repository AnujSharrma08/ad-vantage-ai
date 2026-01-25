import { create } from 'zustand';
import { LOCAL_STORAGE_KEYS } from '../services/constants';
import { fetchProfile } from '../services/auth/auth';
import { UserProfile } from '../types/auth-type';


interface ProfileStore {
    profile: UserProfile | null;
    loading: boolean;
    error: string | null;
    refreshProfile: () => Promise<void>;
    setProfile: (profile: UserProfile | null) => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
    profile: null,
    loading: false,
    error: null,

    refreshProfile: async () => {
        try {
            set({ loading: true, error: null });

            const user = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER) || "{}");

            if (!user.id) {
                throw new Error("User not found");
            }

            const profileData: UserProfile = await fetchProfile(user.id);

            localStorage.setItem(
                LOCAL_STORAGE_KEYS.USER_PROFILE,
                JSON.stringify(profileData)
            );

            set({ profile: profileData, loading: false });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            set({ error: error.message, loading: false });
            console.error("Failed to fetch profile:", error);
        }
    },

    setProfile: (profile) => set({ profile }),
}));