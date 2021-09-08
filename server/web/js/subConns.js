
$(document).ready(function () {   
    bindGrid()
});

var bindGrid = function(){
    var nodeUrl = GetFullUrl(window.location.host);
    var controller = new ControllerServer(nodeUrl);
    var subConnsRes = controller.runSync("pnodeRun(def(){return getStreamingStat().subConns})");
  
     if (subConnsRes.resultCode === "1") {
         alert(subConnsRes.msg);
     } else {
        
        var valueList = subConnsRes.object[0].value;
        var ent = []
        console.log(subConnsRes);
        for (var j=0;j<valueList[0].value.length;j++){
            var obj = {}
            for (var i=0,len=valueList.length;i<len;i++){
                obj[valueList[i].name] = valueList[i].value[j]
            }
            ent.push(obj)
        } 
        console.log(ent);
        $(`#dataTable`).jsGrid({
            width: "98%",
            // height: "400px",
            data: ent,
            resize: true,
            fields: [
                {
                    name: "publisher", type: "text", width: 80, align: "center",
                    itemTemplate: function (value, item) {
                        // console.log(item);
                        return `<p>${item.publisher}</p>`
                    }
                },
                {
                    name: "cumMsgCount", type: "text", width: 80, align: "center",
                    itemTemplate: function (value, item) {
                        // console.log(item);
                        return `<p>${item.cumMsgCount}</p>`
                    }
                },
                {
                    name: "cumMsgLatency", type: "text", width: 80, align: "center",
                    itemTemplate: function (value, item) {
                        // console.log(item);
                        return `<p>${item.cumMsgLatency}</p>`
                    }
                },
                {
                    name: "lastMsgLatency", type: "text", width: 80, align: "center",
                    itemTemplate: function (value, item) {
                        // console.log(item);
                        return `<p>${item.lastMsgLatency}</p>`
                    }
                },
                {
                    name: "lastUpdate", type: "text", width: 80, align: "center",
                    itemTemplate: function (value, item) {
                        // console.log(item);
                        return `<p>${item.lastUpdate}</p>`
                    }
                },
                {
                    name: "node", type: "text", width: 50, align: "center",
                    itemTemplate: function (value, item) {
                        // console.log(item);
                        return `<p>${item.node}</p>`
                    }
                },
                
            ]
        })
     }

}


