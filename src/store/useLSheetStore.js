import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useLSheetStore = create(
  persist(
    (set) => ({
  // State variables
  monthlyCoolingLoads: [], // Array of { month: string, totalCoolingLoad: number }
  monthlyHeatingLoads: [], // Array of { month: string, totalHeatingLoad: number }

  // Actions to update the state
  setMonthlyCoolingLoads: (loads) => set({ monthlyCoolingLoads: loads }),
  setMonthlyHeatingLoads: (loads) => set({ monthlyHeatingLoads: loads }),

  // Optional: Actions to reset the loads
  resetMonthlyCoolingLoads: () => set({ monthlyCoolingLoads: [] }),
  resetMonthlyHeatingLoads: () => set({ monthlyHeatingLoads: [] }),
}),
{
  name: 'l-sheet-store',
}
));

export default useLSheetStore;
