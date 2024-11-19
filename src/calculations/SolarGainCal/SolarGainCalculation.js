import { 
    Orientation_k_values, 
    Solar_declination, 
    City_latitude,
    City_solar_irradiance
} from '../../utils/solargain/CitiesValues.js'; 

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
const ABC_values = {}; // Store A, B, C for each orientation

for (const orientation in Orientation_k_values) {
    const kValues = Orientation_k_values[orientation];
    const { A, B, C } = calculateABC(kValues);
    ABC_values[orientation] = { A, B, C };
    console.log(`${orientation}:`);
    console.log(`  A = ${A.toFixed(5)}`);
    console.log(`  B = ${B.toFixed(5)}`);
    console.log(`  C = ${C.toFixed(5)}\n`);
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
            City_phi[city][month] = phi_radians; // Store as number for calculations
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
        console.log(`  ${month}: ${phiValues[city][month].toFixed(5)} `);
    }
    console.log(""); 
}

// Function to calculate rhnic values
const calculateRhnic = () => {
    const rhnicValues = {};

    for (const city in phiValues) {
        rhnicValues[city] = {};

        for (const orientation in ABC_values) {
            rhnicValues[city][orientation] = {};

            for (const month in phiValues[city]) {
                const phi = phiValues[city][month];
                const { A, B, C } = ABC_values[orientation];
                const cos_phi = Math.cos(phi);
                const rhnic = (A * Math.pow(cos_phi, 2)) + (B * cos_phi) + C;
                rhnicValues[city][orientation][month] = rhnic.toFixed(8);
            }
        }
    }

    return rhnicValues;
};

// Calculate rhnic values
const rhnic = calculateRhnic();

// Log rhnic values
console.log("Rhnic Values:\n");

for (const city in rhnic) {
    console.log(`${city}:`);
    for (const orientation in rhnic[city]) {
        console.log(`  ${orientation}:`);
        for (const month in rhnic[city][orientation]) {
            console.log(`    ${month}: ${rhnic[city][orientation][month]}`);
        }
    }
    console.log("");
}

// --- New Section: Calculation of Sorient ---

// Function to calculate sorient values
const calculateSorient = () => {
    const sorientValues = {};

    for (const city in City_solar_irradiance) {
        sorientValues[city] = {};

        for (const orientation in rhnic[city]) {
            sorientValues[city][orientation] = {};

            for (const month in City_solar_irradiance[city]) {
                const irradiance = City_solar_irradiance[city][month];
                const rhnicValue = parseFloat(rhnic[city][orientation][month]);
                const sorient = irradiance * rhnicValue;
                sorientValues[city][orientation][month] = sorient.toFixed(5);
            }
        }
    }

    return sorientValues;
};

// Calculate sorient values
const sorient = calculateSorient();

// Log sorient values
console.log("Sorient Values:\n");

for (const city in sorient) {
    console.log(`${city}:`);
    for (const orientation in sorient[city]) {
        console.log(`  ${orientation}:`);
        for (const month in sorient[city][orientation]) {
            console.log(`    ${month}: ${sorient[city][orientation][month]}`);
        }
    }
    console.log("");
}
