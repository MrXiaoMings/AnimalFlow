import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
const AnimalContainer = resolve => require(['../AnimalContainer.vue'], resolve)
const AnimalFlow = resolve => require(['../AnimalFlow.vue'], resolve)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'animal',
      component: AnimalContainer,
      children: [
        {
          path: '/',
          redirect: 'animal-flow'
        },
        {
          path: 'animal-flow',
          name: 'animal-flow',
          component: AnimalFlow
        }
      ]
    }
  ]
})
