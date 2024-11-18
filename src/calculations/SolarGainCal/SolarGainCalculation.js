// SolarGainCalculation.js

// Import constants from CitiesValues.js
import { 
    Orientation_k_values, 
    Solar_declination, 
    City_latitude 
} from '../../utils/solargain/CitiesValues.js'; // Ensure the correct relative path

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

// Function to convert degrees to radians
const degreesToRadians = (degrees) => {
    return degrees * (Math.PI / 180);
};

// Function to calculate phi for each city and each month
const calculatePhi = () => {
    const City_phi = {}; 

    for (const city in City_latitude) {
        const latitude = City_latitude[city];
        City_phi[city] = {};

        for (const month in Solar_declination) {
            const declination = Solar_declination[month];
            const phi_degrees = latitude - declination;
            const phi_radians = degreesToRadians(phi_degrees);
            City_phi[city][month] = phi_radians.toFixed(2); 
        }
    }

    return City_phi;
};

// Calculate phi values
const phiValues = calculatePhi();

// Log phi values
console.log("Phi Values (in radians):\n");

for (const city in phiValues) {
    console.log(`${city}:`);
    for (const month in phiValues[city]) {
        console.log(`  ${month}: ${phiValues[city][month]} `);
    }
    console.log(""); 
}

