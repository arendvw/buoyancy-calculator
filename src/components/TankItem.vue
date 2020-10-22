<template>
  <q-page class="flex flex-center">
    <q-markup-table>
      <thead>
        <tr>
          <th>Tank volume</th>
          <th>Maximum bar</th>
          <th>Empty weight</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td></td>
        </tr>
      </tbody>
    </q-markup-table>
  </q-page>
</template>

<script>
export default {
  name: 'PageTank',
  params: {
    // [Volume] [VolumeUnit] [Material] [manufacturer]
    manufacturer: {
      type: String,
      required: true,
    },
    material: {
      type: String,
      required: true,
    },
    isDouble: {
      type: Boolean,
      required: true,
      default: false,
    },
    // bar
    maxPressure: {
      type: Number,
      required: true,
    },
    isMetric: {
      type: Boolean,
      required: true,
      default: true,
    },
    // liters
    airVolume: {
      type: Number,
      required: true,
    },
    valveWeight: {
      type: Number,
      required: true,
    },
    // kg
    weight: {
      type: Number,
      required: true,
    },
    // kg/m3
    density: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      tanks: [],
    };
  },
};
</script>
