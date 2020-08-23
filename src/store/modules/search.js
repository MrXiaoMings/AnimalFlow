import * as types from '../../store/types'

const state = {
  dataProcess: {
    taskDetail: {
      searchKey: '',
      statusType: 0,
      beforeTime: (() => {
        let d = new Date()
        return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59)
      })()
    },
    taskList: {
      searchKey: '',
      filter: [2, 1, 0, 7, 6, 3, 4, 5],
    }
  },
  dataAccess: {
    list: {
      searchKey: '',
      filter: [],
    },
    charging: {
      companyNo: '',
      apiNo: '',
      dateRange: (() => {
        let end = new Date()
        let start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000)
        return [start, end]
      })()
    },
    apiDetail: {
      searchKey: '',
      apiNo: '',
      companyNo: '',
      statusType: '',
      dateRange: (() => {
        let end = new Date()
        let start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000)
        return [start, end]
      })()
    }
  },
  snapShotManage: {
    decisionResultOverview: {
      dateRange: (() => {
        let d = new Date()
        return [new Date(d.getTime() - 14 * 24 * 60 * 60 * 1000), d]//默认14D
      })()
    }
  },
  engineManage: {
    decisionResultList: {
      searchKey: '',
      dateRange: (() => {
        let d = new Date()
        return [d, d]//默认1D
      })(),
      requestType: '',
      status: ''
    }
  },
  monitorReport: {
    engineMonitorReport: {
      engineId: '',
      snapshotId: '',
      dateRange: (() => {
        let now = new Date().getTime()
        let startDate = new Date(now - 7 * 24 * 60 * 60 * 1000)
        let endDate = new Date(now)
        return [startDate, endDate]
      })(),
      classify: '',
      type: ''
    },
    businessMonitorReport: {
      classify: '',
      secondClassify: '',
      type: '',
      dateRange: [],
      dimension: ''
    }
  },
  alarmManage: {
    list: {
      alarmType: '',
      alarmState: '',
      searchKey: '',
      userId: '',
      selectedRow: {}
    }
  },
  flowManage: {
    flowList: {
      searchKey: ''
    },
    version: {
      searchKey: '',
      statusType: 0
    },
    versionResult: {
      flowVersionName: 0,
      status: 0,
      dateRange: (() => {
        let end = new Date()
        end.setHours(23)
        end.setMinutes(59)
        end.setSeconds(0)
        let start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000)
        start.setHours(0)
        start.setMinutes(0)
        start.setSeconds(0)
        return [start.getTime(), end.getTime()]
      })(),
      searchKey: ''
    }
  }
}

const getters = {
  taskDetailSearch: state => state.dataProcess.taskDetail,
  taskListSearch: state => state.dataProcess.taskList,
  dataAccessListSearch: state => state.dataAccess.list,
  dataAccessChargingSearch: state => state.dataAccess.charging,
  dataAccessApiDetail: state => state.dataAccess.apiDetail,
  decisionResultOverviewSearch: state => state.snapShotManage.decisionResultOverview,
  decisionResultList: state => state.engineManage.decisionResultList,
  engineMonitorReport: state => state.monitorReport.engineMonitorReport,
  businessMonitorReport: state => state.monitorReport.businessMonitorReport,
  alarmManageList: state => state.alarmManage.list,
  flowMangeList: state => state.flowManage.flowList,
  flowVersionList: state => state.flowManage.version,
  flowVersionResult: state => state.flowManage.versionResult
}

const actions = {
  updateConnTaskDetailSearchKey ({commit, state}, searchKey) {
    commit(types.DATA_PROCESS_TASK_DETAIL_SEARCH_KEY, searchKey)
  },
  updateConnTaskDetailStatusType ({commit, state}, statusType) {
    commit(types.DATA_PROCESS_TASK_DETAIL_STATUS_TYPE, statusType)
  },
  updateConnTaskDetailBeforeTime ({commit, state}, beforeTime) {
    commit(types.DATA_PROCESS_TASK_DETAIL_BEFORE_TIME, beforeTime)
  },
  updateConnTaskListSearchKey ({commit, state}, searchKey) {
    commit(types.DATA_PROCESS_TASK_LIST_SEARCH_KEY, searchKey)
  },
  updateConnTaskListFilter ({commit, state}, filter) {
    commit(types.DATA_PROCESS_TASK_LIST_FILTER, filter)
  },
  updateDataAccessListSearchKey ({commit, state}, searchKey) {
    commit(types.DATA_ACCESS_LIST_SEARCH_KEY, searchKey)
  },
  updateDataAccessChargingApiNo ({commit, state}, apiNo) {
    commit(types.DATA_ACCESS_CHARGING_API_NO, apiNo)
  },
  updateDataAccessChargingCompanyNo ({commit, state}, companyNo) {
    commit(types.DATA_ACCESS_CHARGING_COMPANY_NO, companyNo)
  },
  updateDataAccessApiDetailSearchKey ({commit, state}, searchKey) {
    commit(types.DATA_ACCESS_API_DETAIL_SEARCH_KEY, searchKey)
  },
  updateDataAccessApiDetailStatusType ({commit, state}, statusType) {
    commit(types.DATA_ACCESS_API_DETAIL_STATUS_TYPE, statusType)
  },
  updateDataAccessApiDetailDateRange ({commit, state}, dateRange) {
    commit(types.DATA_ACCESS_API_DETAIL_DATE_RANGE, dateRange)
  },
  updateDataAccessApiDetailApiNo ({commit, state}, apiNo) {
    commit(types.DATA_ACCESS_API_DETAIL_API_NO, apiNo)
  },
  updateDataAccessApiDetailCompanyNo ({commit, state}, companyNo) {
    commit(types.DATA_ACCESS_API_DETAIL_COMPANY_NO, companyNo)
  },
  updateDataAccessChargingDateRange ({commit, state}, dateRange) {
    commit(types.DATA_ACCESS_CHARGING_DATE_RANGE, dateRange)
  },
  updateDataAccessListFilter ({commit, state}, filter) {
    commit(types.DATA_ACCESS_LIST_FILTER, filter)
  },
  updateSnapShotManageDecisionResultOverviewDateRange ({commit, state,}, dateRange) {
    commit(types.SNAPSHOT_MANAGE_DECISION_RESULT_OVERVIEW_DATE_RANGE, dateRange)
  },
  updateEngineManageDecisionResultListDateRange ({commit, state}, dateRange) {
    commit(types.ENGINE_MANAGE_DECISION_RESULT_LIST_DATE_RANGE, dateRange)
  },
  updateEngineManageDecisionResultListSearchKey ({commit, state}, searchKey) {
    commit(types.ENGINE_MANAGE_DECISION_RESULT_LIST_SEARCH_KEY, searchKey)
  },
  updateEngineManageDecisionResultListRequestType ({commit, state}, requestType) {
    commit(types.ENGINE_MANAGE_DECISION_RESULT_LIST_REQUEST_TYPE, requestType)
  },
  updateEngineManageDecisionResultListStatus ({commit, state}, status) {
    commit(types.ENGINE_MANAGE_DECISION_RESULT_LIST_STATUS, status)
  },
  updateEngineMonitorReportEngineId ({commit, state}, engineId) {
    commit(types.MONITOR_REPORT_ENGINE_ENGINE_ID, engineId)
  },
  updateEngineMonitorReportSnapshotId ({commit, state}, snapshotId) {
    commit(types.MONITOR_REPORT_ENGINE_SNAPSHOT_ID, snapshotId)
  },
  updateEngineMonitorReportDateRange ({commit, state}, dateRange) {
    commit(types.MONITOR_REPORT_ENGINE_DATE_RANGE, dateRange)
  },
  updateEngineMonitorReportClassify ({commit, state}, classify) {
    commit(types.MONITOR_REPORT_ENGINE_CLASSIFY, classify)
  },
  updateEngineMonitorReportType ({commit, state}, type) {
    commit(types.MONITOR_REPORT_ENGINE_TYPE, type)
  },
  updateBusinessMonitorReportClassify ({commit, state}, classify) {
    commit(types.MONITOR_REPORT_BUSINESS_CLASSIFY, classify)
  },
  updateBusinessMonitorReportType ({commit, state}, type) {
    commit(types.MONITOR_REPORT_BUSINESS_TYPE, type)
  },
  updateBusinessMonitorReportDateRange ({commit, state}, dateRange) {
    commit(types.MONITOR_REPORT_BUSINESS_DATE_RANGE, dateRange)
  },
  updateBusinessMonitorReportDimension ({commit, state}, dimension) {
    commit(types.MONTIOR_REPORT_BUSINESS_DIMENSION, dimension)
  },
  updateAlarmManageListSearchKey ({commit, state}, searchKey) {
    commit(types.ALARM_MANAGE_LIST_SEARCH_KEY, searchKey)
  },
  updateAlarmManageListAlarmType ({commit, state}, alarmType) {
    commit(types.ALARM_MANAGE_LIST_ALARM_TYPE, alarmType)
  },
  updateAlarmManageListAlarmState ({commit, state}, alarmState) {
    commit(types.ALARM_MANAGE_LIST_ALARM_STATE, alarmState)
  },
  updateAlarmManageListUserId ({commit, state}, userId) {
    commit(types.ALARM_MANAGE_LIST_USER_ID, userId)
  },
  updateAlarmManageListSelectedRow ({commit, state}, selectedRow) {
    commit(types.ALARM_MANAGE_LIST_SELECTED_ROW, selectedRow)
  },
  updateFlowManageListSearchKey ({commit, state}, key) {
    commit(types.FLOW_MANAGE_LIST_SEARCH_KEY, key)
  },
  updateFlowVersionListSearchKey ({commit, state}, key) {
    commit(types.FLOW_VERSION_LIST_SEARCH_KEY, key)
  },
  updateFLowVersionListStatus ({commit, state}, status) {
    commit(types.FLOW_VERSION_LIST_STATUS, status)
  },
  updateFlowVersionResultDateRange ({commit, state}, dateRange) {
    commit(types.FLOW_VERSION_RESULT_DATE_RANGE, dateRange)
  },
  updateFlowVersionResultStatus ({commit, state}, status) {
    commit(types.FLOW_VERSION_RESULT_STATUS, status)
  },
  updateFlowVersionResultSearchKey ({commit, state}, key) {
    commit(types.FLOW_VERSION_RESULT_SEARCH_KEY, key)
  },
  updateFlowVersionResultFlowVersionName ({commit, state}, flowVersionName) {
    commit(types.FLOW_VERSION_RESULT_FLOW_VERSION_NAME, flowVersionName)
  }
}

const mutations = {
  [types.DATA_PROCESS_TASK_DETAIL_SEARCH_KEY] (state, searchKey) {
    state.dataProcess.taskDetail.searchKey = searchKey
  },
  [types.DATA_PROCESS_TASK_DETAIL_STATUS_TYPE] (state, taskDetailStatusType) {
    state.dataProcess.taskDetail.statusType = taskDetailStatusType
  },
  [types.DATA_PROCESS_TASK_DETAIL_BEFORE_TIME] (state, taskDetailBeforeTime) {
    state.dataProcess.taskDetail.beforeTime = taskDetailBeforeTime
  },
  [types.DATA_PROCESS_TASK_LIST_SEARCH_KEY] (state, taskListSearchKey) {
    state.dataProcess.taskList.searchKey = taskListSearchKey
  },
  [types.DATA_PROCESS_TASK_LIST_FILTER] (state, filter) {
    state.dataProcess.taskList.filter = filter
  },
  [types.DATA_ACCESS_LIST_SEARCH_KEY] (state, searchKey) {
    state.dataAccess.list.searchKey = searchKey
  },
  [types.DATA_ACCESS_CHARGING_API_NO] (state, apiNo) {
    state.dataAccess.charging.apiNo = apiNo
  },
  [types.DATA_ACCESS_CHARGING_COMPANY_NO] (state, companyNo) {
    state.dataAccess.charging.companyNo = companyNo
  },
  [types.DATA_ACCESS_CHARGING_DATE_RANGE] (state, dateRange) {
    state.dataAccess.charging.dateRange = dateRange
  },
  [types.DATA_ACCESS_API_DETAIL_DATE_RANGE] (state, dateRange) {
    state.dataAccess.apiDetail.dateRange = dateRange
  },
  [types.DATA_ACCESS_API_DETAIL_STATUS_TYPE] (state, statusType) {
    state.dataAccess.apiDetail.statusType = statusType
  },
  [types.DATA_ACCESS_API_DETAIL_SEARCH_KEY] (state, searchKey) {
    state.dataAccess.apiDetail.searchKey = searchKey
  },
  [types.DATA_ACCESS_API_DETAIL_API_NO] (state, apiNo) {
    state.dataAccess.apiDetail.apiNo = apiNo
  },
  [types.DATA_ACCESS_API_DETAIL_COMPANY_NO] (state, companyNo) {
    state.dataAccess.apiDetail.companyNo = companyNo
  },
  [types.DATA_ACCESS_LIST_FILTER] (state, filter) {
    state.dataAccess.list.filter = filter
  },
  [types.SNAPSHOT_MANAGE_DECISION_RESULT_OVERVIEW_DATE_RANGE] (state, dateRange) {
    state.snapShotManage.decisionResultOverview.dateRange = dateRange
  },
  [types.ENGINE_MANAGE_DECISION_RESULT_LIST_DATE_RANGE] (state, dateRange) {
    state.engineManage.decisionResultList.dateRange = dateRange
  },
  [types.ENGINE_MANAGE_DECISION_RESULT_LIST_SEARCH_KEY] (state, searchKey) {
    state.engineManage.decisionResultList.searchKey = searchKey
  },
  [types.ENGINE_MANAGE_DECISION_RESULT_LIST_REQUEST_TYPE] (state, requestType) {
    state.engineManage.decisionResultList.requestType = requestType
  },
  [types.ENGINE_MANAGE_DECISION_RESULT_LIST_STATUS] (state, status) {
    state.engineManage.decisionResultList.status = status
  },
  [types.MONITOR_REPORT_ENGINE_ENGINE_ID] (state, engineId) {
    state.monitorReport.engineMonitorReport.engineId = engineId
  },
  [types.MONITOR_REPORT_ENGINE_SNAPSHOT_ID] (state, snapshotId) {
    state.monitorReport.engineMonitorReport.snapshotId = snapshotId
  },
  [types.MONITOR_REPORT_ENGINE_DATE_RANGE] (state, dateRange) {
    state.monitorReport.engineMonitorReport.dateRange = dateRange
  },
  [types.MONITOR_REPORT_ENGINE_CLASSIFY] (state, classify) {
    state.monitorReport.engineMonitorReport.classify = classify
  },
  [types.MONITOR_REPORT_ENGINE_TYPE] (state, type) {
    state.monitorReport.engineMonitorReport.type = type
  },
  [types.MONTIOR_REPORT_BUSINESS_DIMENSION] (state, dimension) {
    state.monitorReport.businessMonitorReport.dimension = dimension
  },
  [types.MONITOR_REPORT_BUSINESS_DATE_RANGE] (state, dateRange) {
    state.monitorReport.businessMonitorReport.dateRange = dateRange
  },
  [types.MONITOR_REPORT_BUSINESS_TYPE] (state, type) {
    state.monitorReport.businessMonitorReport.type = type
  },
  [types.MONITOR_REPORT_BUSINESS_CLASSIFY] (state, classify) {
    state.monitorReport.businessMonitorReport.classify = classify
  },
  [types.ALARM_MANAGE_LIST_ALARM_STATE] (state, alarmState) {
    state.alarmManage.list.alarmState = alarmState
  },
  [types.ALARM_MANAGE_LIST_ALARM_TYPE] (state, type) {
    state.alarmManage.list.alarmType = type
  },
  [types.ALARM_MANAGE_LIST_SEARCH_KEY] (state, searchKey) {
    state.alarmManage.list.searchKey = searchKey
  },
  [types.ALARM_MANAGE_LIST_USER_ID] (state, userId) {
    state.alarmManage.list.userId = userId
  },
  [types.ALARM_MANAGE_LIST_SELECTED_ROW] (state, selectedRow) {
    state.alarmManage.list.selectedRow = selectedRow
  },

  [types.FLOW_MANAGE_LIST_SEARCH_KEY] (state, searchKey) {
    state.flowManage.flowList.searchKey = searchKey
  },
  [types.FLOW_VERSION_LIST_STATUS] (state, status) {
    state.flowManage.version.statusType = status
  },
  [types.FLOW_VERSION_LIST_SEARCH_KEY] (state, key) {
    state.flowManage.version.searchKey = key
  },
  [types.FLOW_VERSION_RESULT_DATE_RANGE] (state, dateRange) {
    state.flowManage.versionResult.dateRange = dateRange
  },
  [types.FLOW_VERSION_RESULT_FLOW_VERSION_NAME] (state, flowVersionName) {
    state.flowManage.versionResult.flowVersionName = flowVersionName
  },
  [types.FLOW_VERSION_RESULT_SEARCH_KEY] (state, key) {
    state.flowManage.versionResult.searchKey = key
  },
  [types.FLOW_VERSION_RESULT_STATUS] (state, status) {
    state.flowManage.versionResult.status = status
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}

