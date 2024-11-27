import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Import temperature data
const IslamabadTemperature = require('../../utils/temperature/IslamabadTemperature.json');
const MultanTemperature = require('../../utils/temperature/MultanTemperature.json');
const KarachiTemperature = require('../../utils/temperature/KarachiTemperature.json');
const LahoreTemperature = require('../../utils/temperature/LahoreTemperature.json');
const PeshawarTemperature = require('../../utils/temperature/PeshawarTemperature.json');

// Define month factors
const monthFactors = {
    1: 905.89,
    2: 906.96,
    3: 906.58,
    4: 906.62,
    5: 908.68,
    6: 906.96,
    7: 907.67,
    8: 905.47,
    9: 904.48,
    10: 905.89,
    11: 906.66,
    12: 905.93
};

// Define Gamma-cool values per month
const gammaCoolValues = {
    1: 108.91,
    2: 120.70,
    3: 142.86,
    4: 197.42,
    5: 202.84,
    6: 212.93,
    7: 190.55,
    8: 176.53,
    9: 160.85,
    10: 126.35,
    11: 113.27,
    12: 102.33
};

// Define Gamma-heat values per month
const gammaHeatValues = {
    1: 387.86,
    2: 399.64,
    3: 421.80,
    4: 476.36,
    5: 481.77,
    6: 491.86,
    7: 469.48,
    8: 455.45,
    9: 439.77,
    10: 405.26,
    11: 392.17,
    12: 381.22
};

const calculateAndLog = (cityData, cityName) => {
    const result = cityData.map(entry => {
        const factor = monthFactors[entry.MO];
        const gammaCool = gammaCoolValues[entry.MO] || 0; // Fallback to 0 if undefined
        const gammaHeat = gammaHeatValues[entry.MO] || 0; // Fallback to 0 if undefined
        const calculation = (24 - entry.T2M) * factor;
        
        return {
            MO: entry.MO,
            DY: entry.DY,
            HR: entry.HR,
            T2M: entry.T2M,
            Calculation: parseFloat(calculation.toFixed(2)),
            "Gamma-cool": parseFloat((gammaCool / calculation).toFixed(5)),
            "Gamma-heat": parseFloat((gammaHeat / calculation).toFixed(5))
        };
    });
    console.log(`Calculations for ${cityName}:`);
    const first10 = result.slice(0, 10);
    const last2 = result.slice(-2);
    console.table(first10);
    console.table(last2);
};

calculateAndLog(IslamabadTemperature, 'Islamabad');
calculateAndLog(MultanTemperature, 'Multan');
calculateAndLog(LahoreTemperature, 'Lahore');
calculateAndLog(KarachiTemperature, 'Karachi');
calculateAndLog(PeshawarTemperature, 'Peshawar');
