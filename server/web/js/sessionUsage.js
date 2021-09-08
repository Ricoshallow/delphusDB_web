$(document).ready(function () {
    bindGrid()
});

var bindGrid = function () {
    var nodeUrl = GetFullUrl(window.location.host);
    // http://127.0.0.1:22210
    // console.log(nodeUrl);
    var contrApi = new ControllerServer(nodeUrl)
    // session usage
    var allSessionRg = contrApi.runSync("pnodeRun(getSessionMemoryStat)")
    console.log(allSessionRg);
    if (allSessionRg.resultCode === "1") {
        alert(allSessionRg.msg);
    } else {
        var valueList = allSessionRg.object[0].value
        // console.log(valueList);
        var ent = []
        for (var j = 0; j < valueList[0].value.length; j++) {
            var obj = {}
            for (var i = 0, len = valueList.length; i < len; i++) {
                obj[valueList[i].name] = valueList[i].value[j]
            }
            ent.push(obj)
        }
        // console.log(ent);
        //render table
        $("#dataTable").jsGrid({
            width: "98%",
            // height: "400px",
            data: ent,
            resize: true,
            fields: [{
                    name: "userId",
                    type: "text",
                    width: 50,
                    align: "center",
                    itemTemplate: function (value, item) {
                        return `<p>${item.userId}</p>`
                    }
                },
                {
                    name: "sessionId",
                    type: "text",
                    width: 50,
                    align: "center",
                    itemTemplate: function (value, item) {
                        return `<p>${item.sessionId}</p>`
                    }
                },
                {
                    name: "memSize",
                    type: "text",
                    width: 50,
                    align: "center",
                    itemTemplate: function (value, item) {
                        return `<p>${item.memSize}</p>`
                    }
                },
                {
                    name: "remoteIp",
                    type: "text",
                    width: 50,
                    align: "center",
                    itemTemplate: function (value, item) {
                        return `<p>${item.remoteIP}</p>`
                    }
                },
                {
                    name: "remotePort",
                    type: "text",
                    width: 50,
                    align: "center",
                    itemTemplate: function (value, item) {
                        return `<p>${item.remotePort}</p>`
                    }
                },
                {
                    name: "createTime",
                    type: "text",
                    width: 50,
                    align: "center",
                    itemTemplate: function (value, item) {
                        return `<p>${item.createTime}</p>`
                    }
                },
                {
                    name: "lastActiveTime",
                    type: "text",
                    width: 50,
                    align: "center",
                    itemTemplate: function (value, item) {
                        return `<p>${item.lastActiveTime}</p>`
                    }
                },
                {
                    name: "node",
                    type: "text",
                    width: 50,
                    align: "center",
                    itemTemplate: function (value, item) {
                        return `<p>${item.node}</p>`
                    }
                },

            ]
        })
    }
}