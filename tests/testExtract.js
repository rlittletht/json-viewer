
var extractInfoFromJson = require('../extension/src/json-viewer/extractFromJson.js');
var util = require('util');
var fluidExtractProfile = require('../extension/src/json-viewer/options/fluidExtractProfile.js');

var obj = {
    "clientId": "f1a813f6-f426-4fa9-b1ae-e0e684985127",
    "clientSequenceNumber": 1,
    "contents": {
        "type": "component",
        "contents": {
            "address": "default",
            "contents": {
                "content": {
                    "address": "26ed6942-6e46-4474-9594-195c9476bf62",
                    "contents": {
                        "ops": [
                            {
                                "pos1": 0,
                                "pos2": 1,
                                "type": 1
                            },
                            {
                                "pos1": 0,
                                "pos2": 1,
                                "type": 1
                            },
                            {
                                "pos1": 0,
                                "pos2": 1,
                                "type": 1
                            }
                        ],
                        "type": 3
                    }
                },
                "type": "op"
            }
        }
    },
    "minimumSequenceNumber": 1,
    "referenceSequenceNumber": 1,
    "sequenceNumber": 2,
    "term": 1,
    "timestamp": 1618535011167,
    "traces": [],
    "type": "op"
};

var obj2 = {
    "clientId": "f1a813f6-f426-4fa9-b1ae-e0e684985127",
    "clientSequenceNumber": 2,
    "contents": {
        "type": "component",
        "contents": {
            "address": "default",
            "contents": {
                "content": {
                    "address": "26ed6942-6e46-4474-9594-195c9476bf62",
                    "contents": {
                        "pos1": 0,
                        "seg": {
                            "marker": {
                                "refType": 1
                            },
                            "props": {
                                "referenceTileLabels": [
                                    "Eop"
                                ],
                                "markerId": "{6D9E8969-4C57-4DA3-BC0B-068F7C8D82E9}",
                                "sprmCRsidText": 9384715
                            }
                        },
                        "type": 0
                    }
                },
                "type": "op"
            }
        }
    }
};

var obj3 =
{
    "clientId": "f1a813f6-f426-4fa9-b1ae-e0e684985127",
    "clientSequenceNumber": 2,
    "contents": {
        "type": "component",
        "contents": {
            "address": "default",
            "contents": {
                "content": {
                    "address": "26ed6942-6e46-4474-9594-195c9476bf62",
                    "contents": {
                        "pos1": 0,
                        "seg": {
                            "marker": {
                                "refType": 1
                            },
                            "props": {
                                "referenceTileLabels": [
                                    "Eop"
                                ],
                                "markerId": "{6D9E8969-4C57-4DA3-BC0B-068F7C8D82E9}",
                                "sprmCRsidText": 9384715
                            }
                        },
                        "type": 0
                    }
                },
                "type": "op"
            }
        }
    },
    "minimumSequenceNumber": 1,
    "referenceSequenceNumber": 1,
    "sequenceNumber": 3,
    "term": 1,
    "timestamp": 1618535011168,
    "traces": [],
    "type": "op"
};

var obj4 = {
    "clientId": "f1a813f6-f426-4fa9-b1ae-e0e684985127",
    "clientSequenceNumber": 1,
    "contents": {
        "type": "component",
        "contents": {
            "address": "default",
            "contents": {
                "content": {
                    "address": "26ed6942-6e46-4474-9594-195c9476bf62",
                    "contents": {
                        "ops": [
                            {
                                "pos1": 0,
                                "pos2": 1,
                                "type": 1
                            },
                            {
                                "pos1": 0,
                                "pos2": 1,
                                "type": 1
                            },
                            {
                                "pos1": 0,
                                "pos2": 1,
                                "type": 1
                            }
                        ],
                        "type": 3
                    }
                },
                "type": "op"
            }
        }
    }
};

var obj5 = {
    "clientId": "f1a813f6-f426-4fa9-b1ae-e0e684985127",
    "clientSequenceNumber": 3,
    "contents": {
        "type": "component",
        "contents": {
            "address": "default",
            "contents": {
                "content": {
                    "address": "26ed6942-6e46-4474-9594-195c9476bf62",
                    "contents": {
                        "pos1": 0,
                        "pos2": 1,
                        "props": {
                            "sprmCRsidText": 9384715
                        },
                        "type": 2
                    }
                },
                "type": "op"
            }
        }
    },
    "minimumSequenceNumber": 1,
    "referenceSequenceNumber": 1,
    "sequenceNumber": 4,
    "term": 1,
    "timestamp": 1618535011168,
    "traces": [],
    "type": "op"
};

var obj6 = {
    "clientId": "4b696fb5-2177-4611-8ba9-cbd19dd2e899",
    "clientSequenceNumber": 6,
    "contents": {
        "type": "component",
        "contents": {
            "address": "default",
            "contents": {
                "content": {
                    "address": "26ed6942-6e46-4474-9594-195c9476bf62",
                    "contents": {
                        "pos1": 1,
                        "seg": {
                            "text": "a",
                            "props": {
                                "sprmCRsidText": 2448181
                            }
                        },
                        "type": 0
                    }
                },
                "type": "op"
            }
        }
    }
};

var obj7 = {
    "clientId": null,
    "clientSequenceNumber": -1,
    "contents": null,
    "minimumSequenceNumber": 0,
    "referenceSequenceNumber": -1,
    "sequenceNumber": 1,
    "term": 1,
    "timestamp": 1618535011076,
    "traces": [],
    "type": "join",
    "data": {
        "clientId": "f1a813f6-f426-4fa9-b1ae-e0e684985127",
        "detail": {
            "details": {
                "capabilities": {
                    "interactive": true
                }
            },
            "mode": "write",
            "permission": [],
            "scopes": [
                "doc:read",
                "doc:write",
                "summary:write"
            ],
            "user": {
                "id": "497edd07-3d5f-4229-9305-d8a7f797c375",
                "name": "coffeesong_fancier"
            }
        }
    }
};

console.log("extracted: " + extractInfoFromJson(obj6, fluidExtractProfile, "", true));


