import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const IslamabadTemperature = require('../../utils/temperature/IslamabadTemperature.json');
const MultanTemperature = require('../../utils/temperature/MultanTemperature.json');
const KarachiTemperature = require('../../utils/temperature/KarachiTemperature.json');
const LahoreTemperature = require('../../utils/temperature/LahoreTemperature.json');
const PeshawarTemperature = require('../../utils/temperature/PeshawarTemperature.json');

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

const calculateAndLog = (cityData, cityName) => {
    const result = cityData.map(entry => {
        const factor = monthFactors[entry.MO];
        return {
            MO: entry.MO,
            DY: entry.DY,
            HR: entry.HR,
            T2M: entry.T2M,
            Calculation: (24 - entry.T2M) * factor
        };
    });
    console.log(`Calculations for ${cityName}:`);
    const first10 = result.slice(0, 10);
    const last10 = result.slice(-2);
    console.table(first10);
    console.table(last10);
};

calculateAndLog(IslamabadTemperature, 'Islamabad');
calculateAndLog(MultanTemperature, 'Multan');
calculateAndLog(LahoreTemperature, 'Lahore');
calculateAndLog(KarachiTemperature, 'Karachi');
calculateAndLog(PeshawarTemperature, 'Peshawar');
