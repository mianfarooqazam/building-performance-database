
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useWindowFabricDetailsStore = create(
  persist(
    (set) => ({
      // State variables
      selectedWindowType: null,
      selectedFrameType: null,
      selectedShadingCover: null,
      uValue: null,

      // Actions
      setSelectedWindowType: (selectedWindowType) => set({ selectedWindowType }),
      setSelectedFrameType: (selectedFrameType) => set({ selectedFrameType }),
      setSelectedShadingCover: (selectedShadingCover) => set({ selectedShadingCover }),
      setUValue: (uValue) => set({ uValue }),
    }),
    {
      name: 'window-fabric-details-storage', // Unique name for storage key
    }
  )
);

export default useWindowFabricDetailsStore;
