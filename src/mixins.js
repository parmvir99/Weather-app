export default {
  methods: {
    _weatherIcon (type) {
      switch (type.toLowerCase()) {
        case 'clouds':
          return 'cloud'
        case 'clear':
          return 'cloud-sun'
        case 'rain':
          return 'cloud-rain'
        case 'sunny':
          return 'sun'
        case 'snow':
          return 'snowflake'
        default:
          return 'sun'
      }
    }
  }
}
