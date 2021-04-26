
module.exports = {
  theme: "default",
  addons: {
    prependHeader: true,
    maxJsonSize: 400,
    alwaysFold: false,
    alwaysFoldOnlyTopLevel: false,
    alwaysRenderAllContent: false,
    sortKeys: false,
    clickableUrls: true,
    wrapLinkWithAnchorTag: false,
    openLinksInNewWindow: true,
    autoHighlight: true,
    parseJsonStrings: true,
    parseJsonStringsDepth: 2
  },
  structure: {
    readOnly: true,
    lineNumbers: true,
    lineWrapping: true,
    foldGutter: true,
    tabSize: 2,
    indentCStyle: false,
    showArraySize: false
  },
  foldSummarizerData: require('./fluidExtractProfile.js'),
  
  style: [
    ".CodeMirror {",
    "  font-family: monaco, Consolas, Menlo, Courier, monospace;",
    "  font-size: 16px;",
    "  line-height: 1.5em;",
    "}"
  ].join('\n')
}
