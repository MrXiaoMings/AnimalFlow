import * as types from '../../store/types'
import * as pageNames from '../../scripts/page-name'
const generateState = (pageNames) => {
  const obj = {}
  Object.values(pageNames).map(item => {
    obj[item] = {
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30, 40, 50, 100]
    }
  })
  return obj
}
const state = {
  currentPageName: pageNames.TASK_DETAIL,
  ...generateState(pageNames)
}

const getters = {
  currentPageName: state => state.currentPageName,
  pagination: (state) => {
    console.log('------state-----')
    console.log(state)

    return state[state.currentPageName]
  }
}

const actions = {
  updateCurrentPageName({commit, state}, currentPageName) {
    commit(types.CURRENT_PAGE_NAME, currentPageName)
  },
  updatePageTotal({commit, state}, total) {
    commit(types.PAGE_TOTAL, total)
  },
  updatePageIndex({commit, state}, index) {
    commit(types.PAGE_INDEX, index)
  },
  updatePageSize({commit, state}, size) {
    commit(types.PAGE_SIZE, size)
  }
}

const mutations = {
  [types.CURRENT_PAGE_NAME](state, currentPageName) {
    state.currentPageName = currentPageName
  },
  [types.PAGE_TOTAL](state, total) {
    state[state.currentPageName].total = total
  },
  [types.PAGE_INDEX](state, pageIndex) {
    state[state.currentPageName].pageIndex = pageIndex
  },
  [types.PAGE_SIZE](state, pageSize) {
    state[state.currentPageName].pageSize = pageSize
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}

