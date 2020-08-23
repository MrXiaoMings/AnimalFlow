import * as types from '../../store/types'
import api from '../../scripts/api'
import store from '../index'

const state = {
  fields: null
}
console.log('fields')
const getters = {
  fields: (state) => {
    if (_.isNull(state.fields)) {
      store.dispatch('loadField')
    }
    return state.fields
  }
}

const actions = {
  loadField ({commit, state}, params) {
    let keyWord = (params && params.keyWord) || ''
    let engineId = (params && params.engineId) || ''
    api.field.getUnPage(keyWord, engineId).then(data => {
      commit(types.LOAD_FIELD, data)
    }).catch(error => {

    })
  }
}

const mutations = {
  [types.LOAD_FIELD] (state, data) {
    state.fields = data
    console.log(state.fileds)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}

