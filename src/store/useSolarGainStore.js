import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSolarGainStore = create(
    persist(
        (set) => ({
            solarGainWatt: [],
            totalGainWatt: [],
            setSolarGainWatt: (data) => set({ solarGainWatt: data }),
            setTotalGainWatt: (data) => set({ totalGainWatt: data }),
        }),
        {
            name: 'solar-gain-store',
        }
    )
);

export default useSolarGainStore;
