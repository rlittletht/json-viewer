/*jslint white: true, devel: true, onevar: true, browser: true, undef: true, nomen: true, regexp: true, plusplus: false, bitwise: true, newcap: true, maxerr: 50, indent: 4 */
var jsl = typeof jsl === 'undefined' ? {} : jsl;

/**
 * jsl.format - Provide json reformatting in a character-by-character approach, so that even invalid JSON may be reformatted (to the best of its ability).
 *
**/
jsl.format = (function () {

    function repeat(s, count) {
        return new Array(count + 1).join(s);
    }
    function getSizeOfArray(jsonString,startingPosition){
        var currentPosition = startingPosition + 1;
        var inString = false;
        var numOpened = 1;
        var chCurrent = jsonString.charAt(startingPosition);
        var chOpen, chClose;

        if (chCurrent === '[') {
          chOpen = '[';
          chClose = ']';
        }
        else if (chCurrent === '{') {
          chOpen = '{';
          chClose = '}';
        } else {
          return null;
        }

        try{
            while (numOpened > 0 && currentPosition < jsonString.length) {
                var currentChar = jsonString.charAt(currentPosition)
                switch (currentChar) {
                    case chOpen:
                        if(!inString){
                            numOpened++;
                        }
                        break;
                    case chClose:
                        if(!inString){
                            numOpened--;
                        }
                        break;
                    case '"':
                        inString = !inString;
                        break;
                }
                currentPosition++;
            }
            return Object.keys(JSON.parse(jsonString.substring(startingPosition,currentPosition))).length;
        }
        catch(err){
            return null;
        }
    }

    function getSizeOfArrayReverse(jsonString, startingPosition) {
      var currentPosition = startingPosition - 1;
      var inString = false;
      var numOpened = 1;
      var chCurrent = jsonString.charAt(startingPosition);
      var chOpen, chClose;

      if (chCurrent === ']') {
        chOpen = '[';
        chClose = ']';
      }
      else if (chCurrent === '}') {
        chOpen = '{';
        chClose = '}';
      } else {
        return null;
      }
      try {
        while (numOpened > 0 && currentPosition >= 0) {
          var currentChar = jsonString.charAt(currentPosition);
          switch (currentChar) {
            case chOpen:
              if (!inString) {
                numOpened--;
              }
              break;
            case chClose:
              if (!inString) {
                numOpened++;
              }
              break;
            case '"':
              inString = !inString;
              break;
          }
          currentPosition--;
        }
        return Object.keys(JSON.parse(jsonString.substring(currentPosition + 1, startingPosition + 1))).length;
      }
      catch (err) {
        return null;
      }
    }

    function formatJson(json, options) {
        options = options || {};
        var tabSize = options.tabSize || 2;
        var indentCStyle = options.indentCStyle || false;
        var showArraySize = (typeof options.showArraySize !== "undefined" ? Boolean(options.showArraySize) : false);
        var tab = "";
        for (var ts = 0; ts < tabSize; ts++) {
          tab += " ";
        }

        var i           = 0,
            il          = 0,
            newJson     = "",
            indentLevel = 0,
            inString    = false,
            currentChar = null,
            fLastWasDelim = true;
    
        for (i = 0, il = json.length; i < il; i += 1) {
            currentChar = json.charAt(i);
            var arraySize = 0;

            switch (currentChar) {
            case '{':
            case '[':
                if (!inString) {
                    arraySize = getSizeOfArray(json, i);
                    if (indentCStyle
                        && arraySize !== null
                        && arraySize > 0
                        && !fLastWasDelim) {
                        newJson += "\n" + repeat(tab, indentLevel);
                    }
                    if(currentChar === "["){
                        if(showArraySize){
                            if(arraySize !== null){
                                newJson += "Array[" + arraySize + "]";
                            }
                        }
                    }
                    newJson += currentChar;
                  
                    if(arraySize !== null && arraySize > 0){
                        newJson += "\n" + repeat(tab, indentLevel + 1);
                        indentLevel += 1;
                    }
                    fLastWasDelim = true;
                } else {
                    newJson += currentChar;
                    fLastWasDelim = false;
                }
                break;
            case '}':
            case ']':
                if (!inString) {
                    arraySize = getSizeOfArrayReverse(json, i);
                    
                    if (arraySize !== null && arraySize > 0) {
                        indentLevel -= 1;
                        newJson += "\n" + repeat(tab, indentLevel);
                    }
                    newJson += currentChar;
                    fLastWasDelim = true;
                } else {
                    newJson += currentChar;
                    fLastWasDelim = false;
                }
                break;
            case ',':
                if (!inString) {
                    newJson += ",\n" + repeat(tab, indentLevel);
                    fLastWasDelim = true;
                } else {
                    newJson += currentChar;
                    fLastWasDelim = false;
                }
                break;
            case ':':
                if (!inString) {
                    newJson += ": ";
                } else {
                    newJson += currentChar;
                }
                fLastWasDelim = false;
                break;
            case ' ':
            case "\n":
            case "\t":
                if (inString) {
                    newJson += currentChar;
                    fLastWasDelim = false;
                }
                break;
            case '"':
                if (i === 0) {
                    inString = true;
                }
                else if (json.charAt(i - 1) !== '\\' || (json.charAt(i - 1) == '\\' && json.charAt(i - 2) == '\\')) {
                    inString = !inString;
                }
                newJson += currentChar;
                fLastWasDelim = false;
                break;
            default:
                newJson += currentChar;
                fLastWasDelim = false;
                break;
            }
        }

        return newJson;
    }

    return { "formatJson": formatJson };

}());

module.exports = jsl.format.formatJson;
