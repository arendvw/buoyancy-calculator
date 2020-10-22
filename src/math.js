// kg/L
export const Materials = {
  steel: {
    name: 'Steel',
    density: 7.9,
  },
  aluminum: {
    name: 'Aluminum',
    density: 2.7,
  },
  carbonFibre: {
    name: 'Carbon fiber',
    density: 2.7,
  },
};

export const WeightItemMaterials = {
  steel: {
    name: 'Steel',
    density: 7.9,
  },
  aluminum: {
    name: 'Aluminum',
    density: 2.7,
  },
  lead: {
    name: 'Lead',
    density: 11.3,
  },
  rubberHard: {
    name: 'Hard Rubber',
    density: 1.2,
  },
  rubberSoft: {
    name: 'Soft Rubber',
    density: 1.1,
  },
  plastic: {
    name: 'Plastic',
    density: 0.9,
  },
  custom: {
    name: 'Custom',
    density: 1,
    disable: true,
  },
};

export const ValveWeight = 0.7;
export const ManifoldWeight = 2.5;
// gram per liter
export const DensityFreshWater = 1;
export const DensitySaltwater = 1.03;
export const RubberDensity = 1000;

/** Porosity of neoprene.
 The porosities of the 5 mm and 12 mm thick foam
 neoprene samples measured at each incremental pressure stop
 are within 1% of each other, and it can be seen that equation (3)
 accurately models the porosity variation with pressure. The
 porosity is about 74% at atmospheric pressure and decreases
 to 19% at 1.2 MPa (107 msw).
 https://www.researchgate.net/publication/230971354_Thermal_conductivity_and_compressive_strain_of_foam_neoprene_insulation_under_hydrostatic_pressure/link/542da9c00cf277d58e8d106d/download
 */
export const NewNeopreneAirPercentage = 0.75;
/** Same for men and women, 0.5L */
export const TidalVolume = 0.5;

/**
 * Given it's volume and it's weight, how much does an object weigh underwater?
 * @param weight in kg
 * @param displacementVolume in m3
 * @param waterDensity in kg/m3
 * @returns {number}
 * @constructor
 */
export function CalculateUnderwaterWeight(weight, displacementVolume, waterDensity) {
  const density = weight / displacementVolume;
  return (waterDensity - density) * displacementVolume;
}

/**
 * Given it's weight and underwater weight, what is the volume of an object?
 * @param weight
 * @param underwaterWeight
 * @param waterDensity
 * @returns {number}
 * @constructor
 */
export function CalculateVolume(weight, underwaterWeight, waterDensity) {
  // weight - underWaterweight = weight of water displaced
  return (weight - underwaterWeight) / waterDensity;
}

export const TankConfigurations = [
  {
    volume: 1,
    material: 'aluminum',
    weight: 1.7,
    workingPressure: 200,
  },
  {
    volume: 1,
    material: 'steel',
    weight: 1.7,
    workingPressure: 200,
  },
  {
    volume: 2,
    material: 'aluminum',
    weight: 2.6,
    workingPressure: 207,
  },
  {
    volume: 2,
    material: 'steel',
    weight: 3.8,
    workingPressure: 232,
  },
  {
    volume: 3,
    material: 'aluminum',
    weight: 3.6,
    workingPressure: 207,
  },
  {
    volume: 3,
    material: 'steel',
    weight: 4.8,
    workingPressure: 232,
  },
  {
    volume: 5,
    material: 'steel',
    weight: 6.8,
    workingPressure: 232,
  },
  {
    volume: 5.7,
    material: 'aluminum',
    weight: 7,
    workingPressure: 207,
  },
  {
    volume: 7,
    material: 'steel',
    weight: 7.5,
    workingPressure: 232,
  },
  {
    volume: 7,
    material: 'steel',
    weight: 9.5,
    workingPressure: 300,
  },
  {
    volume: 7,
    material: 'aluminum',
    weight: 8.7,
    workingPressure: 207,
  },
  {
    volume: 8.5,
    material: 'steel',
    weight: 10.5,
    workingPressure: 232,
  },
  {
    volume: 10,
    material: 'aluminum',
    weight: 12.2,
    workingPressure: 207,
  },
  {
    volume: 10,
    material: 'steel',
    weight: 12.5,
    workingPressure: 232,
  },
  {
    volume: 10,
    material: 'steel',
    weight: 15.5,
    workingPressure: 300,
  },
  {
    volume: 11.1,
    material: 'aluminum',
    weight: 14.3,
    workingPressure: 207,
  },
  {
    volume: 12,
    material: 'steel',
    weight: 14.5,
    workingPressure: 232,
  },
  {
    volume: 12,
    material: 'steel',
    weight: 17.5,
    workingPressure: 300,
  },
  {
    volume: 15,
    material: 'steel',
    weight: 18.5,
    workingPressure: 232,
  },
  {
    volume: 18,
    material: 'steel',
    weight: 21,
    workingPressure: 232,
  },
  {
    volume: 20,
    material: 'steel',
    weight: 22.8,
    workingPressure: 232,
  },
];

export const GasMixtures = {
  air: {
    name: '21%',
    type: 'Air',
    o2: 21,
  },
  ean32: {
    name: 'EAN32',
    type: 'Nitrox',
    o2: 32,
  },
  trimix3030: {
    name: '30/30',
    type: 'Heliotrox',
    o2: 30,
    he: 30,
  },
  trimix2135: {
    name: '21/35',
    type: 'Trimix',
    o2: 21,
    he: 35,
  },
  trimix1845: {
    name: '18/45',
    type: 'Trimix',
    o2: 18,
    he: 45,
  },
  trimix1555: {
    name: '15/55',
    type: 'Trimix',
    o2: 15,
    he: 55,
  },
  trimix1265: {
    name: '12/65',
    type: 'Trimix',
    o2: 12,
    he: 65,
  },
  heliox1090: {
    name: '10/90',
    type: 'Heliox',
    o2: 10,
    he: 90,
  },
  oxygen100: {
    name: '100%',
    type: 'Oxygen',
    o2: 100,
  },
  ean50: {
    name: 'EAN50',
    type: 'Nitrox',
    o2: 50,
  },
  trimix3525: {
    name: '35/25',
    type: 'Heliotrox',
    o2: 35,
    he: 25,
  },
  argon100: {
    name: '100%',
    type: 'Argon',
    ar: 100,
  },
};

export function GetGasLabel(gasMixtureIndex) {
  return `${GasMixtures[gasMixtureIndex].type} ${GasMixtures[gasMixtureIndex].name}`;
}

export function CalculateGasWeight({ o2, he, ar }, temperatureCelsius, volume, pressure) {
  //  L·atm/mol·K;
  const gasConstant = 0.0831446261815324;
  const tempKelvin = 273 + temperatureCelsius;
  // density in g/L
  // Use ideal gas law to calculate amount of gas in cylinder
  // molecular mass / (gasConstant + tempKelvin)
  const densityHe = 4.003 / (gasConstant * tempKelvin);
  const densityO2 = 32 / (gasConstant * tempKelvin);
  const densityAr = 39.948 / (gasConstant * tempKelvin);
  const densityN2 = 28.014 / (gasConstant * tempKelvin);
  let n2 = 100;
  if (o2) {
    n2 -= o2;
  } else {
    o2 = 0;
  }
  if (he) {
    n2 -= he;
  } else {
    he = 0;
  }
  if (ar) {
    n2 -= ar;
  } else {
    ar = 0;
  }
  let density = densityN2 * n2 * 0.01;
  density += densityO2 * o2 * 0.01;
  density += densityHe * he * 0.01;
  density += densityAr * ar * 0.01;
  return density * pressure * volume;
}

export function CalculateTankGasWeight({
  o2, he, ar, volume, isDouble, workingPressure,
}) {
  volume = isDouble ? volume * 2 : volume;
  return CalculateGasWeight({ o2, he, ar }, 15, volume, workingPressure) / 1000;
}

export function CalculateTankWeightWithValve({ includeValve, isDouble, weight }) {
  if (!includeValve) {
    return isDouble ? weight * 2 : weight;
  }
  if (isDouble) {
    return (weight * 2) + ManifoldWeight;
  }
  return weight + ValveWeight;
}

/**
 *
 * @param gasMixture
 * @param isDouble
 * @param volume
 * @param weight
 * @param density
 * @param fillPressure
 * @param waterDensity
 * @returns {number}
 */
export function CalculateTankBuoyancy(
  {
    gasMixture, isDouble, volume, weight, material, includeValve,
  },
  fillPressure, waterDensity,
) {
  const { density } = Materials[material];
  const temperature = 15;
  const gas = GasMixtures[gasMixture];
  // weight in kg/L..
  const gasWeight = CalculateGasWeight(gas,
    temperature,
    volume,
    fillPressure) / 1000;
  let tankWeight = weight;
  const multiplier = isDouble ? 2 : 1;

  tankWeight += gasWeight;
  tankWeight *= multiplier;

  const valveWeight = isDouble ? ManifoldWeight : ValveWeight;
  if (includeValve) {
    tankWeight += valveWeight;
  }
  let tankVolume = volume + (weight / density);
  tankVolume *= multiplier;
  if (includeValve) {
    tankVolume += valveWeight / Materials.steel.density;
  }
  return CalculateUnderwaterWeight(tankWeight, tankVolume, waterDensity);
}

export function GetTankLabel({ volume, material, workingPressure }) {
  return `${volume} ℓ ${material} (${workingPressure} bar)`;
}
export function GetWeightItemLabel({ name, material }) {
  if (material in WeightItemMaterials) {
    return `${name} (${WeightItemMaterials[material].name})`;
  }
  return `${name}`;
}

export function GetTankFullLabel({
  volume, isDouble, material, workingPressure,
}) {
  const double = isDouble ? 'Double' : '';
  const materialName = Materials[material].name;
  return `${double} ${volume.toFixed(1)} ℓ ${materialName.toLowerCase()} (${workingPressure} bar)`;
}

/**
 * Estimate the weight from the fat percentage
 * @param weight
 * @param percentage
 * @param lungVolume
 * @param waterDensity
 * @returns {number}
 * @constructor
 */
export function CalculateWeightFromFatPercentage(weight, percentage, lungVolume, waterDensity) {
  //  using siri's equation
  // https://www.topendsports.com/testing/siri-equation.htm
  // % Body Fat = (495 / Body Density) - 450.
  const density = 4.95 / (percentage + 4.50);
  const volume = (weight / density) + lungVolume;
  const densityWithLungs = weight / volume;
  const result = (waterDensity - densityWithLungs) * volume;
  return result;
}

/**
 * Estimate lung volumes for men and women between 18 and 70, based on quanjer, 1993
 *
 * Quanjer 2012 is more accurate for non-caucasian and lager age groups, but does not handle
 * residual volumes and because of that no total lung capacity.
 *
 * @see https://www.ers-education.org/guidelines/global-lung-function-initiative/gli-resources.aspx
 * @see https://www.ers-education.org/lrmedia/2012/pdf/266696.pdf
 * @param isMale boolean
 * @param height in meter
 * @param age in years
 * @returns {{
 *  functionalResidualCapacity: number,
 *  residualVolume: number,
 *  totalLungCapacity: number,
 *  normal: number,
 *  min: number,
 *  max: number
 * }}
 */
export function CalculateLungCapacity(isMale, age, height) {
  /**
   *  Does not compute well for people < 18 or over 70
   * from Table 6, Men are first 14 equations, women last 14 equations.
   * https://erj.ersjournals.com/content/6/Suppl_16/5.figures-only
   * Y = a + b•height + c•age + error (adults)
   * log(Y) = a + b•log(height) + error (children)
   * tidal volume is about 0.4-0.5L
   * https://erj.ersjournals.com/content/erj/8/3/492.full.pdf page 498
   * 1)  The  data  on  TLC,  RV  and  FRC  derive  from  populations  which  include  smokers  and
   * ex-smokers,  so  thatboth the mean predicted value and the scatter around the mean may not be
   * representative of a nonsmoking healthy population.  On that account, the value for RV in
   * healthy non smokers  may  be  smaller  than  the  predicted  one.
   * In healthy adults, plethysmographic and gas dilution meth-ods have been shown to give the same
   * results [105–107], so that the reference values for FRCHe and FRCpleth are the  same.
   *
   * 2) The equations apply to a height range of 1.55–1.95 min  men,  and  1.45–1.80  m  in  women.
   * They  are  applicable between ages 18–70 yrs.  Between 18–25 yrs an age of 25 yrs should be
   * substituted in the equations, to account for  the  transitional  plateau  phase  between
   * lung  growth and  decline  with  ageing.
   */
  let volume = null;
  if (isMale) {
    volume = {
      // you can't forcibly exhale more than the residual volume
      residualVolume: (1.31 * height) + (0.022 * age) - 1.23, // (-0.41 <-> +0.67)
      // amount of air you can still forcibly exhale after a normal breath
      functionalResidualCapacity: (2.34 * height) + (0.009 * age) - 1.09, // (-0.6 <-> +0.99)
      // you can't forcibly inhale more than this.
      totalLungCapacity: (7.99 * height) - 7.08, // (-0.7 <-> +1.00)
    };
  } else {
    volume = {
      // you can't forcibly exhale more than the residual volume
      residualVolume: (1.81 * height) + (0.016 * age) - 2, // (-0.35 <-> +0.58)
      // amount of air you can still forcibly exhale after a normal breath
      functionalResidualCapacity: (2.24 * height) + (0.001 * age) - 1.00, // (-0.5 <-> +0.82)
      // you can't forcibly inhale more than this.
      totalLungCapacity: (6.6 * height) - 5.79, // (-0.60 <-> +0.99)
    };
  }
  // for documentation purposes: I always mix this up.
  volume.normal = volume.residualVolume + volume.functionalResidualCapacity;
  volume.min = volume.residualVolume;
  volume.max = volume.totalLungCapacity;
  return volume;
}

/**
 * basically all ways to calculate bsa based on height and weight have the same formula,
 * but have different coefficients
 * @param height
 * @param weight
 * @param coffA
 * @param coffB
 * @param coffC
 * @returns {number}
 * @constructor
 */
function CalculateDuboiEsque(height, weight, coffA, coffB, coffC) {
  // eslint-disable-next-line no-restricted-properties
  return coffA * Math.pow(weight, coffB) * Math.pow(height, coffC);
}

/**
 * Calculate based on Dubois and Dubois, 1915
 * @param height
 * @param weight
 * @returns {number}
 * @constructor
 */
export function CalculateBSADubois(height, weight) {
  return CalculateDuboiEsque(height, weight, 0.007184, 0.425, 0.725);
}

/**
 * Calculate based on Mosteller, 1989
 * @param height
 * @param weight
 * @returns {number}
 * @constructor
 */
export function CalculateBSAMosteller(height, weight) {
  return CalculateDuboiEsque(height, weight, 0.01666667, 0.5, 0.5);
}

/**
 * Calculate based on Slich for females, 2010
 * @param height
 * @param weight
 * @returns {number}
 * @constructor
 */
export function CalculateBSASchlichFemale(height, weight) {
  return CalculateDuboiEsque(height, weight, 0.000975482, 0.46, 1.08);
}

/**
 * Calculate based on Slich for males, 2010
 * @param height
 * @param weight
 * @returns {number}
 * @constructor
 */
export function CalculateBSASchlichMale(height, weight) {
  return CalculateDuboiEsque(height, weight, 0.000579479, 0.38, 1.24);
}

/**
 * Rule of nines: calculate surface area per body part, based on the assumption that
 * BSA (body surface area) is always divided proportionally over different body parts.
 * https://europepmc.org/article/med/30020659
 *
 * This calculation does not apply to children or infants.
 * People who are obese generally have a large proportion of surface area at the torso (up to 50%)
 * This is not included in this calculation.
 *
 * @param bodySurfaceArea body surface area in m2
 * @returns {{head: number,
 * feet: number, hands: number, torso: number,
 * upperArms: number, lowerLegs: number, butt: number,
 * lowerArms: number, upperLegs: number}}
 */
export function RuleOfNines(bodySurfaceArea) {
  const area = {
    head: 0.09 * bodySurfaceArea,
    hands: 0.04 * bodySurfaceArea,
    upperArms: 0.08 * bodySurfaceArea,
    lowerArms: 0.06 * bodySurfaceArea,
    torso: 0.26 * bodySurfaceArea,
    butt: 0.06 * bodySurfaceArea,
    upperLegs: 0.18 * bodySurfaceArea,
    lowerLegs: 0.17 * bodySurfaceArea,
    feet: 0.06 * bodySurfaceArea,
  };
  area.fullBody = area.upperArms + area.lowerArms + area.torso + area.upperLegs + area.lowerLegs;
  area.fullBodyHoodie = area.upperArms + area.lowerArms
    + area.torso + area.upperLegs + area.lowerLegs;
  area.shorty = area.butt + area.upperLegs * 0.66 + area.upperArms * 0.66;
  area.shortyHooded = area.butt + area.upperLegs * 0.66 + area.upperArms * 0.66 + area.head;
  area.shorts = area.butt + area.upperLegs * 0.66;
  area.shortSleeveShirt = area.torso + area.upperArms * 0.66;
  area.longSleeveShirt = area.torso + area.upperArms + area.lowerArms;
  area.sleevelessShirt = area.torso + area.upperArms + area.lowerArms;
  area.pants = area.butt + area.upperLegs + area.lowerLegs;
  area.cap = area.head;
  area.gloves = area.hands;
  area.shoes = area.feet;
  return area;
}

/**
 * @param area in m2
 * @param originalThickness (thickness of wetsuit when bought new, e.g. 5mm) in mm.
 * @param maxAirPercentage fraction of maximum air percentage of neoprene. = 0.75 for wetsuits,
 * 0.4 for compressed neoprene
 * @return number mass of neoprene without air
 */
export function CalculateNeopreneMass(area, originalThickness, maxAirPercentage) {
  const originalVolumeM3 = area * (originalThickness / 1000);
  return originalVolumeM3 * (1 - maxAirPercentage) * RubberDensity;
}

/**
 * @param area
 * @param originalThickness (thickness of the suit when bought in the store)
 * @param agePercentage 100% = new, 0% is almost complete loss of insulation
 * @param maxAgePercentage
 * @param minAgePercentage
 * @param pressure in ATA/Bar
 * @return Volume of the wetsuit in liters
 * http://archive.rubicon-foundation.org/xmlui/bitstream/handle/123456789/2518/2773163.pdf?sequence=1
 * https://www.researchgate.net/publication/230971354_Thermal_conductivity_and_compressive_strain_of_foam_neoprene_insulation_under_hydrostatic_pressure
 *
 * Anecdotal evidence for this happening:
 * https://www.scubaboard.com/community/threads/wetsuit-buoyancy-character-old-vs-new.305351/
 */
export function CalculateAgedNeopreneVolumeAtDepth(
  area,
  originalThickness,
  agePercentage,
  maxAgePercentage,
  minAgePercentage,
  pressure,
) {
  // in m3
  const originalVolumeM3 = area * (originalThickness / 1000);
  const originalVolume = originalVolumeM3 * 1000;
  // 100%
  // age percentage = 0 = no air left..
  agePercentage = minAgePercentage + ((maxAgePercentage - minAgePercentage) * agePercentage);
  const airVolume = (originalVolume * agePercentage) / pressure;
  // the original volume of the rubber will not decrease, only the air.
  const originalRubberVolume = originalVolume * (1 - maxAgePercentage);
  return airVolume + originalRubberVolume;
}

export function CalculateSuit({
  area, thickness, underwearThickness, maxAirPercentage, minAirPercentage, agePercentage,
}, pressure) {
  const mass = CalculateNeopreneMass(area,
    thickness,
    maxAirPercentage);
  const volume = CalculateAgedNeopreneVolumeAtDepth(area,
    thickness,
    agePercentage / 100,
    maxAirPercentage,
    minAirPercentage,
    pressure) + (area * underwearThickness);
  return { mass, volume };
}
export const WeightItems = [
  {
    name: 'Finns (recreational)',
    weight: 1,
    material: 'plastic',
  },
  {
    name: 'Apeks RK3 Finns (tech)',
    weight: 2.2,
    material: 'rubberHard',
  },
  {
    name: 'Apeks First Stage',
    weight: 0.5,
    material: 'steel',
  },
  {
    name: 'Backplate 6mm',
    weight: 4.5,
    material: 'steel',
  },
  {
    name: 'Backplate 3mm',
    weight: 2.3,
    material: 'steel',
  },
  {
    name: 'Backplate 3mm',
    weight: 0.8,
    material: 'aluminum',
  },
  {
    name: 'Single tank adapter',
    weight: 0.7,
    material: 'steel',
  },
  {
    name: 'Single tank adapter',
    weight: 0.2,
    material: 'aluminum',
  },
  {
    name: 'Lead',
    weight: 2,
    material: 'lead',
  },
];
