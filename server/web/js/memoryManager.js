
var currNodeSite = null;
var tabToIndex = {"pubConns": 0, "subConns": 1, "pubTables": 2, "subWorkers": 3};

$(document).ready(function () {
    nodeUrl = GetFullUrl(window.location.host);
    var nodeApi = new DatanodeServer(nodeUrl);
    var clusterPerf = nodeApi.runSync("getClusterPerf()");
    var nodeSites = clusterPerf.object[0].value[2].value;

    var nodeHosts = [];
    var doneFirst = false;
    for (var nodeSite of nodeSites) {
        var nodeSiteArr = nodeSite.split(":");
        if (nodeSiteArr[2] !== "agent") {
            var currHost = nodeSiteArr[0] + ":" + nodeSiteArr[1];
            nodeHosts.push(currHost);
            if (!doneFirst) {
                $("#nodes").append("<button type='button' value=" + nodeSite + " class='btn btn-sm btn-info' title=" + currHost + ">" + nodeSiteArr[2] + "</button>");
                doneFirst = true;
            } else {
                $("#nodes").append("<button type='button' value=" + nodeSite + " class='btn btn-sm btn-default' title=" + currHost + ">" + nodeSiteArr[2] + "</button>");
            }
        }
    }

    

    currNodeSite = $("#nodes button:first").val();
    displayTable(currNodeSite);

    var controller = new ControllerServer(nodeUrl);
    var currentUser = controller.getCurrentUser(); 
    $(".panelbody .row").hide();
    if (currentUser.userId == "guest") {
        $("#btnLogin").show();
        $("#btnLogout").hide();
        $("#btnAdmin").hide();
    } else {
        $("#btnLogin").hide();
        $("#btnLogout").show();
        $("#lblLogin").text("[" + currentUser.userId + "]");
        if (currentUser.isAdmin == true) {
            $("#btnAdmin").show();
        } else {
            $("#btnAdmin").hide();
        }
    }

    $("#btnLogout").bind("click", function () {
        var user = JSON.parse(localStorage.getItem("DolphinDB_CurrentUsername"));
        var controller = new ControllerServer(wa_url);
        controller.logout(user.userId, function (re) {
            if (re.resultCode === "0") {
                localStorage.setItem("DolphinDB_CurrentUsername", "");
                localStorage.setItem(session_storage_id, "");
                window.location.reload();
            } else {
                alert(re.msg);
            }
        })
    });
});



var displayTable = function (currNodeSite) {
    var currNodeSiteArr = currNodeSite.split(":");
    var currNodeUrl = GetFullUrl(currNodeSiteArr[0] + ":" + currNodeSiteArr[1]);
    var currNodeApi = new DatanodeServer(currNodeUrl);
    currNodeApi.runSync("login('admin', '123456')");
    // sessionObjs
   
    var sessionRe = currNodeApi.runSync("getSessionMemoryStat()");
    console.log(sessionRe);

    $("#memoryTable p, #memoryTable table").remove();
    if (sessionRe.resultCode === "1") {
        alert(sessionRe.msg);
    } else {
        var valueList =  sessionRe.object[0].value
        console.log(valueList);
        var ent = []
        for (var j=0;j<valueList[0].value.length;j++){
            var obj = {}
            for (var i=0,len=valueList.length;i<len;i++){
                obj[valueList[i].name] = valueList[i].value[j]
            }
            ent.push(obj)
        } 
        // console.log(ent);

        // table1 title
        $("#title1").append("<p style='text-align: center; font-weight: bold; font-size: 16px;'>" +  "memory usage of all sessions on " + currNodeSiteArr[2] + "</p>");
        console.log(ent);
        $("#memoryTable1").jsGrid({
            width: "100%",
            // height: "400px",
            data: ent,
            resize: true,
            fields: [
                {
                    name: "userId", type: "text", width: 50, align: "center",
                    itemTemplate: function (value, item) {
                        // console.log(item);
                        return `<p>${item.userId}</p>`
                    }
                },
                {
                    name: "seesionId", type: "text", width: 50, align: "center",
                    itemTemplate: function (value, item) {
                        // console.log(item);
                        return `<p>${item.seesionId}</p>`
                    }
                },
                {
                    name: "memSize", type: "text", width: 50, align: "center",
                    itemTemplate: function (value, item) {
                        // console.log(item);
                        return `<p>${item.memSize}</p>`
                    }
                },
                {
                    name: "remoteIp", type: "text", width: 50, align: "center",
                    itemTemplate: function (value, item) {
                        // console.log(item);
                        return `<p>${item.remoteIP}</p>`
                    }
                },
                {
                    name: "remotePort", type: "text", width: 50, align: "center",
                    itemTemplate: function (value, item) {
                        // console.log(item);
                        return `<p>${item.remotePort}</p>`
                    }
                },
                {
                    name: "createTime", type: "text", width: 50, align: "center",
                    itemTemplate: function (value, item) {
                        // console.log(item);
                        return `<p>${item.createTime}</p>`
                    }
                },
                {
                    name: "lastActiveTime", type: "text", width: 50, align: "center",
                    itemTemplate: function (value, item) {
                        // console.log(item);
                        return `<p>${item.lastActiveTime}</p>`
                    }
                },
                
            ]
        })
        
    }

    var objsRe = currNodeApi.runSync("objs(true)");
    console.log(objsRe);
    if (objsRe.resultCode === "1") {
        alert(objsRe.msg);
    } else {
        var valueList =  objsRe.object[0].value
        console.log(valueList);
        var ent = []
        for (var j=0;j<valueList[0].value.length;j++){
            var obj = {}
            for (var i=0,len=valueList.length;i<len;i++){
                obj[valueList[i].name] = valueList[i].value[j]
            }
            ent.push(obj)
        } 
        console.log(ent);
         // table1 title
         $("#title2").append("<p style='text-align: center; font-weight: bold; font-size: 16px;'>" +  "memory usage of all variables on " + currNodeSiteArr[2] + " (including variables shared by other sessions)" + "</p>");
         console.log(ent);
         $("#memoryTable2").jsGrid({
             width: "100%",
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
                 
             ]
         })
       
    }
     
};


