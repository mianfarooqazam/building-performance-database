import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useVentilationStore = create(
    persist(
        (set) => ({
            // Existing State Variables
            numberOfFans: '',
            constructionType: '',
            lobbyType: '',
            percentageDraughtProofed: '',
            ventilationType: '',

            // New State Variable for Final Infiltration Rates
            finalInfiltrationRateArray: [],

            // Setters for Existing State Variables
            setNumberOfFans: (value) => set({ numberOfFans: value }),
            setConstructionType: (value) => set({ constructionType: value }),
            setLobbyType: (value) => set({ lobbyType: value }),
            setPercentageDraughtProofed: (value) => set({ percentageDraughtProofed: value }),
            setVentilationType: (value) => set({ ventilationType: value }),

            // Setter for Final Infiltration Rates
            setFinalInfiltrationRateArray: (array) => set({ finalInfiltrationRateArray: array }),
        }),
        {
            name: 'ventilation-storage',  // Unique name for the storage key
        }
    )
);

export default useVentilationStore;
