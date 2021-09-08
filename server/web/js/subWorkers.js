$(document).ready(function () {
    bindGrid()
});

var bindGrid = function () {
    var nodeUrl = GetFullUrl(window.location.host);
    var controller = new ControllerServer(nodeUrl);
    var subWorkersRes = controller.runSync("pnodeRun(def(){return getStreamingStat().subWorkers})");
    console.log(subWorkersRes);
    if (subWorkersRes.resultCode === "1") {
        alert(subWorkersRes.msg);
    } else {

        var valueList = subWorkersRes.object[0].value;
        var ent = []
        for (var j = 0; j < valueList[0].value.length; j++) {
            var obj = {}
            for (var i = 0, len = valueList.length; i < len; i++) {
                obj[valueList[i].name] = valueList[i].value[j]
            }
            ent.push(obj)
        }
        // console.log(ent);
        $(`#dataTable`).jsGrid({
            width: "98%",
            // height: "400px",
            data: ent,
            resize: true,
            fields: [{
                    name: "workerId",
                    type: "text",
                    width: 50,
                    align: "center",
                    itemTemplate: function (value, item) {
                        // console.log(item);
                        return `<p>${item.workerId}</p>`
                    }
                },
                {
                    name: "topic",
                    type: "text",
                    width: 200,
                    align: "center",
                    itemTemplate: function (value, item) {
                        // console.log(item);
                        return `<p>${item.topic}</p>`
                    }
                },
                {
                    name: "queueDepthLimit",
                    type: "text",
                    width: 80,
                    align: "center",
                    itemTemplate: function (value, item) {
                        // console.log(item);
                        return `<p>${item.queueDepthLimit}</p>`
                    }
                },
                {
                    name: "queueDepth",
                    type: "text",
                    width: 50,
                    align: "center",
                    itemTemplate: function (value, item) {
                        // console.log(item);
                        return `<p>${item.queueDepth}</p>`
                    }
                },
                {
                    name: "processedMsgCount",
                    type: "text",
                    width: 80,
                    align: "center",
                    itemTemplate: function (value, item) {
                        // console.log(item);
                        return `<p>${item.processedMsgCount}</p>`
                    }
                },
                {
                    name: "lastMsgId",
                    type: "text",
                    width: 50,
                    align: "center",
                    itemTemplate: function (value, item) {
                        // console.log(item);
                        return `<p>${item.lastMsgId}</p>`
                    }
                },
                {
                    name: "failedMsgCount",
                    type: "text",
                    width: 80,
                    align: "center",
                    itemTemplate: function (value, item) {
                        // console.log(item);
                        return `<p>${item.failedMsgCount}</p>`
                    }
                },
                {
                    name: "lastFailedMsgId",
                    type: "text",
                    width: 80,
                    align: "center",
                    itemTemplate: function (value, item) {
                        // console.log(item);
                        return `<p>${item.lastFailedMsgId}</p>`
                    }
                },
                {
                    name: "lastFailedTimestamp",
                    type: "text",
                    width: 80,
                    align: "center",
                    itemTemplate: function (value, item) {
                        // console.log(item);
                        return `<p>${item.lastFailedTimestamp}</p>`
                    }
                },
                {
                    name: "lastErrMsg",
                    type: "text",
                    width: 50,
                    align: "center",
                    itemTemplate: function (value, item) {
                        // console.log(item);
                        return `<p>${item.lastErrMsg}</p>`
                    }
                },
                {
                    name: "node",
                    type: "text",
                    width: 50,
                    align: "center",
                    itemTemplate: function (value, item) {
                        // console.log(item);
                        return `<p>${item.node}</p>`
                    }
                },

            ]
        })
    }

}