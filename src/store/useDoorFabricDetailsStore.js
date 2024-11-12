// File: useDoorFabricDetailsStore.js

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useDoorFabricDetailsStore = create(
  persist(
    (set) => ({
      // State variables
      doorMaterial: null,
      doorThickness: '',
      uValue: null,
      uaValue: null, 

      // Actions
      setDoorMaterial: (doorMaterial) => set({ doorMaterial }),
      setDoorThickness: (doorThickness) => set({ doorThickness }),
      setUValue: (uValue) => set({ uValue }),
      setUAValue: (uaValue) => set({ uaValue }),
    }),
    {
      name: 'door-fabric-details-storage', // Unique name for storage key
    }
  )
);

export default useDoorFabricDetailsStore;
