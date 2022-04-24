import Vue from './src/index'

Vue.component('child', {
  data() {
    return {
      count: 1,
    }
  },
  template: '<div>child component{{ count }}</div>',
})
Vue.component('childtwo', {
  data() {
    return {
      count: 3,
    }
  },
  template: '<div>child component{{ count }}</div>',
})
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
      // this.age = this.age + 1
      console.log(value, 'handleClick')
      console.log(this)
    },
  },
})

export default vm
