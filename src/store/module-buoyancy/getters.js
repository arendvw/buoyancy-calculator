import * as math from '../../math';

export function isSalinityFresh(state) {
  return state.salinity === 'fresh';
}

export function currentWaterDensity(state) {
  return state.salinity === 'fresh' ? math.DensityFreshWater : math.DensitySaltwater;
}
export function personalBuoyancy(state) {
  return (isFresh) => {
    const obj = math.CalculateLungCapacity(state.gender === 'male', state.age,
      state.height / 100.0);
    const volume = obj.functionalResidualCapacity + math.TidalVolume;
    return math.CalculateWeightFromFatPercentage(
      state.weight,
      state.fatPercentage / 100,
      volume,
      isFresh ? math.DensityFreshWater : math.DensitySaltwater,
    );
  };
}
