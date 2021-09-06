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
    var contrApi = new ControllerServer(nodeUrl)
    var objsRe = contrApi.runSync("pnodeRun(objs{true})");
    console.log(objsRe);
    // render table
    if (objsRe.resultCode === "1") {
        alert(objsRe.msg);
    } else {
        var valueList =  objsRe.object[0].value
        // console.log(valueList);
        var ent = []
        for (var j=0;j<valueList[0].value.length;j++){
            var obj = {}
            for (var i=0,len=valueList.length;i<len;i++){
                obj[valueList[i].name] = valueList[i].value[j]
            }
            ent.push(obj)
        } 
        //  console.log(ent);
         $(`#dataTable`).jsGrid({
             width: "98%",
             // height: "400px",
             data: ent,
             resize: true,
             fields: [
                 {
                     name: "name", type: "text", width: 50, align: "center",
                     itemTemplate: function (value, item) {
                         // console.log(item);
                         return `<p>${item.name}</p>`
                     }
                 },
                 {
                     name: "type", type: "text", width: 50, align: "center",
                     itemTemplate: function (value, item) {
                         // console.log(item);
                         return `<p>${item.type}</p>`
                     }
                 },
                 {
                     name: "form", type: "text", width: 50, align: "center",
                     itemTemplate: function (value, item) {
                         // console.log(item);
                         return `<p>${item.form}</p>`
                     }
                 },
                 {
                     name: "rows", type: "text", width: 50, align: "center",
                     itemTemplate: function (value, item) {
                         // console.log(item);
                         return `<p>${item.rows}</p>`
                     }
                 },
                 {
                     name: "columns", type: "text", width: 50, align: "center",
                     itemTemplate: function (value, item) {
                         // console.log(item);
                         return `<p>${item.columns}</p>`
                     }
                 },
                 {
                     name: "bytes", type: "text", width: 50, align: "center",
                     itemTemplate: function (value, item) {
                         // console.log(item);
                         return `<p>${item.bytes}</p>`
                     }
                 },
                 {
                     name: "shared", type: "text", width: 50, align: "center",
                     itemTemplate: function (value, item) {
                         // console.log(item);
                         return `<p>${item.shared}</p>`
                     }
                 },
                 {
                     name: "extra", type: "text", width: 50, align: "center",
                     itemTemplate: function (value, item) {
                         // console.log(item);
                         return `<p>${item.extra}</p>`
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

