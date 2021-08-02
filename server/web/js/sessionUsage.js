
var currNodeSite = null;
var tabToIndex = {"pubConns": 0, "subConns": 1, "pubTables": 2, "subWorkers": 3};
var allNodeSite = null;
$(document).ready(function () {
    nodeUrl = GetFullUrl(window.location.host);
    var nodeApi = new DatanodeServer(nodeUrl);
    var clusterPerf = nodeApi.runSync("getClusterPerf()");
    var nodeSites = clusterPerf.object[0].value[2].value;

    var nodeHosts = [];
    var doneFirst = false;
    for (var nodeSite of nodeSites) {
        var nodeSiteArr = nodeSite.split(":");
        if (!nodeSiteArr[2].includes("agent") ) {
            var currHost = nodeSiteArr[0] + ":" + nodeSiteArr[1];
            nodeHosts.push(currHost);       
            $("#nodes").append("<button type='button' value=" + nodeSite + " class='btn btn-sm' title=" + currHost + ">" + nodeSiteArr[2] + "</button>");
        }
    }

    displayAllTable()

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
    // init display 
    $("#nodes button:first").addClass("btn-info")
    $(".table-div:first").show().siblings().hide()

    // switch datanode
    $("#nodes button").bind('click',function(){
        // console.log('1');
        $(this).addClass("btn-info").siblings().removeClass("btn-info")
        $(".table-div").eq($(this).index()).show().siblings().hide()
    })

     // searchbox
     $('#searchbox').keyup(function(){
        // console.log('1');
        $("table tbody tr").hide().filter(":contains('" + ($(this).val()) + "')" ).show()

    })
});



var displayTable = function (currNodeSite) {
    var currNodeSiteArr = currNodeSite.split(":");
    var currNodeUrl = GetFullUrl(currNodeSiteArr[0] + ":" + currNodeSiteArr[1]);
    var currNodeApi = new DatanodeServer(currNodeUrl);
    currNodeApi.runSync("login('admin', '123456')");
    // sessionObjs
   
    var sessionRe = currNodeApi.runSync("getSessionMemoryStat()");
    console.log(sessionRe);

    // $("#memoryTable p, #memoryTable table").remove();
    if (sessionRe.resultCode === "1") {
        alert(sessionRe.msg);
    } else {
        $("#dataTable").append(`<div class="table-div" id="${currNodeSiteArr[2]}"></div>`)
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
        console.log(ent);
        $(`#${currNodeSiteArr[2]}`).jsGrid({
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
                    name: "sessionId", type: "text", width: 50, align: "center",
                    itemTemplate: function (value, item) {
                        // console.log(item);
                        return `<p>${item.sessionId}</p>`
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
     
};
var displayAllTable = function(){
    allNodeSite = $("#nodes button");
    for (var i=0,len=allNodeSite.length;i<len;i++){
        var currNodeSite = allNodeSite[i].value
        // console.log(currNodeSite);
        displayTable(currNodeSite);
    }
    console.log('1');
}

$("#btn_refresh").bind('click',function(){
    displayAllTable()
})


