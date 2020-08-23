import * as types from '../../store/types'

const state = {
  flowTab: {
    key: 'flowDesignOpenedTab',
    backRouteName: 'flow-list'
  }
}

const getters = {
  flowTab: state => state.flowTab
}

const actions = {
  updateFlowTabKey ({commit, state}, key) {
    commit(types.FLOW_TAB_STORE_KEY, key)
  },
  updateFlowTabBackRouteName ({commit, state}, backRouteName) {
    commit(types.FLOW_TAB_BACK_ROUTE_NAME, backRouteName)
  }
}

const mutations = {
  [types.FLOW_TAB_BACK_ROUTE_NAME] (state, backRouteName) {
    state.flowTab.backRouteName = backRouteName
  },
  [types.FLOW_TAB_STORE_KEY] (state, key) {
    state.flowTab.key = key
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}

