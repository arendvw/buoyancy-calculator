/**
 * Default settings
 *
 * @returns {{
 * gender: null,
 * fatPercentage: null,
 * weight: null,
 * age: null,
 * height: null}}
 */
export default function () {
  return {
    // age in years
    // used for lung volume
    age: 35,
    // weight in kg
    // used for body surface area
    weight: 78,
    // gender = "female" / "male"
    // used for lung volume
    gender: 'male',
    // height in cm
    // used for lung volume and body surface area
    height: 185,
    enabled: true,
    // fat percentage in 0-100
    // used for personal buoyancy
    fatPercentage: 15,
    fatPercentageManual: false,
    salinity: 'fresh',
    wetsuitPieces: [],
    tanks: [],
    weightItems: [],
    bcdVolume: 20,
  };
}
