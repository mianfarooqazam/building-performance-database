
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useWindowFabricDetailsStore = create(
  persist(
    (set) => ({
      // State variables
      selectedWindowType: null,
      selectedFrameType: null,
      selectedShadingCover: null,

      // Actions
      setSelectedWindowType: (selectedWindowType) => set({ selectedWindowType }),
      setSelectedFrameType: (selectedFrameType) => set({ selectedFrameType }),
      setSelectedShadingCover: (selectedShadingCover) => set({ selectedShadingCover }),
    }),
    {
      name: 'window-fabric-details-storage', // Unique name for storage key
    }
  )
);

export default useWindowFabricDetailsStore;
