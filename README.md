![JSONViewer Logo](https://raw.githubusercontent.com/rlittletht/json-viewer/master/logo.png)

# JSON Viewer

![screenshot](https://raw.githubusercontent.com/rlittletht/json-viewer/master/screenshot.png)

Extended from tulios/json-viewer. (https://github.com/tulios/json-viewer)

Chrome extension for highlighting JSON/JSONP. 

Allows custom fold definitions and custom queries to summarize folded content. Also recursively interprets
strings that encode JSON objects.

Notes:

* This extension might crash with other JSON highlighters/formatters, you may need to disable them
* To highlight local files and incognito tabs you have to manually enable these options on the extensions page
* Works on local files

Features:

* Syntax highlighting
* 27 built-in themes
* Collapsible nodes
* Clickable URLs (optional)
* URL does not matter (the content is analysed to determine if its a JSON or not)
* Inspect your json typing "json" in the console
* Hot word `jv` into omnibox (type `jv` + TAB and paste your JSON into omnibox, hit ENTER and it will be highlighted)
* Toggle button to view the raw/highlighted version
* Works with numbers bigger than Number.MAX_VALUE
* Option to show line numbers
* Option to customize your theme
* Option to customize the tab size
* Option to configure a max JSON size to highlight
* Option to collapse nodes from second level + Button to unfold all collapsed nodes
* Option to include a header with timestamp + url
* Option to allow the edition of the loaded JSON
* Option to sort json by keys
* Option to disable auto highlight
* Option for C-style braces and arrays
* Scratch pad, a new area which you can type/paste JSON and format indefinitely using a button or key shortcut. To access type `jv` + `TAB` + `scratch pad` ENTER

## Installation

### Install through Edge or Chrome Web Store

Not available in extensions stores (yet)

### Compile and load in developer mode

Using latest node (21)
  1. npm install
  2. npm run build
  3. Open Edge/Chrome and go to: edge://extensions or chrome://extensions/
  5. Enable: "Developer mode"
  6. Click: "Load unpacked extension"
  7. Select: "build/json_viewer" directory.

## Try it on

### JSON

  [https://api.github.com/repos/rlittletht/json-viewer](https://api.github.com/repos/rlittletht/json-viewer)

  [https//api.github.com](https://api.github.com)

  [https://api.github.com/gists/public](https://api.github.com/gists/public)

  Large files:

  [https://raw.githubusercontent.com/ebrelsford/geojson-examples/master/596acres-02-18-2014.geojson](https://raw.githubusercontent.com/ebrelsford/geojson-examples/master/596acres-02-18-2014.geojson)

  [https://api.takealot.com/rest/v-1-4-2/productlines?available=1&cat=10371&instock=1&rows=10&sort=score%20desc&start=0](https://api.takealot.com/rest/v-1-4-2/productlines?available=1&cat=10371&instock=1&rows=10&sort=score%20desc&start=0)

## License

See [LICENSE](https://github.com/rlittletht/json-viewer/blob/master/LICENSE) for more details.
