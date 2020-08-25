export function SET_PERSON_PROPERTY(state, {
  weight,
  fatPercentage,
  height,
  age,
  gender,
}) {
  if (weight !== undefined) {
    state.weight = weight;
  }
  if (fatPercentage !== undefined) {
    state.fatPercentage = fatPercentage;
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
}
