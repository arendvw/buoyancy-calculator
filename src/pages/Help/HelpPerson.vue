<template>
  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
    <div>
      <h1>Personal buoyancy</h1>
      Estimate your personal buoyancy. How much will you float? How much will you sink?

      <h2>Gender</h2>
      Gender is used to estimate your lung volume. Women generally have smaller lungs.
      <h2>Age</h2>
      We will use your age to estimate your lung volume.
      <h2>Length</h2>
      We will use your age to estimate your lung volume, and to estimate your BSA
      (Body Surface Area)
      <h2>Weight</h2>
      Your weight is used to estimate your density, and to estimate your BSA (Body Surface Area)
      <h2>Fat percentage</h2>
      Fatty body mass is estimated to weigh around 0.9 kg/L (floats), whereas
      fat-free mass weighs around 1.1kg/L (sinks).
      There are several methods to measure body fat:
      - Caliper
      - Bioelectric impendance
      - https://www.calculator.net/body-fat-calculator.html

      Any literature on body composition will tell you that it's hard to get a precise body
      fat measurement, and how drinking a glass of water can influence your body composition.
      The goal of this model is not to calculate your buoyancy to several percent points accurately,
      but to create a mathematical and mental model that can show the relative influence of
      different factors in buoyancy.

      <h1>Technical details</h1>

      The lung volume is estimated using the method described by
      <a href="https://erj.ersjournals.com/content/6/Suppl_16/5">
      Quanjer et al, 1993</a>, <a href="https://erj.ersjournals.com/content/6/Suppl_16/5.figures-only">Table 6</a>
      <blockquote>
        The equations apply to men and females of European descent, aged 18–70 yr;
        between 18 and 25 yr an age of 25 yr is to be entered into the various equations since
        in cross-sectional studies there is little if any change in ventilatory function in this
        age range. The equations were derived from a height range of 1.55–1.95 m in men,
        and 1.45–1.80 m in females.
      </blockquote>
      <a href="https://erj.ersjournals.com/content/6/Suppl_16/5.figures-only">Table 7</a> mentions a range of
      5 - 13% decrease in FVC and FRC for other other ethnic groups. These problems have also
      been addressed more accurately in <a href="https://erj.ersjournals.com/content/40/6/1324">Quanjer et al, 2012</a>
      At this time, lower accuracy is preferred over
      increased complexity and privacy problems.

      <h3>Body density</h3>
      Body density is calculated using <a href="https://escholarship.org/uc/item/6mh9f4nf">Siri's method</a>.

      <h3>Body volume</h3>
      Body volume is calculated using (bodyWeight / bodyDensity) + lungVolume

      <h3>Buoyancy</h3>
      Your buoyancy is calculated using: (waterDensity - bodyDensity) * bodyVolume
  </div>
</template>

<script>
export default {
  name: 'Error404',
};
</script>
