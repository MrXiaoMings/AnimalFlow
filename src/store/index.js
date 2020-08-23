import Vue from 'vue'
import Vuex from 'vuex'
import loading from './modules/loading'
import saving from './modules/saving'
import pagination from './modules/pagination'
import search from './modules/search'
import sort from './modules/sort'
import field from './modules/fields'
import communication from './modules/communication'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    loading,
    saving,
    pagination,
    search,
    sort,
    field,
    communication
  },
  strict: debug,
  plugins: []
})
