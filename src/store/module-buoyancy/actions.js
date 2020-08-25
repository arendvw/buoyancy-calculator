export function setPersonProperty(context, {
  weight,
  fatPercentage,
  height,
  age,
  gender,
}) {
  context.commit('SET_PERSON_PROPERTY', {
    weight, fatPercentage, height, age, gender,
  });
}
