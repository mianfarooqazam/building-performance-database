// VentilationCalculation.js
export const calculateM3PerHr = (numberOfFans) => {
  if (numberOfFans < 2) {
    throw new Error("Minimum number of intermittent fans is 2.");
  }
  return numberOfFans * 10;
};

export const calculateACH = (m3PerHr, dwellingVolumeM3) => {
  if (dwellingVolumeM3 === 0) {
    throw new Error("Dwelling volume cannot be zero for ACH calculation.");
  }
  return m3PerHr / dwellingVolumeM3;
};

export const calculateAdditionalInfiltration = (numberOfFloors) => {
  return (numberOfFloors - 1) * 0.1;
};

export const constructionTypeValue = (constructionType) => {
  switch (constructionType) {
    case "masonry":
      return 0.35;
    case "steel":
    case "timber":
      return 0.25;
    default:
      throw new Error("Invalid construction type.");
  }
};

export const lobbyTypeValue = (lobbyType) => {
  switch (lobbyType) {
    case "No draught":
      return 0.05;
    case "Draught":
      return 0;
    default:
      throw new Error("Invalid lobby type.");
  }
};

export const calculateWindowInfiltration = (percentageDraughtProofed) => {
  return 0.25 - (0.2 * percentageDraughtProofed) / 100;
};

export const calculateInfiltrationRate = (
  ACH,
  additionalInfiltration,
  constructionValue,
  lobbyValue,
  windowInfiltration
) => {
  return (
    ACH +
    additionalInfiltration +
    constructionValue +
    lobbyValue +
    windowInfiltration
  );
};

export const calculateShelterFactor = (sidesConnected) => {
  if (sidesConnected < 0 || sidesConnected > 4) {
    throw new Error("Number of sides connected must be between 0 and 4.");
  }
  return 1 - 0.075 * sidesConnected;
};

export const calculateWindFactor = (windDataArray) => {
  return windDataArray.map((value) => value / 4);
};

export const calculateAdjustedInfiltrationRate = (
  windFactorArray,
  infiltrationRateWithShelterFactor
) => {
  return windFactorArray.map(
    (value) => value * infiltrationRateWithShelterFactor
  );
};

export const calculateFinalInfiltrationRate = (
  adjustedInfiltrationRateArray,
  ventilationType
) => {
  if (ventilationType === "Mechanical Ventilation") {
    return adjustedInfiltrationRateArray.map(
      (value) => 0.5 + value * value * 0.5
    );
  } else if (ventilationType === "Natural Ventilation") {
    return adjustedInfiltrationRateArray.map(
      (value) => value + 0.5 * 0.5
    );
  } else {
    throw new Error("Invalid ventilation type.");
  }
};
