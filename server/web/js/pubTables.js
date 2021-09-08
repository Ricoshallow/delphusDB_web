$(document).ready(function () {
    bindGrid()
});

var bindGrid = function () {
    var nodeUrl = GetFullUrl(window.location.host);
    var controller = new ControllerServer(nodeUrl);
    var pubConnsRes = controller.runSync("pnodeRun(def(){return getStreamingStat().pubTables})");
    console.log(pubConnsRes);
    if (pubConnsRes.resultCode === "1") {
        alert(pubConnsRes.msg);
    } else {
        //
        var valueList = pubConnsRes.object[0].value;
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
                    name: "tableName",
                    type: "text",
                    width: 50,
                    align: "center",
                    itemTemplate: function (value, item) {
                        // console.log(item);
                        return `<p>${item.tableName}</p>`
                    }
                },
                {
                    name: "subscriber",
                    type: "text",
                    width: 50,
                    align: "center",
                    itemTemplate: function (value, item) {
                        // console.log(item);
                        return `<p>${item.subscriber}</p>`
                    }
                },
                {
                    name: "msgOffset",
                    type: "text",
                    width: 50,
                    align: "center",
                    itemTemplate: function (value, item) {
                        // console.log(item);
                        return `<p>${item.msgOffset}</p>`
                    }
                },
                {
                    name: "actions",
                    type: "text",
                    width: 300,
                    align: "center",
                    itemTemplate: function (value, item) {
                        // console.log(item);
                        return `<p>${item.actions}</p>`
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