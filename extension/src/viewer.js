require('./viewer-styles');

var JSONUtils = require('./json-viewer/check-if-json');
var highlightContent = require('./json-viewer/highlight-content');

function onLoad()
{
    console.log("checking?");
  JSONUtils.checkIfJson(function(pre) {
    pre.hidden = true;
    highlightContent(pre);
  });
}

console.log("i'm here in the viewer!");
document.addEventListener("DOMContentLoaded", onLoad, false);
