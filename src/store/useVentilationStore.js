import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useVentilationStore = create(
    persist(
        (set) => ({
            // State variables
            numberOfFans: '',
            constructionType: '',
            lobbyType: '',
            percentageDraughtProofed: '',
            ventilationType: '',

            // Setters
            setNumberOfFans: (value) => set({ numberOfFans: value }),
            setConstructionType: (value) => set({ constructionType: value }),
            setLobbyType: (value) => set({ lobbyType: value }),
            setPercentageDraughtProofed: (value) => set({ percentageDraughtProofed: value }),
            setVentilationType: (value) => set({ ventilationType: value }),

            // Optional: Reset function
            resetVentilation: () =>
                set({
                    numberOfFans: '',
                    constructionType: '',
                    lobbyType: '',
                    percentageDraughtProofed: '',
                    ventilationType: '',
                }),
        }),

        {
            name: 'ventilation-storage',  // Unique name for the storage key
        }
    )
);

export default useVentilationStore;
