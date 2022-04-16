import Vue from './src/index'

let vm = new Vue({
  el: '#app',
  data() {
    return {
      name: 'lqm',
      age: 26,
      aa: [
        { key: 1, value: 1 },
        { key: 2, value: 2 },
      ],
      IfShow: true,
      classStyle: 'stylevalue',
    }
  },
  methods: {
    handleClick(value) {
      this.aa.push({ key: 45, value: 45 })
      this.age = 46
      console.log(value, 'handleClick')
      console.log(this)
    },
  },
})
