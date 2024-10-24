
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useWallFabricDetailsStore = create(
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

      // Actions
      setOuterLayerMaterial: (outerLayerMaterial) => set({ outerLayerMaterial }),
      setOuterLayerThickness: (outerLayerThickness) => set({ outerLayerThickness }),
      setCoreLayerMaterial: (coreLayerMaterial) => set({ coreLayerMaterial }),
      setCoreLayerThickness: (coreLayerThickness) => set({ coreLayerThickness }),
      setInsulationLayerMaterial: (insulationLayerMaterial) => set({ insulationLayerMaterial }),
      setInsulationLayerThickness: (insulationLayerThickness) => set({ insulationLayerThickness }),
      setInnerLayerMaterial: (innerLayerMaterial) => set({ innerLayerMaterial }),
      setInnerLayerThickness: (innerLayerThickness) => set({ innerLayerThickness }),
    }),
    {
      name: 'wall-fabric-details-storage', // Unique name for storage key
    }
  )
);

export default useWallFabricDetailsStore;
