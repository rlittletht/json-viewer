var defaults = require('./options/defaults');
var merge = require('./merge');

var OLD_NAMESPACE = "options";
var NAMESPACE = "v2.options";

module.exports = {
  save: async function(obj) {
        await chrome.storage.local.set({ [NAMESPACE]: obj });
        var set1 = await chrome.storage.local.get([NAMESPACE]);
        console.log("set1: " + JSON.stringify(set1));
        set = await chrome.storage.local.get(NAMESPACE);
        console.log("set1: " + JSON.stringify(set1));
  },

  load: async function() {
      var resp = await chrome.storage.local.get([NAMESPACE]);

      var options = resp[NAMESPACE] || {};

//          optionsStr = "";
//    options = optionsStr ? JSON.parse(optionsStr) : {};
    options.theme = options.theme || defaults.theme;
    options.addons = options.addons ? JSON.parse(options.addons) : {};
    options.addons = merge({}, defaults.addons, options.addons)
    options.structure = options.structure ? JSON.parse(options.structure) : defaults.structure;
    options.style = options.style && options.style.length > 0 ? options.style : defaults.style;
    options.foldSummarizerData =
        options.foldSummarizerData ? JSON.parse(options.foldSummarizerData) : defaults.foldSummarizerData;
    return options;
  }
}
