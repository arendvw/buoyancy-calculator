/**
 * Set property of a person
 * @param state
 * @param weight
 * @param fatPercentage
 * @param fatPercentageManual
 * @param height
 * @param age
 * @param gender
 * @param enabled
 * @param units
 * @constructor
 */
export function SET_PERSON_PROPERTY(state, {
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
}) {
  if (weight !== undefined) {
    state.weight = weight;
  }
  if (fatPercentage !== undefined) {
    state.fatPercentage = fatPercentage;
  }
  if (fatPercentageManual !== undefined) {
    state.fatPercentageManual = fatPercentageManual;
  }
  if (height !== undefined) {
    state.height = height;
  }
  if (age !== undefined) {
    state.age = age;
  }
  if (gender !== undefined) {
    state.gender = gender;
  }
  if (enabled !== undefined) {
    state.enabled = enabled;
  }
  if (enabledBalancedStart !== undefined) {
    state.enabledBalancedStart = enabledBalancedStart;
  }
  if (enabledBalancedEnd !== undefined) {
    state.enabledBalancedEnd = enabledBalancedEnd;
  }
  if (isMetric !== undefined) {
    state.isMetric = isMetric;
  }
}

/**
 * Add a new wetsuit piece
 * @param state
 * @param type
 * @param label
 * @param thickness
 * @param agePercentage
 * @param area
 * @param isDry
 * @param minAirPercentage
 * @param maxAirPercentage
 * @param underwearThickness
 * @param hasNeoprene
 * @param enabled
 * @param enabledBalancedStart
 * @param enabledBalancedEnd
 * @constructor
 */
export function ADD_WETSUIT_PIECE(state, {
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
  enabled,
  enabledBalancedStart,
  enabledBalancedEnd,
}) {
  state.wetsuitPieces.push({
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
    enabled,
    enabledBalancedStart,
    enabledBalancedEnd,
  });
}

export function UPDATE_WETSUIT_PIECE(state, {
  index,
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
  enabled,
  enabledBalancedStart,
  enabledBalancedEnd,
}) {
  if (type !== undefined) {
    state.wetsuitPieces[index].type = type;
  }
  if (label !== undefined) {
    state.wetsuitPieces[index].label = label;
  }
  if (thickness !== undefined) {
    state.wetsuitPieces[index].thickness = thickness;
  }
  if (agePercentage !== undefined) {
    state.wetsuitPieces[index].agePercentage = agePercentage;
  }
  if (area !== undefined) {
    state.wetsuitPieces[index].area = area;
  }
  if (isDry !== undefined) {
    state.wetsuitPieces[index].isDry = isDry;
  }
  if (minAirPercentage !== undefined) {
    state.wetsuitPieces[index].minAirPercentage = minAirPercentage;
  }
  if (maxAirPercentage !== undefined) {
    state.wetsuitPieces[index].maxAirPercentage = maxAirPercentage;
  }
  if (underwearThickness !== undefined) {
    state.wetsuitPieces[index].underwearThickness = underwearThickness;
  }
  if (hasNeoprene !== undefined) {
    state.wetsuitPieces[index].hasNeoprene = hasNeoprene;
  }
  if (enabled !== undefined) {
    state.wetsuitPieces[index].enabled = enabled;
  }
  if (enabledBalancedStart !== undefined) {
    state.wetsuitPieces[index].enabledBalancedStart = enabledBalancedStart;
  }
  if (enabledBalancedEnd !== undefined) {
    state.wetsuitPieces[index].enabledBalancedEnd = enabledBalancedEnd;
  }
}

/**
 * TODO: Replace with guid based stuff? This could go wrong with ajax based stuff
 * @param state
 * @param index
 * @constructor
 */
export function DELETE_WETSUIT_PIECE(state, index) {
  state.wetsuitPieces.splice(index, 1);
}

export function ADD_TANK(state, {
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
  state.tanks.push({
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
export function UPDATE_TANK(state, {
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
  if (volume !== undefined) {
    state.tanks[index].volume = volume;
  }
  if (material !== undefined) {
    state.tanks[index].material = material;
  }
  if (density !== undefined) {
    state.tanks[index].density = density;
  }
  if (workingPressure !== undefined) {
    state.tanks[index].workingPressure = workingPressure;
  }
  if (configuredPressure !== undefined) {
    state.tanks[index].configuredPressure = configuredPressure;
  }
  if (weight !== undefined) {
    state.tanks[index].weight = weight;
  }
  if (gasMixture !== undefined) {
    state.tanks[index].gasMixture = gasMixture;
  }
  if (isDouble !== undefined) {
    state.tanks[index].isDouble = isDouble;
  }
  if (includeValve !== undefined) {
    state.tanks[index].includeValve = includeValve;
  }
  if (enabled !== undefined) {
    state.tanks[index].enabled = enabled;
  }
  if (enabledBalancedStart !== undefined) {
    state.tanks[index].enabledBalancedStart = enabledBalancedStart;
  }
  if (enabledBalancedEnd !== undefined) {
    state.tanks[index].enabledBalancedEnd = enabledBalancedEnd;
  }
}

export function DELETE_TANK(state, index) {
  state.tanks.splice(index, 1);
}

/**
 * TODO: Replace with guid based stuff? This could go wrong with ajax based stuff
 * @param state
 * @param salinity
 * @constructor
 */
export function UPDATE_SALINITY(state, salinity) {
  state.salinity = salinity;
}

export function ADD_WEIGHT_ITEM(state, {
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
  state.weightItems.push({
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
export function UPDATE_WEIGHT_ITEM(state, {
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
  if (volume !== undefined) {
    state.weightItems[index].volume = volume;
  }
  if (name !== undefined) {
    state.weightItems[index].name = name;
  }
  if (material !== undefined) {
    state.weightItems[index].material = material;
  }
  if (density !== undefined) {
    state.weightItems[index].density = density;
  }
  if (weight !== undefined) {
    state.weightItems[index].weight = weight;
  }
  if (buoyancyFreshWater !== undefined) {
    state.weightItems[index].buoyancyFreshWater = buoyancyFreshWater;
  }
  if (buoyancySaltWater !== undefined) {
    state.weightItems[index].buoyancySaltWater = buoyancySaltWater;
  }
  if (mode !== undefined) {
    state.weightItems[index].mode = mode;
  }
  if (enabled !== undefined) {
    state.weightItems[index].enabled = enabled;
  }
  if (enabledBalancedStart !== undefined) {
    state.weightItems[index].enabledBalancedStart = enabledBalancedStart;
  }
  if (enabledBalancedEnd !== undefined) {
    state.weightItems[index].enabledBalancedEnd = enabledBalancedEnd;
  }
}

export function DELETE_WEIGHT_ITEM(state, index) {
  state.weightItems.splice(index, 1);
}
