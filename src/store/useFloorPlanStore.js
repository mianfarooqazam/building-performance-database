// src/stores/useFloorPlanStore.js

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useFloorPlanStore = create(
  persist(
    (set) => ({
      buildingOrientation: '',
      numberOfFloors: '',
      showWindowInputs: false,
      windowOrientation: '',
      wallLengths: {},
      wallHeight: '',
      totalFloorArea: '',
      windowArea: '',

      // Actions
      setBuildingOrientation: (buildingOrientation) => set({ buildingOrientation }),
      setNumberOfFloors: (numberOfFloors) => set({ numberOfFloors }),
      setShowWindowInputs: (showWindowInputs) => set({ showWindowInputs }),
      setWindowOrientation: (windowOrientation) => set({ windowOrientation }),
      setWallLengths: (wallLengths) => set({ wallLengths }),
      setWallHeight: (wallHeight) => set({ wallHeight }),
      setTotalFloorArea: (totalFloorArea) => set({ totalFloorArea }),
      setWindowArea: (windowArea) => set({ windowArea }),
    }),
    {
      name: 'floorplan-storage', // Unique name for the storage key
    }
  )
);

export default useFloorPlanStore;