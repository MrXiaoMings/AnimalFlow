const path = require('path')
let rootPath = process.env.NODE_ENV === 'production' ? path.join(__dirname, 'static') : '/static'
let projectNames = {
  shuzun_ta: 1,
  shuju_lian: 2
}
let projectName = projectNames.shuzun_ta
console.log('__dirname', path.join(__dirname, '/dist/static'))
module.exports = {
  rootPath: rootPath,
  projectName: projectName,
  isShuzunta () {
    return projectName === projectNames.shuzun_ta
  },
  login: {
    defaultLink: `${rootPath}/html/${projectName === projectNames.shuzun_ta
      ? 'engine-manage.html'
      : 'data-process.html'}`,
    path: `${rootPath}/html/login.html`// ${window ? link = window.location.pathname : ''}
  },
  getQueryParams: (url) => {
    url = url || location.search // 获取url中"?"符后的字串
    let theRequest = {}
    if (url.indexOf('?') !== -1) {
      let str = url.substr(1)
      let strs = str.split('&')
      for (let i = 0; i < strs.length; i++) {
        theRequest[strs[i].split('=')[0]] = decodeURIComponent(strs[i].split('=')[1])
      }
    }
    return theRequest
  }
}
