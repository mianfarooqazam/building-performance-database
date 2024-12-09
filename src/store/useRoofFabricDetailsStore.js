// useRoofFabricDetailsStore.js

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useRoofFabricDetailsStore = create(
  persist(
    (set) => ({
      // State variables
      outerLayerMaterial: null,
      outerLayerThickness: '',
      coreLayerMaterial: null,
      coreLayerThickness: '',
      insulationLayerMaterial: null,
      insulationLayerThickness: '',
      innerLayerMaterial: null,
      innerLayerThickness: '',
      uValue: null,
      uaValue: null,
      kappaValue: null,

      // Actions
      setOuterLayerMaterial: (outerLayerMaterial) => set({ outerLayerMaterial }),
      setOuterLayerThickness: (outerLayerThickness) =>
        set({ outerLayerThickness }),
      setCoreLayerMaterial: (coreLayerMaterial) => set({ coreLayerMaterial }),
      setCoreLayerThickness: (coreLayerThickness) => set({ coreLayerThickness }),
      setInsulationLayerMaterial: (insulationLayerMaterial) =>
        set({ insulationLayerMaterial }),
      setInsulationLayerThickness: (insulationLayerThickness) =>
        set({ insulationLayerThickness }),
      setInnerLayerMaterial: (innerLayerMaterial) => set({ innerLayerMaterial }),
      setInnerLayerThickness: (innerLayerThickness) =>
        set({ innerLayerThickness }),
      setUValue: (uValue) => set({ uValue }),
      setUAValue: (uaValue) => set({ uaValue }),
      setKappaValue: (kappaValue) => set({ kappaValue }),
    }),
    {
      name: 'roof-fabric-details-storage', // Unique name for storage key
    }
  )
);

export default useRoofFabricDetailsStore;
