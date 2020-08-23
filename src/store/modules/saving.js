const state = {
  saving: false
}

const getters = {
  saving: state => state.saving
}

const actions = {
  showSaving ({commit, state}) {
    commit('showSaving')
  },
  hideSaving ({commit, state}) {
    commit('hideSaving')
  }
}

const mutations = {
  showSaving (state) {
    state.saving = true
  },
  hideSaving (state) {
    state.saving = false
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
