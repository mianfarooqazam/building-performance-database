// SolarGainCalculation.js

// Import the Orientation_k_values and other constants from CitiesValues.js
import { Orientation_k_values } from '../../utils/solargain/CitiesValues.js'; // Ensure the correct relative path

// Define the angle pbytwo in radians
const pbytwo = 0.785;

// Precompute sine values
const sin_pbytwo = Math.sin(pbytwo);
const sin_pbytwo_sq = Math.pow(sin_pbytwo, 2);
const sin_pbytwo_cub = Math.pow(sin_pbytwo, 3);

// Function to calculate A, B, C for a given set of k-values
const calculateABC = (k) => {
    const A = k.k1 * sin_pbytwo_cub + k.k2 * sin_pbytwo_sq + k.k3 * sin_pbytwo;
    const B = k.k4 * sin_pbytwo_cub + k.k5 * sin_pbytwo_sq + k.k6 * sin_pbytwo;
    const C = k.k7 * sin_pbytwo_cub + k.k8 * sin_pbytwo_sq + k.k9 * sin_pbytwo + 1; 
    return { A, B, C };
};

// Iterate over each orientation and log the calculated A, B, C values
for (const orientation in Orientation_k_values) {
    const kValues = Orientation_k_values[orientation];
    const { A, B, C } = calculateABC(kValues);
    console.log(`${orientation}:`);
    console.log(`  A = ${A.toFixed(2)}`);
    console.log(`  B = ${B.toFixed(2)}`);
    console.log(`  C = ${C.toFixed(2)}\n`);
}
