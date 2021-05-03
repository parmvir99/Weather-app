<template lang="pug">
div
  div.weatherApp.PleaseWait(v-if="loading")
    h1 Please wait, We're fetching Weather informtion for you.
    b-img(:src="pleaseWait").mx-auto
  div.weatherApp.notFound(v-if="hasError")
    h1 Sorry, {{ selectedCity }} not found in our weather api.
    b-img(:src="cityNotFound").mx-auto.p-5
    button.btn.btn-primary(@click="resetApp") Reload App
  div.weatherApp(v-if="weatherInfo && weatherInfo[selectedCity] && !loading")
    b-card(no-body).col-xl-6.col-lg-8.px-0.mx-auto.border-0
      div.weather
        b-img(:src="city").w-100.position-relative
        div.weatherInfo.p-3.text-white
          moonSunRainClouds(:weather="weatherToday.weather[0].main", :currentTime="checkTime", v-if="weatherToday && weatherToday.dt_txt && weatherToday.weather[0].main")

          div.d-flex.align-items-center.justify-content-between
            div.search
              autocomplete(
                placeholder="Search City.."
                :url="apiSearchUrl",
                :customHeaders="searchHeaders",
                anchor='name',
                label='city',
                :on-select='getData',
                param="namePrefix",
                :customParams="{countryIds: 'jp'}",
                :process="mapData",
                :min="3",
                :debounce="500"
              )
              b-icon(icon="search")

            div.degrees
              b-form-checkbox(v-model='degrees' name='check-button' switch size="lg")
               span.deg-f °F
               span.deg-c °C

          div.text-center.mt-3
            div.today
              p.mb-1(v-if="weatherToday && weatherToday.dt_txt") {{ weatherToday.dt_txt | formatDateTime('dddd hh:mm a') }}
              h4.locationName
               b-icon.mr-1(icon="geo-alt")
               | {{ weatherInfo[this.selectedCity].city.name }}
          div.info.text-right
            temperature(:current="weatherToday.main", :unit="selectedUnit.value")
            p.weather-wind {{ weatherToday.weather[0].description}} / {{ weatherToday.wind.speed }} {{ selectedUnit.value === 'imperial' ? 'mph' : 'm/s'}}
            p.sunrise.mb-0
              b-icon(icon="brightness-high-fill")
              | {{ weatherInfo[this.selectedCity].city.sunrise | formatUnix('hh:mm a') }}
            p.sunset
              b-icon(icon="brightness-alt-high-fill")
              | {{ weatherInfo[this.selectedCity].city.sunset | formatUnix('hh:mm a') }}

      div.days
        div.d-flex
          div(v-for="day in nextDays", :key="day.dt", v-if="day && day.weather && day.weather[0]", @click="updateSelectedDate(day.dt_txt)", :class="[ isTodaySelected(day.dt_txt) ? 'highlighted' : '' ]").day.col.text-center.py-3
            p.font-weight-bold {{ day.dt_txt | formatDateTime('ddd') }}
            font-awesome-icon.h3(:icon="_weatherIcon(day.weather[0].main)")
            temperature(:current="day.main", :unit="selectedUnit.value")
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import { filter } from 'lodash/collection'
import temperature from '@/components/temperature'
import moonSunRainClouds from '@/components/moonSunRainClouds'
const WEATHER_API_URL = process.env.VUE_APP_WEATHER_API_URL
const WEATHER_API_KEY = process.env.VUE_APP_WEATHER_API_KEY
const GEO_URL = process.env.VUE_APP_GEO_API_URL
export default {
  name: 'weatherApp',
  data () {
    return {
      city: require(`@/assets/images/city.png`),
      cityNotFound: require(`@/assets/images/cityNotFound.png`),
      pleaseWait: require(`@/assets/images/pleaseWait.png`),
      degrees: false,
      units: [{ name: 'Metric (Celsius)', value: 'metric' }, { name: 'Imperial (Fahrenheit)', value: 'imperial' }],
      selectedUnit: null,
      countryCode: 'JP',
      selectedCity: 'Tokyo',
      weatherInfo: {},
      results: [],
      selectedDate: null,
      todayDate: null,
      searchHeaders: {
        'x-rapidapi-key': '43360c8191msha18425ce90231e9p18a20cjsn84daa587c0fa',
        'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com',
        useQueryString: true
      },
      apiSearchUrl: `${GEO_URL}/geo/cities`,
      hasError: false,
      loading: false
    }
  },
  components: {
    temperature,
    moonSunRainClouds
  },
  watch: {
    selectedCity () {
      this.init()
    },
    degrees (newValue) {
       if (newValue === true) {
        this.degrees === 1
        this.selectedUnit = this.units[1]
        this.init()
      } else {
        this.degrees === 0
        this.selectedUnit = this.units[0]
        this.init()
      }
    }
  },
  computed: {
    checkTime () {
      return moment(this.weatherToday.dt_txt).format("HH") >= 18
    },
    nextDays () {
      let list = this.weatherInfo[this.selectedCity].list
      let ctr = 0
      let current = filter(list, (val) => {
        if (ctr < list.length) {
          if ((list.length-1) > ctr) ctr++
          let myDate = moment(val.dt_txt).format('YYYY-MM-DD')
          let nextItem = list[ctr]
          let before = moment(val.dt_txt)
          let after = moment(nextItem.dt_txt)
          let today = moment(`${myDate} ${moment().format('HH:mm:ss')}`)
          if (today.isBetween(before, after)) {
            return val
          }
        }
      })
      return current
    },
    getTodayData () {
      return filter(this.weatherInfo[this.selectedCity].list, (val) => {
        return moment(val.dt_txt).format('MMMM DD, YYYY') === this.todayDate
      })
    },
    weatherToday () {
      let ctr = 0
      let myWeather = filter(this.getTodayData, (val) => {
        ctr += 1
        if (ctr < this.getTodayData.length) {
          let before = moment(val.dt_txt)
          let next = this.getTodayData[ctr]
          let after = moment(next.dt_txt)
          let today = moment(this.selectedDate)
          if (today.isBetween(before, after)) {
            return val
          }
        } else {
          return this.getTodayData[this.getTodayData.length - 1]
        }
      })
      return (myWeather && myWeather.length > 0 ? myWeather[0] : null)
    }
  },
  methods: {
    mapData (results) {
      return results.data
    },
    getData(obj){
      this.loading = true
      this.selectedCity = obj.city
    },
    resetApp () {
      this.selectedCity = 'Tokyo'
      this.init()
    },
    init () {
      this.hasError = false
      let instance = axios.create()
      let vm = this
      instance.defaults.headers.common = {}
      instance.get(`${WEATHER_API_URL}?q=${vm.selectedCity},${this.countryCode}&units=${vm.selectedUnit.value}&appid=${WEATHER_API_KEY}`).then((res) => {
        vm.$set(vm.weatherInfo, vm.selectedCity, res.data)
      setTimeout(()  => {
        this.loading = false
      }, 1000)
      }).catch((e) => {
        this.loading = false
        this.hasError = true
        console.log(`ERR`, e)
      })
    },
    updateSelectedDate (value) {
      this.todayDate = moment(value).format('MMMM DD, YYYY')
      this.selectedDate = moment(value).format('YYYY-MM-DD HH:01:ss')
    },
    isTodaySelected (val) {
      return moment(val).format('ddd') === moment(this.weatherToday.dt_txt).format('ddd')
    }
  },
  mounted () {
    this.todayDate = moment().format('MMMM DD, YYYY')
    this.selectedDate = moment().format('YYYY-MM-DD HH:mm:ss')
    this.selectedUnit = this.units[0]
    this.init()
  }
}
</script>
