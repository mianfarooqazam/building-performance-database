
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSlabFabricDetailsStore = create(
  persist(

    (set) => ({
      // State variables
      selectedSlabType: null,
      uValue: null,
      uaValue: null,

      //Actions
      setSelectedSlabType: (selected) => set({ selectedSlabType: selected }),
      setUValue: (uValue) => set({ uValue }),
      setUAValue: (uaValue) => set({ uaValue })
    }),
    {
      name: 'slab-fabric-details-storage',
    }
  )
);

export default useSlabFabricDetailsStore;
