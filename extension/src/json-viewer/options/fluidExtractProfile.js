 
module.exports =
[
    //        {
    //            keyToMatch: "type",
    //            valueToMatch: "join",
    //            keyToRecurse: "data",
    //            label: "join",
    //        },
    {
        keyToMatch: "contents",
        keyToRecurse: "contents",
    },
    {
        keyToMatch: "content",
        keyToRecurse: "content",
    },
    {
        keyToMatch: "type",
        valueToMatch: 3,
        keysToExtract: ["ops"],
        extractLabel: "T3",
        continueAfterMatch: true
    },
    {
        keyToMatch: "detail",
        keyToRecurse: "detail"
    },
    {
        keyToMatch: "details",
        keysToExtract: ["mode", "scopes", "user"],
        extractValues: true,
    },
    {
        keyToMatch: "type",
        valueToMatch: 2,
        keysToExtract: ["pos1", "pos2", "props"],
        extractLabel: "annot",
        continueAfterMatch: true
    },
    {
        keyToMatch: "type",
        valueToMatch: 0,
        keysToExtract: ["pos1"],
        extractLabel: "ins",
        continueAfterMatch: true
    },
    {
        keyToMatch: "type",
        valueToMatch: 0,
        keyToRecurse: "seg",
        recurseDefinitions: [
            {
                keyToMatch: "marker",
                keyToRecurse: "marker",

                recurseDefinitions: [
                    {
                        keysToExtract: ["refType"],
                        extractLabel: "refType"
                    }
                ],
                continueAfterMatch: true
            },
            {
                keyToMatch: "props",
                keyToRecurse: "props",

                recurseDefinitions: [
                    {
                        keysToExtract: ["referenceTileLabels"],
                        extractValues: true,
                    }
                ],
                continueAfterMatch: true
            },
            {
                keysToExtract: ["text", "props"]
            }
        ]
    },
    {
        keyToMatch: "type",
        valueToMatch: "component",
        keyToRecurse: "contents",
    },
    {
        keyToMatch: "contents",
        keyToRecurse: "content",
        recurseDefinitions:
        [
            {
                keyToMatch: "contents",
                recurseDefinition:
                {
                    keyToSummarize: "props",
                    summarizeEntryCount: 1
                }
            }
        ]
    }
];
