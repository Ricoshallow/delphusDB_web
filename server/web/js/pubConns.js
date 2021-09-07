
$(document).ready(function () {   
    displayAllTable()
     // searchbox
     $('#searchbox').keyup(function(){
        // console.log('1');
        $("table tbody tr").hide().filter(":contains('" + ($(this).val()) + "')" ).show()

    })
});

var displayAllTable = function(){
    var nodeUrl = GetFullUrl(window.location.host);
    var controller = new ControllerServer(nodeUrl);
    var pubConnsRes = controller.runSync("pnodeRun(def(){return getStreamingStat().pubConns})");
  
     if (pubConnsRes.resultCode === "1") {
         alert(pubConnsRes.msg);
     } else {

        var valueList = pubConnsRes.object[0].value;
        var ent = []
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
                    name: "client", type: "text", width: 50, align: "center",
                    itemTemplate: function (value, item) {
                        // console.log(item);
                        return `<p>${item.client}</p>`
                    }
                },
                {
                    name: "queueDepth", type: "text", width: 50, align: "center",
                    itemTemplate: function (value, item) {
                        // console.log(item);
                        return `<p>${item.queueDepth}</p>`
                    }
                },
                {
                    name: "queueDepthLimit", type: "text", width: 50, align: "center",
                    itemTemplate: function (value, item) {
                        // console.log(item);
                        return `<p>${item.queueDepthLimit}</p>`
                    }
                },
                {
                    name: "tables", type: "text", width: 300, align: "center",
                    itemTemplate: function (value, item) {
                        // console.log(item);
                        return `<p>${item.tables}</p>`
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

$("#btn_refresh").bind('click',function(){
    displayAllTable()
})

