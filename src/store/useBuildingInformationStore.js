// src/stores/useBuildingInformationStore.js

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useBuildingInformationStore = create(
  persist(
    (set) => ({
      ownerName: '',
      address: '',
      plotNo: '',
      streetNo: '',
      postalCode: '',
      selectedState: '',
      selectedCity: '',

      // Actions
      setOwnerName: (ownerName) => set({ ownerName }),
      setAddress: (address) => set({ address }),
      setPlotNo: (plotNo) => set({ plotNo }),
      setStreetNo: (streetNo) => set({ streetNo }),
      setPostalCode: (postalCode) => set({ postalCode }),
      setSelectedState: (selectedState) => set({ selectedState }),
      setSelectedCity: (selectedCity) => set({ selectedCity }),
    }),
    {
      name: 'building-information-storage', // Unique name for the storage key
    }
  )
);

export default useBuildingInformationStore;
