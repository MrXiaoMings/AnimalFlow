const state = {
  loading: false
};

const getters = {
  loading: state => state.loading
};

const actions = {
  showLoading({commit, state}) {
    commit('showLoading')
  },
  hideLoading({commit, state}) {
    commit('hideLoading')
  }
};

const mutations = {
  showLoading(state) {
    state.loading = true
  },
  hideLoading(state) {
    state.loading = false
  }
};

export default {
  state,
  getters,
  actions,
  mutations
}
