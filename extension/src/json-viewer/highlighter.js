var CodeMirror = require('codemirror');
require('codemirror/addon/fold/foldcode');
require('codemirror/addon/fold/foldgutter');
require('codemirror/addon/fold/brace-fold');
require('codemirror/addon/dialog/dialog');
require('codemirror/addon/scroll/annotatescrollbar');
require('codemirror/addon/search/matchesonscrollbar');
require('codemirror/addon/search/searchcursor');
require('codemirror/addon/search/search');
require('codemirror/mode/javascript/javascript');

var extractInfoFromObject = require('./extractFromJson.js');

var merge = require('./merge');
var defaults = require('./options/defaults');
var URL_PATTERN = require('./url-pattern');
var F_LETTER = 70;

function Highlighter(jsonText, options)
{
    this.options = options || {};
    this.text = jsonText;
    this.defaultSearch = false;
    this.theme = this.options.theme || "default";
    this.theme = this.theme.replace(/_/, ' ');
}

Highlighter.prototype = {
    highlight: function()
    {
        this.editor = CodeMirror(document.body, this.getEditorOptions());
        if (!this.alwaysRenderAllContent())
            this.preventDefaultSearch();
        if (this.isReadOny())
            this.getDOMEditor().className += ' read-only';

        this.bindRenderLine();
        this.bindMousedown();
        this.editor.refresh();
        this.editor.focus();
    },

    hide: function()
    {
        this.getDOMEditor().hidden = true;
        this.defaultSearch = true;
    },

    show: function()
    {
        this.getDOMEditor().hidden = false;
        this.defaultSearch = false;
    },

    getDOMEditor: function()
    {
        return document.getElementsByClassName('CodeMirror')[0];
    },

    isFoldableStart: function(line)
    {
        if (/\[/.test(line) && !/\]/.test(line))
            return true;

        if (/\{/.test(line) && !/\}/.test(line))
            return true;

        return false;
    },

    isFoldEnd: function (line)
    {
        if (/\]/.test(line) && !/\[/.test(line))
            return true;

        if (/\}/.test(line) && !/\{/.test(line))
            return true;

        return false;
    },

    skipRoot: function(lineCurrent, lastLine)
    {
        while (lineCurrent < lastLine)
        {
            var line = this.editor.getLine(lineCurrent).trim();

            if (this.isFoldableStart(line))
                return lineCurrent + 1;

            lineCurrent++;
        }

        return lastLine;
    },

    foldLevels: function(lineCurrent, lastLine, levelsToFold)
    {
        // find a level to fold -- it has to have a { or [ on it
        while (lineCurrent < lastLine)
        {
            var line = this.editor.getLine(lineCurrent);

            // if we are at a folding end close brace or bracket), then
            // there's nothing to fold at this level, just return
            if (this.isFoldEnd(line))
                return;

            if (!this.isFoldableStart(line))
            {
                lineCurrent++;
                continue;
            }

            if (levelsToFold > 1)
            {
                this.foldLevels(lineCurrent + 1, lastLine, levelsToFold - 1);
            }

            this.editor.foldCode({ line: lineCurrent, ch: 0 }, null, "fold");
            lineCurrent = this.advanceSkippingPastFoldedLines(lineCurrent, lastLine);
        }
    },

    advanceSkippingPastFoldedLines: function(lineCurrent, lastLine)
    {
        var marks = this.editor.findMarks({ line: lineCurrent, ch: 0 }, { line: lineCurrent + 1, ch: 0 });

        // look for any folded regions, skip them and continue
        for (var iMark in marks)
        {
            var mark = marks[iMark];

            // skip any markers that started before us...if we wanted to skip them, we would have
            // skipped them already...
            if (mark.find().from.line < lineCurrent)
                continue;

            if (mark.__isFold)
                return lineCurrent + mark.lines.length;
        }

        return lineCurrent + 1;
    },

    prefoldKeys: function (lineCurrent, lastLine, keys)
    {
        var map = new Map();

        for (var i in keys)
        {
            map.set(keys[i].key, keys[i]);
        }

        while (lineCurrent < lastLine)
        {
            var line = this.editor.getLine(lineCurrent);

            if (this.isFoldableStart(line))
            {
                var key = /['"]([^'"]*)['"]/.exec(line);
                if (key != null && key.length == 2)
                {
                    if (map.has(key[1]))
                    {
                        var autoFoldUntil = map.get(key[1]).autoFoldUntil;

                        autoFoldUntil = autoFoldUntil ?? 1;
                        this.foldLevels(lineCurrent, lastLine, autoFoldUntil);
                    }
                }
            }

            // we can't be clever here and skip folded regions -- we might have folded a bigger region,
            // but we have smaller regions to fold as well...
            lineCurrent++;
        }
    },

    fold: function(fOnlyLevel2, autoFoldUntilLevel, prefoldKeys)
    {
        var firstLine = this.editor.firstLine();
        var lastLine = this.editor.lastLine();

        var lineCurrent = this.skipRoot(firstLine, lastLine);

        // first make a pass through and prefold keys
        if (prefoldKeys !== undefined)
            this.prefoldKeys(lineCurrent, lastLine, prefoldKeys);

        if (fOnlyLevel2)
        {
            while (lineCurrent < lastLine)
            {
                var marks = this.editor.findMarks({ line: lineCurrent, ch: 0 }, { line: lastLine + 1, ch: 0 });

                var skipToLine = 0;

                // look for any folded regions, skip them and continue
                for (var iMark in marks)
                {
                    var mark = marks[iMark]
                    if (mark.__isFold)
                    {
                        skipToLine = lineCurrent + mark.lines.length - 1;
                        break;
                    }
                }
                if (skipToLine != 0)
                {
                    lineCurrent = skipToLine;
                    continue;
                }
                this.editor.foldCode({ line: lineCurrent, ch: 0 }, null, "fold");
                lineCurrent++;
            }
            return;
        }

        if (autoFoldUntilLevel !== undefined)
        {
            this.foldLevels(lineCurrent, lastLine, autoFoldUntilLevel);
            lineCurrent = this.advanceSkippingPastFoldedLines(lineCurrent, lastLine);
        }
        while (lineCurrent <= lastLine)
        {
            this.editor.foldCode({ line: lineCurrent, ch: 0 }, null, "fold");
            lineCurrent++;
        }
    },

    unfoldAll: function()
    {
        for (var line = 0; line < this.editor.lineCount(); line++)
            this.editor.foldCode({ line: line, ch: 0 }, null, "unfold");
    },

    bindRenderLine: function()
    {
        var self = this;
        this.editor.off("renderLine");
        this.editor.on(
            "renderLine",
            function(cm, line, element)
            {
                var elementsNode = element.getElementsByClassName("cm-string");
                if (!elementsNode || elementsNode.length === 0)
                    return;

                var elements = [];
                for (var i = 0; i < elementsNode.length; i++)
                    elements.push(elementsNode[i]);

                var textContent = elements.reduce(
                    function(str, node)
                    {
                        return str += node.textContent;
                    },
                    "");

                var text = self.removeQuotes(textContent);

                if (text.match(URL_PATTERN) && self.clickableUrls())
                {
                    var decodedText = self.decodeText(text);
                    elements.forEach(
                        function(node)
                        {
                            if (self.wrapLinkWithAnchorTag())
                            {
                                var linkTag = document.createElement("a");
                                linkTag.href = decodedText;
                                linkTag.setAttribute('target', '_blank')
                                linkTag.classList.add("cm-string");

                                // reparent the child nodes to preserve the cursor when editing
                                node.childNodes.forEach(
                                    function(child)
                                    {
                                        linkTag.appendChild(child);
                                    });

                                // block CodeMirror's contextmenu handler
                                linkTag.addEventListener(
                                    "contextmenu",
                                    function(e)
                                    {
                                        if (e.bubbles)
                                            e.cancelBubble = true;
                                    });

                                node.appendChild(linkTag);
                            }
                            else
                            {
                                node.classList.add("cm-string-link");
                                node.setAttribute("data-url", decodedText);
                            }
                        });
                }
            });
    },

    bindMousedown: function()
    {
        var self = this;
        this.editor.off("mousedown");
        this.editor.on(
            "mousedown",
            function(cm, event)
            {
                var element = event.target;
                if (element.classList.contains("cm-string-link"))
                {
                    var url = element.getAttribute("data-url")
                    var target = "_self";
                    if (self.openLinksInNewWindow())
                        target = "_blank";
                    window.open(url, target);
                }
            });
    },

    removeQuotes: function(text)
    {
        return text.replace(/^\"+/, '').replace(/\"+$/, '');
    },

    includeQuotes: function(text)
    {
        return "\"" + text + "\"";
    },

    decodeText: function(text)
    {
        if (text === "")
            text = "<empty>";

        var div = document.createElement("div");
        div.innerHTML = text;
        return div.firstChild.nodeValue;
    },

    getWidgetText: function(from, to)
    {
        var prevLine = this.editor.getLine(from.line);
        var startToken = '{', endToken = '}';

        if (prevLine.lastIndexOf('[') > prevLine.lastIndexOf('{'))
        {
            // we are an array item
            startToken = '[';
            endToken = ']';
        }

        var jsonString = startToken + this.editor.getRange(from, to) + endToken;
        var o = JSON.parse(jsonString);

        if (!o)
            return "...";

        var extract = extractInfoFromObject(o, this.options.foldSummarizerData, "", true);

        if (extract)
            return extract;

        return "...";
    },

    getEditorOptions: function()
    {
        var obligatory = {
            value: this.text,
            theme: this.theme,
            readOnly: this.isReadOny() ? true : false,
            mode: "application/ld+json",
            indentUnit: 2,
            tabSize: 2,
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
            extraKeys: this.getExtraKeysMap()
        }

        obligatory.foldOptions = obligatory.foldOptions || {};
        obligatory.foldOptions.widget = (from, to) => this.getWidgetText(from, to);
        obligatory.cursorBlinkRate = 0;

        if (this.alwaysRenderAllContent())
            obligatory.viewportMargin = Infinity;

        var optional = defaults.structure;
        var configured = this.options.structure;

        return merge({}, optional, configured, obligatory);
    },

    getExtraKeysMap: function()
    {
        var extraKeyMap = {
            "Esc": function(cm)
            {
                CodeMirror.commands.clearSearch(cm);
                cm.setSelection(cm.getCursor());
                cm.focus();
            }
        }

        if (this.options.structure.readOnly)
        {
            extraKeyMap["Enter"] = function(cm)
            {
                CodeMirror.commands.findNext(cm);
            }

            extraKeyMap["Shift-Enter"] = function(cm)
            {
                CodeMirror.commands.findPrev(cm);
            }

            extraKeyMap["Ctrl-V"] = extraKeyMap["Cmd-V"] = function(cm) {};
        }

        var nativeSearch = this.alwaysRenderAllContent();
        extraKeyMap["Ctrl-F"] = nativeSearch ? false : this.openSearchDialog;
        extraKeyMap["Cmd-F"] = nativeSearch ? false : this.openSearchDialog;
        return extraKeyMap;
    },

    preventDefaultSearch: function()
    {
        document.addEventListener(
            "keydown",
            function(e)
            {
                var metaKey = navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey;
                if (!this.defaultSearch && e.keyCode === F_LETTER && metaKey)
                    e.preventDefault();
            }.bind(this),
            false);
    },

    openSearchDialog: function(cm)
    {
        cm.setCursor({ line: 0, ch: 0 });
        CodeMirror.commands.find(cm);
    },

    alwaysRenderAllContent: function()
    {
        // "awaysRenderAllContent" was a typo but to avoid any problems
        // I'll keep it a while
        return this.options.addons.alwaysRenderAllContent || this.options.addons.awaysRenderAllContent;
    },

    clickableUrls: function()
    {
        return this.options.addons.clickableUrls;
    },

    wrapLinkWithAnchorTag: function()
    {
        return this.options.addons.wrapLinkWithAnchorTag;
    },

    openLinksInNewWindow: function()
    {
        return this.options.addons.openLinksInNewWindow;
    },

    isReadOny: function()
    {
        return this.options.structure.readOnly;
    }
}

module.exports = Highlighter;