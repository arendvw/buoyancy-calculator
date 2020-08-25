export const DensityFreshWater = 1;
export const DensitySaltwater = 1.03;
export const DensityNeopreneLight = 150;
export const DensityNeopreneAverage = 200;
export const DensityNeopreneHeavy = 250;
export const VolumetricPercentageOfAirInNeoprene = 0.1;
/** Same for men and women, 0.5L */
export const TidalVolume = 0.5;

/**
 * Given it's volume and it's weight, how much does an object weigh underwater?
 * @param weight
 * @param displacementVolume
 * @param waterDensity
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
   *
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
 * @param bodySurfaceArea
 * @constructor
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
}
