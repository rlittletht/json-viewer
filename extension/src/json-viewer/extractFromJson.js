
function extractInfoForKeys(o, keysToExtract, extractLabel, extractValues)
{
    var fHasInfo = false;
    var sInfo = "";

    if (extractLabel)
        sInfo = extractLabel + ": ";

    for (var iKey in keysToExtract)
    {
        var key = keysToExtract[iKey];

        if (o[key] !== undefined)
        {
            if (typeof o[key] == "string" || typeof o[key] == "number")
            {
                if (fHasInfo)
                    sInfo += "," + o[key];
                else
                    sInfo += o[key];

                fHasInfo = true;
            }
            else if (typeof o[key] == "object")
            {
                for (var i in o[key])
                {
                    var s = i;

                    if (extractValues)
                        s = o[key][i];

                    if (fHasInfo)
                        sInfo += "," + s;
                    else
                        sInfo += s;

                    fHasInfo = true;
                }
            }
            else
            {
                if (fHasInfo)
                    sInfo += ", UNK[" + key + ":" + typeof o[key];
                else
                    sInfo += "UNK[" + key + ":" + typeof o[key];

                fHasInfo = true;
            }
        }
    }
    if (fHasInfo)
        return sInfo;

    return "";
}

// using a set of extractInfos, match one of them to the object passed in
// and extract information

// extractInfo: 
//    keyToMatch - a key that must be present in o
//    valueToMatch - the value that must match to continue (if valueToMatch not present, then the value doesn't matter as long as the key is present)
//
// if there is no match, and fMustMatch is true, then return null
// if there is a match, and fMustMatch is not true, then return sExtractSoFar + closure ("->")
//
// if there is a match then:
//    keysToExtract[] - the key whose value(s) will be extracted 
//    extractLabel - the label for the extraction (only one label for the delimited list of values)
//    keyToRecurse - this key is used to get an object that will then get passed to this function recursively, with:
//    recurseDefinitions - the extractInfos to pass with the object from above. if not present, then same extractInfo is passed in
//
//  continueAfterMatch - if present & true, we will continue trying to match after this match. otherwise we stop

function extractInfoFromObjectInner(o, extractInfos, sExtractSoFar, fMustMatch, fSummarizingArray)
{
    var sInfo = sExtractSoFar;

    for (var iExtract in extractInfos)
    {
        var extractInfo = extractInfos[iExtract];

        if (o === undefined || o == null)
            continue;

        if (extractInfo.dontMatchWhenSummarizing !== undefined && extractInfo.dontMatchWhenSummarizing === true && fSummarizingArray === true)
            continue;

        if (extractInfo.keyToMatch !== undefined && o[extractInfo.keyToMatch] === undefined)
            continue;

        if (extractInfo.valueToMatch !== undefined && o[extractInfo.keyToMatch] !== extractInfo.valueToMatch)
            continue;

        if (extractInfo.label !== undefined)
            sInfo += extractInfo.label + ": ";

        if (extractInfo.keysToExtract !== undefined)
            sInfo += extractInfoForKeys(o, extractInfo.keysToExtract, extractInfo.extractLabel, extractInfo.extractValues) + ":";

        if (extractInfo.keyToRecurse !== undefined && o[extractInfo.keyToRecurse] !== undefined)
        {
            var extractInfosToRecurse = extractInfos;

            if (extractInfo.recurseDefinitions !== undefined)
                extractInfosToRecurse = extractInfo.recurseDefinitions;

            sInfo = extractInfoFromObject(o[extractInfo.keyToRecurse], extractInfosToRecurse, sInfo, false, fSummarizingArray);
        }

        if (extractInfo.continueAfterMatch === undefined)
            return sInfo;

        fMustMatch = false; // we matched something, so we no longer have to match again
    }

    if (fMustMatch)
        return null;

    return sInfo;
}

function extractInfoFromObject(o, extractInfos, sExtractSoFar, fMustMatch, fSummarizingArray)
{
    if (Array.isArray(o))
    {
        for (var i in o)
        {
            sExtractSoFar = extractInfoFromObjectInner(o[i], extractInfos, sExtractSoFar, fMustMatch, true);
        }
        return sExtractSoFar;
    }
    return extractInfoFromObjectInner(o, extractInfos, sExtractSoFar, fMustMatch, fSummarizingArray);
}

module.exports = extractInfoFromObject;