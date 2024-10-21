
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useDoorFabricDetailsStore = create(
  persist(
    (set) => ({
      // State variables
      doorMaterial: null,
      doorThickness: '',

      // Actions
      setDoorMaterial: (doorMaterial) => set({ doorMaterial }),
      setDoorThickness: (doorThickness) => set({ doorThickness }),
    }),
    {
      name: 'door-fabric-details-storage', // Unique name for storage key
    }
  )
);

export default useDoorFabricDetailsStore;
