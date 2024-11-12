// File: useFloorPlanStore.js

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
      totalFloorArea: 0,
      windowArea: '',
      dwellingVolume: 0,
      sidesConnected: 0,
      totalWallArea: 0,
      totalWindowArea: 0,
      totalDoorArea: 0,
      netWallArea: 0,
      totalArea: 0,
      windows: [],
      doors: [],

      // Actions
      setBuildingOrientation: (buildingOrientation) => set({ buildingOrientation }),
      setNumberOfFloors: (numberOfFloors) => set({ numberOfFloors }),
      setShowWindowInputs: (showWindowInputs) => set({ showWindowInputs }),
      setWindowOrientation: (windowOrientation) => set({ windowOrientation }),
      setWallLengths: (wallLengths) => set({ wallLengths }),
      setWallHeight: (wallHeight) => set({ wallHeight }),
      setTotalFloorArea: (totalFloorArea) => set({ totalFloorArea }),
      setWindowArea: (windowArea) => set({ windowArea }),
      setDwellingVolume: (dwellingVolume) => set({ dwellingVolume }),
      setSidesConnected: (sidesConnected) => set({ sidesConnected }),
      setTotalWallArea: (totalWallArea) => set({ totalWallArea }),
      setTotalWindowArea: (totalWindowArea) => set({ totalWindowArea }),
      setTotalDoorArea: (totalDoorArea) => set({ totalDoorArea }),
      setNetWallArea: (netWallArea) => set({ netWallArea }),
      setTotalArea: (totalArea) => set({ totalArea }),
      setWindows: (windows) => set({ windows }),
      setDoors: (doors) => set({ doors }),
    }),
    {
      name: 'floorplan-storage', // Unique name for the storage key
    }
  )
);

export default useFloorPlanStore;
