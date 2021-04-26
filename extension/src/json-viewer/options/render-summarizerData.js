var jsonFormater = require('../jsl-format');

function renderSummarizerData(CodeMirror, value) {
  var addonsInput = document.getElementById('foldSummarizerData');
  value = value || {};

  addonsInput.innerHTML = jsonFormater(JSON.stringify(value));
    
  return CodeMirror.fromTextArea(addonsInput, {
    mode: "application/ld+json",
    lineWrapping: true,
    lineNumbers: true,
    tabSize: 2
  });
}

module.exports = renderSummarizerData;
