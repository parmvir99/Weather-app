<template lang="pug">
  div
    div.rain(v-if="weather === 'Rain'")
      div(v-for="n in 250", :key="n")
        svg.rain__drop(
          preserveAspectRatio="xMinYMin", viewBox='0 0 5 50',
          :style="{'--x':` ${Math.floor(Math.random() * 100)}`, '--y': `${Math.floor(Math.random() * 100)}`, '--o': `${Math.random()}`, '--a': `${Math.random() + 0.5}`, '--d': `${(Math.random() * 2) - 1}`, '--s': `${Math.random()}`}"
           )
          path(stroke='none', d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z")
    div.sun-moon(v-else)
      b-img(:src="sun", width="50" v-if="!currentTime")
      b-img(:src="moon", width="50" v-else)
    div.clouds
      b-img(:src="cloud", v-for="n in 5", :key="n", :class=`'cloud-img-'+ n`, :style="{ width: `${Math.floor(Math.random() * 100 + 50)}px`, top: `${Math.floor(Math.random() * 150 + 10)}px`, left: `${Math.floor(Math.random() * 800 + 0)}px`}")
</template>
<script>
export default {
  name: 'moon-sun-rain-clouds',
  props: {
    weather: {
      required: true,
      type: String
    },
    currentTime: {
      required: true,
      type: Boolean
    }
  },
  data () {
    return {
      cloud: require(`@/assets/images/cloud.png`),
      sun: require(`@/assets/images/sun.png`),
      moon: require(`@/assets/images/moon.png`)
    }
  }
}
</script>
