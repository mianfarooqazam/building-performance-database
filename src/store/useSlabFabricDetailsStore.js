// File: useSlabFabricDetailsStore.js

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSlabFabricDetailsStore = create(
  persist(
    (set) => ({
      selectedSlabType: null,
      uValue: null,
      setSelectedSlabType: (selected) => set({ selectedSlabType: selected }),
      setUValue: (uValue) => set({ uValue }),
    }),
    {
      name: 'slab-fabric-details-storage',
    }
  )
);

export default useSlabFabricDetailsStore;
