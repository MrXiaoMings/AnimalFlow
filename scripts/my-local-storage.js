export default {
  clear() {
    window.localStorage.clear();
  },
  getItem: function (module, key) {
    let itemStr = window.localStorage.getItem(module);
    if (itemStr) {
      let item = JSON.parse(itemStr);
      if (key in item) {
        return item[key];
      }
    }
    return null;
  },
  deleteItem: function (module, key) {
    let itemStr = window.localStorage.getItem(module);
    if (itemStr) {
      let item = JSON.parse(itemStr);
      delete item[key];
      window.localStorage.setItem(module, JSON.stringify(item));
    }
  },
  mergeItem: function (module, key, value) {
    let itemStr = window.localStorage.getItem(module);
    let item = {};
    if (itemStr) {
      item = JSON.parse(itemStr);
    }
    item[key] = value;
    window.localStorage.setItem(module, JSON.stringify(item));
  }
}
