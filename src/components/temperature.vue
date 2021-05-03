<template lang="pug">
  div
    span.my-0(v-if="unit === 'metric'") {{ current.temp }} °C
    span.my-0(v-if="unit === 'imperial'") {{ current.temp }} °F
</template>

<script>
export default {
  name: 'temperature-component',
  props: {
    unit: {
      required: true,
      type: String,
      default: 'metric'
    },
    current: {
      required: true,
      type: Object
    }
  }
}
</script>

<style lang="css" scoped>
</style>
