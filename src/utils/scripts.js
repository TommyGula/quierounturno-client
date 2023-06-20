function formatScheduleBody(times) {
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    return days.reduce((r,a) => {
        r[a] = Object.keys(times).reduce((r2,a2) => {
            if (a2.includes(a)) {
                if (a2.includes("from")) {
                    if (a2.includes("_")) {
                        let index = a2.split("_")[1].split("-")[0];
                        if (r2.length > index) {
                            console.log(r2.length, index, r2)
                            r2[parseInt(index)]["from"] = times[a2]
                        } else {
                            r2.push({"from":times[a2]})
                        }
                    } else {
                        if (r2.length) {
                            r2[0]["from"] = times[a2]
                        } else {
                            r2.push({"from":times[a2]})
                        }
                    }
                } else {
                    if (a2.includes("_")) {
                        let index = a2.split("_")[1].split("-")[0];
                        if (r2.length > index) {
                            r2[parseInt(index)]["to"] = times[a2]
                        } else {
                            r2.push({"to":times[a2]})
                        }
                    } else {
                        if (r2.length) {
                            r2[0]["to"] = times[a2]
                        } else {
                            r2.push({"to":times[a2]})
                        }
                    }
                }
            };
            return r2;
        },[]);
        return r;
    },{});
};

let obj = {
    "monday-from": "2023-05-04T12:00:00.000Z",
    "monday-to": "2023-05-04T21:00:00.000Z",
    "tuesday-from": "2023-05-04T12:00:00.000Z",
    "tuesday-to": "2023-05-04T21:00:00.000Z",
    "wednesday-from": "2023-05-04T12:00:00.000Z",
    "wednesday-to": "2023-05-04T21:00:00.000Z",
    "thursday-from": "2023-05-04T12:00:00.000Z",
    "thursday-to": "2023-05-04T21:00:00.000Z",
    "friday-from": "2023-05-04T12:00:00.000Z",
    "friday-to": "2023-05-04T22:00:00.000Z",
    "saturday-from": null,
    "saturday-to": null,
    "sunday-from": null,
    "sunday-to": null,
    "monday_1-from": "2023-05-04T13:00:00.500Z"
}

const scheduleSchema = {
    "monday": [
        {
            "from": "2023-05-07T12:00:00.000Z",
            "to": "2023-05-07T21:00:00.000Z",
            "_id": "64582c3d69d3cf786dc209f9"
        },
        {
            "from": "2023-05-07T12:00:00.000Z",
            "to": "2023-05-07T21:00:00.000Z",
            "_id": "64582c3d69d3cf786dc209f9"
        }
    ],
    "tuesday": [
        {
            "from": "2023-05-07T12:00:00.000Z",
            "to": "2023-05-07T21:00:00.000Z",
            "_id": "64582c3d69d3cf786dc209fa"
        }
    ],
    "wednesday": [
        {
            "from": "2023-05-07T12:00:00.000Z",
            "to": "2023-05-07T21:00:00.000Z",
            "_id": "64582c3d69d3cf786dc209fb"
        }
    ],
    "thursday": [
        {
            "from": "2023-05-07T12:00:00.000Z",
            "to": "2023-05-07T21:00:00.000Z",
            "_id": "64582c3d69d3cf786dc209fc"
        }
    ],
    "friday": [
        {
            "from": "2023-05-07T12:00:00.000Z",
            "to": "2023-05-07T21:00:00.000Z",
            "_id": "64582c3d69d3cf786dc209fd"
        }
    ],
    "saturday": [
        {
            "from": null,
            "to": null,
            "_id": "64582c3d69d3cf786dc209fe"
        }
    ],
    "sunday": [
        {
            "from": null,
            "to": null,
            "_id": "64582c3d69d3cf786dc209ff"
        }
    ]
}

const schemaToValue = (schema) => {
    return Object.keys(schema).reduce((r,a) => {
        let day = schema[a].reduce((r2,a2) => {
            index = schema[a].indexOf(a2) ? "_" + schema[a].indexOf(a2) : "";
            r[a + index + "-from"] = a2["from"];
            r[a + index + "-to"] = a2["to"];
            return r2;
        },[]);
        return r;
    },{});
};

function slugName(name) {
    name = name.replace(/[^a-zA-Z0-9 ]/g, '');
    name = name.toLowerCase();
    name = name.replace(/ /g, "-")
    name = name.replace(/--/g, "-")
    return name;
};

//let body = formatScheduleBody(obj);

let name = "Datarex dinosaurios & Musica by: Tomas"
//console.log(slugName(name))

console.log(schemaToValue(scheduleSchema));