export function setPersonProperty(context, {
  weight,
  fatPercentage,
  fatPercentageManual,
  height,
  age,
  gender,
  enabled,
  enabledBalancedStart,
  enabledBalancedEnd,
  isMetric,
  buoyancyAdjustment,
}) {
  context.commit('SET_PERSON_PROPERTY', {
    weight,
    fatPercentage,
    fatPercentageManual,
    height,
    age,
    gender,
    enabled,
    isMetric,
    enabledBalancedStart,
    enabledBalancedEnd,
    buoyancyAdjustment,
  });
}
export function addWetsuitPiece(context, {
  type,
  label,
  thickness,
  agePercentage,
  area,
  isDry,
  minAirPercentage,
  maxAirPercentage,
  underwearThickness,
  hasNeoprene,
}) {
  context.commit('ADD_WETSUIT_PIECE', {
    type,
    label,
    thickness,
    agePercentage,
    area,
    isDry,
    minAirPercentage,
    maxAirPercentage,
    underwearThickness,
    hasNeoprene,
    enabledBalancedStart: true,
    enabledBalancedEnd: true,
    enabled: true,
  });
}

export function updateWetsuitPiece(context, {
  type,
  label,
  thickness,
  agePercentage,
  area,
  index,
  isDry,
  minAirPercentage,
  maxAirPercentage,
  underwearThickness,
  hasNeoprene,
  enabled,
  enabledBalancedStart,
  enabledBalancedEnd,
}) {
  context.commit('UPDATE_WETSUIT_PIECE', {
    type,
    label,
    thickness,
    agePercentage,
    area,
    index,
    isDry,
    minAirPercentage,
    maxAirPercentage,
    underwearThickness,
    hasNeoprene,
    enabled,
    enabledBalancedStart,
    enabledBalancedEnd,
  });
}

export function deleteWetsuitPiece(context, index) {
  context.commit('DELETE_WETSUIT_PIECE', index);
}

export function addTank(context, {
  volume,
  material,
  density,
  workingPressure,
  configuredPressure,
  weight,
  gasMixture,
  isDouble,
  includeValve,
}) {
  context.commit('ADD_TANK', {
    volume,
    material,
    density,
    workingPressure,
    configuredPressure,
    weight,
    gasMixture,
    isDouble,
    includeValve,
    enabled: true,
    enabledBalancedStart: true,
    enabledBalancedEnd: true,
  });
}

export function updateTank(context, {
  index,
  volume,
  material,
  density,
  workingPressure,
  configuredPressure,
  weight,
  gasMixture,
  isDouble,
  includeValve,
  enabled,
  enabledBalancedStart,
  enabledBalancedEnd,
}) {
  context.commit('UPDATE_TANK', {
    index,
    volume,
    material,
    density,
    workingPressure,
    configuredPressure,
    weight,
    gasMixture,
    isDouble,
    includeValve,
    enabled,
    enabledBalancedStart,
    enabledBalancedEnd,
  });
}

export function deleteTank(context, index) {
  context.commit('DELETE_TANK', index);
}

export function updateSalinity(context, salinity) {
  context.commit('UPDATE_SALINITY', salinity);
}

export function addWeightItem(context, {
  name,
  volume,
  material,
  density,
  weight,
  buoyancyFreshWater,
  buoyancySaltWater,
  mode,
}) {
  context.commit('ADD_WEIGHT_ITEM', {
    name,
    volume,
    material,
    density,
    weight,
    buoyancyFreshWater,
    buoyancySaltWater,
    mode,
    enabled: true,
    enabledBalancedStart: true,
    enabledBalancedEnd: true,
  });
}

export function updateWeightItem(context, {
  index,
  name,
  volume,
  material,
  density,
  weight,
  buoyancyFreshWater,
  buoyancySaltWater,
  mode,
  enabled,
  enabledBalancedStart,
  enabledBalancedEnd,
}) {
  context.commit('UPDATE_WEIGHT_ITEM', {
    index,
    name,
    volume,
    material,
    density,
    weight,
    buoyancyFreshWater,
    buoyancySaltWater,
    mode,
    enabled,
    enabledBalancedStart,
    enabledBalancedEnd,
  });
}

export function deleteWeightItem(context, index) {
  context.commit('DELETE_WEIGHT_ITEM', index);
}
