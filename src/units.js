export const feetToCm = 30.48;
export const feetToMeter = 0.3048;
export const inchToCm = 2.54;
export const feetToInch = 12;
export const poundsToKg = 2.2046226218;
export const psiToBar = 14.5038;
export const cuftToLiter = 28.3168;
export const cuinToLiter = 0.0163871;
export const lbsToLiter = 0.45359237;
export const barToAtmosphere = 1.01325;
export const kglToLbsCuft = 0.0160185;
// https://www.w3resource.com/javascript-exercises/javascript-math-exercise-10.php
function greatestCommonDenominator(x, y) {
  x = Math.abs(x);
  y = Math.abs(y);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

export function mmAsInchFraction(value) {
  // find the closest 8th fraction, then simplify the fraction
  const denominator = 16;
  const inches = value / (inchToCm * 10);
  const completeInch = Math.floor(inches);
  const fraction = inches - completeInch;
  const numerator = Math.round(fraction * denominator);
  const commonDemoninator = greatestCommonDenominator(numerator, denominator);
  const newNumerator = numerator / commonDemoninator;
  const newDenominator = denominator / commonDemoninator;
  if (newNumerator < 1 / denominator) {
    if (completeInch > 0) {
      return `${completeInch}`;
    }
    return '0';
  }
  if (completeInch > 0) {
    return `${completeInch} ${newNumerator}/${newDenominator}`;
  }
  return `${newNumerator}/${newDenominator}`;
}

export const units = {
  weight: {
    fromMetric(value) {
      return (parseFloat(value) * poundsToKg);
    },
    toMetric(value) {
      return parseFloat(value) / poundsToKg;
    },
  },
  pressure: {
    fromMetric(value) {
      return (parseFloat(value) * psiToBar);
    },
    toMetric(value) {
      return parseFloat(value) / psiToBar;
    },
  },
};
