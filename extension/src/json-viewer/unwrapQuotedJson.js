
function unwrapQuotedJsonInPlace(jsonObject, results)
{
//    console.log("typeof " + jsonObject + ": " + typeof jsonObject);
    if (typeof jsonObject === 'string')
    {
        // sniff to see if it *looks* like a json string

        if (!jsonObject.startsWith('{"') && !jsonObject.startsWith('[{') && !jsonObject.startsWith('[ {'))
            return jsonObject;

        try
        {
            jsonObject = JSON.parse(jsonObject);
            results.fFoundJson = true;
            return jsonObject;
        }
        catch (e)
        {
            console.log("couldn't parse json for " + jsonObject);
        }
        
        return jsonObject;
    }

    if (typeof jsonObject === 'object')
    {
        for (var prop in jsonObject)
        {
            jsonObject[prop] = unwrapQuotedJsonInPlace(jsonObject[prop], results);
        }
    }
    return jsonObject;
}

module.exports = unwrapQuotedJsonInPlace;
