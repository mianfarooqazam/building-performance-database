// useAppliancesLoadStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAppliancesLoadStore = create(
  persist(
    (set) => ({
      // State variables
      appliance: '',
      manufacturer: '',
      quantity: '',
      dailyHourUsage: '',
      wattage: '',
      refrigeratorType: '',
      appliances: [],
      
      // Actions
      setAppliance: (appliance) => set({ appliance }),
      setManufacturer: (manufacturer) => set({ manufacturer }),
      setQuantity: (quantity) => set({ quantity }),
      setDailyHourUsage: (dailyHourUsage) => set({ dailyHourUsage }),
      setWattage: (wattage) => set({ wattage }),
      setRefrigeratorType: (refrigeratorType) => set({ refrigeratorType }),
      addAppliance: (newAppliance) =>
        set((state) => ({
          appliances: [...state.appliances, newAppliance],
        })),
      removeAppliance: (index) =>
        set((state) => ({
          appliances: state.appliances.filter((_, i) => i !== index),
        })),
    }),
    {
      name: 'appliances-load-storage',
    }
  )
);

export default useAppliancesLoadStore;
