import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSlabFabricDetailsStore = create(
  persist(
    (set) => ({
      selectedSlabType: null,
      setSelectedSlabType: (selected) => set({ selectedSlabType: selected }),
    }),
    {
      name: 'slab-fabric-details-storage',
    }
  )
);

export default useSlabFabricDetailsStore;
