import * as types from '../../store/types'

const state = {
  dataProcess: {
    taskDetail: {
      prop: 'createTime',
      order: 'descending'
    },
    taskList: {
      prop: 'updated',
      order: 'descending'
    }
  },
  dataAccess: {
    list: {
      prop: 'updated',
      order: 'descending'
    },
    charging: {
      prop: 'reqDate',
      order: 'descending'
    },
    apiDetail: {
      prop: 'requestTime',
      order: 'descending'
    }
  },
  flowManage: {
    list: {
      prop: 'updateTime',
      order: 'descending'
    },
    version: {
      prop: 'createTime',
      order: 'descending'
    },
    versionResult: {
      prop: 'executeTime',
      order: 'descending'
    }
  },
  snapshotList: {
    list: {
      prop: 'deploy_time',
      order: 'desc'
    }
  }
}

const getters = {
  taskDetailSort: state => state.dataProcess.taskDetail,
  taskListSort: state => state.dataProcess.taskList,
  dataAccessListSort: state => state.dataAccess.list,
  dataAccessChargingSort: state => state.dataAccess.charging,
  dataAccessApiDetailSort: state => state.dataAccess.apiDetail,
  flowMangeListSort: state => state.flowManage.list,
  flowVersionListSort: state => state.flowManage.version,
  flowVersionResultSort: state => state.flowManage.versionResult,
  snapshotListSort: state => state.snapshotList.list
}

const actions = {
  updateConnTaskDetailSort ({commit, state}, sort) {
    commit(types.DATA_PROCESS_TASK_DETAIL_SORT, sort)
  },
  updateConnTaskListSort ({commit, state}, sort) {
    commit(types.DATA_PROCESS_TASK_LIST_SORT, sort)
  },
  updateDataAccessListSort ({commit, state}, sort) {
    commit(types.DATA_ACCESS_LIST_SORT, sort)
  },
  updateDataAccessChargingSort ({commit, state}, sort) {
    commit(types.DATA_ACCESS_CHARGING_SORT, sort)
  },
  updateDataAccessApiDetailSort ({commit, state}, sort) {
    commit(types.DATA_ACCESS_API_DETAIL_SORT, sort)
  },
  updateFLowManageListSort ({commit, state}, sort) {
    commit(types.FLOW_MANAGE_LIST_SORT, sort)
  },
  updateFLowVersionListSort ({commit, state}, sort) {
    commit(types.FLOW_VERSION_LIST_SORT, sort)
  },
  updateFlowVersionResultSort ({commit, state}, sort) {
    commit(types.FLOW_VERSION_RESULT_SORT, sort)
  },
  updateSnapshotListSort ({commit, state}, sort) {
    commit(types.SNAPSHOT_LIST_SORT, sort)
  },
}

const mutations = {
  [types.DATA_PROCESS_TASK_DETAIL_SORT] (state, sort) {
    state.dataProcess.taskDetail = sort
  },
  [types.DATA_PROCESS_TASK_LIST_SORT] (state, sort) {
    state.dataProcess.taskList = sort
  },
  [types.DATA_ACCESS_LIST_SORT] (state, sort) {
    state.dataAccess.list = sort
  },
  [types.DATA_ACCESS_CHARGING_SORT] (state, sort) {
    state.dataAccess.charging = sort
  },
  [types.DATA_ACCESS_API_DETAIL_SORT] (state, sort) {
    state.dataAccess.apiDetail = sort
  },
  [types.FLOW_MANAGE_LIST_SORT] (state, sort) {
    state.flowManage.flowList = sort
  },
  [types.FLOW_VERSION_LIST_SORT] (state, sort) {
    state.flowManage.version = sort
  },
  [types.FLOW_VERSION_RESULT_SORT] (state, sort) {
    state.flowManage.versionResult = sort
  },
  [types.SNAPSHOT_LIST_SORT] (state, sort){
    state.snapshotList.list = sort
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}

