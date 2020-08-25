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
    age: 35,
    // weight in kg
    weight: 78,
    // gender = "female" / "male"
    gender: 'male',
    // height in cm
    height: 169,
    // fat percentage in 0-100
    fatPercentage: 24,
  };
}
