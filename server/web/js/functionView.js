var nodeApi = null;
var allFunctionViews = [];
var selectedFuncViews = [];
var isCheckAll = false;

$(document).ready(function () {
    nodeUrl = GetFullUrl(window.location.host);
    nodeApi = new DatanodeServer(nodeUrl);
    var controller = new ControllerServer(nodeUrl);
    var currentUser = controller.getCurrentUser();
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
    getAllFuncViews();
});

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

var codeMirrorEditor = function(element, width, height) {
    var editor = CodeMirror.fromTextArea(element, {
    //     showCursorWhenSelecting: true,
    //     cursorHeight: 0.85,
    //     lineNumbers: true,
    //     styleActiveLine: true,
    //     mode: 'text/x-ddb',
    //     lineWrapping: true,
    // 　  readOnly: false,
    //     styleActiveLine: true,
    //     matchBrackets: true
        mode: 'text/x-ddb',
        indentWithTabs: true,
        smartIndent: true,
        // lineNumbers: true,
        matchBrackets: true,
        autofocus: true,
        viewportMargin: Infinity,
        extraKeys: { "Ctrl-Alt-Space": "autocomplete" },
        hintOptions: {
            tables: {
                
            }
        }
    });
    
    editor.setSize(width, height);
    return editor;
};

var newFuncEditor = codeMirrorEditor($("#newFuncView")[0], 900, 200);
var updateFuncEditor = codeMirrorEditor($("#updateFuncView")[0], 900, 200);


var swapCheck = function() {
    if (isCheckAll) {
        $("input[type='checkbox']").each(function() {
            this.checked = false;
        });
        isCheckAll = false;
        selectedFuncViews = [];
    } else {
        $("input[type='checkbox']").each(function() {
            this.checked = true;
        })
        isCheckAll = true;
        var res = nodeApi.getFunctionViews().object[0];
        var nameList = res.value[0].value;
        var bodyList = res.value[1].value;
        selectedFuncViews = [];
        for (var i = 0; i < nameList.length; i++) {
            var name = nameList[i];
            var body = bodyList[i];
            selectedFuncViews.push({"name": name, "body": body});
        }
    }
}

var getAllFuncViews = function() {
    var re = nodeApi.getFunctionViews();
    // console.log(re);
    if (re.resultCode === "1") {
        alert(re.msg);
    } else {
        $("#functionViewTable").empty();
        var res = re.object[0];
        // name
        var nameList = res.value[0].value;
        // body
        var bodyList = res.value[1].value;
        var ent = []
        for (var i=0;i<nameList.length;i++){
            var obj = {}
            obj['name'] = nameList[i]
            obj['body'] = bodyList[i]
            ent.push(obj)
        }
        console.log(ent);

        // allFunctionViews
        allFunctionViews = [];
        for (var i = 0; i < nameList.length; i++) {
            var name = nameList[i];
            var body = bodyList[i];
            allFunctionViews.push({"name": name, "body": body});
        }
     
        $("#functionViewTable").jsGrid({
            width: "100%",
            // height: "400px",
            data: ent,
            resize: true,
            fields: [
                {
                    name: "FuncName", type: "text", width: 50, align: "center",
                    itemTemplate: function (value, item) {
                        // console.log(item);
                        return `<p>${item.name}</p>`
                    }
                },
                {
                    name: "FuncDescription", type: "text", width: 500, align: "center",
                    itemTemplate: function (value, item) {
                       
                        return `<p>${item.body}</p>`
                    }
                },
                {
                    name: "Setting", type: "text", width: 50, align: "center",
                    itemTemplate: function (value, item) {
                       
                        return `<a href='###' class='btnUpdateFunctionView' data-value="${item.name}">Update<i class="Hui-iconfont">&#xe647;</i></a>`
                    }
                },
                
               
                {
                    headerTemplate: function () {
                        return "<a href='###' onclick='swapCheck()' >Select All <i class='Hui-iconfont'>&#xe676;</i></a>"

                    },
                    itemTemplate: function (_, item) {
                        return $("<input>").attr("type", "checkbox").attr("class", "funcView").attr("value", item.name);
                    },
                    align: "center",
                    width: 50
                }
            ]
        })

    }
};

$("#btnAddFunctionView").bind("click", function (e) {
    var newFuncViewDialog = $("#newFuncViewDialog");
    // $("#newFuncView").val("");
    newFuncViewDialog[0].showModal();
    newFuncEditor.setValue("  ");
    $("#confirmFuncViewBtn").bind("click", function (e) {
        // var userInput = $("#newFuncView").val();
        var userInput = newFuncEditor.getValue();
        nodeApi.runSync(userInput);
        var i = userInput.indexOf("def");
        var j = userInput.indexOf("(");
        if (i === -1 || j === -1) {
            alert("Please provide a valid function definition");
            return;
        }
        var funcName = userInput.substring(i + 3, j).trim();
        nodeApi.addFunctionView(funcName);
        getAllFuncViews();
    });
});



$("#btnDeleteFunctionView").bind("click", function (e) {
    if (selectedFuncViews.length === 0) {
        alert("Please select at least one function view to be deleted");
    } else {
        for (var funcView of selectedFuncViews) {
            var funcName = funcView["name"];
            nodeApi.dropFunctionView(funcName);
        }
        getAllFuncViews();
        selectedFuncViews = [];
    }
});

$("#functionViewTable").on("click", ".btnUpdateFunctionView", function (e) {
    // previous function name
    // console.log($(this)[0].dataset.value);
    
    var selectedFuncName = $(this)[0].dataset.value;
    console.log(selectedFuncName);
    var updateFuncViewDialog = $("#updateFuncViewDialog");
    updateFuncViewDialog[0].showModal();
    for (var i = 0; i < allFunctionViews.length; i++) {
        var currFuncName = allFunctionViews[i]["name"];
        if (currFuncName === selectedFuncName) {
            console.log();
            updateFuncEditor.setValue(allFunctionViews[i]["body"]);
        }
    }
    
    $("#confirmUpdateBtn").bind("click", function (e) {
        var updatedInput = updateFuncEditor.getValue();
        var i = updatedInput.indexOf("def");
        var j = updatedInput.indexOf("(");
        if (i === -1 || j === -1) {
            alert("Please provide a valid function definition");
            return;
        }
        // new function name
        var funcName = updatedInput.substring(i + 3, j).trim();
        // drop and then add
        nodeApi.dropFunctionView(selectedFuncName);
        nodeApi.runSync(updatedInput);
        nodeApi.addFunctionView(funcName);
        getAllFuncViews();
    });
    selectedFuncViews = [];
});

$("#functionViewTable").on("change", ".funcView", function () {
    // name
    var name = $(this).val();
    // body
    for (var funcView of allFunctionViews) {
        if (funcView["name"] === name) {
            if ($(this).is(':checked')) {
                selectedFuncViews.push(funcView);
                return;
            } else {
                var removeIdx;
                for (var idx = 0; idx < selectedFuncViews.length; idx++) {
                    var currFuncName = selectedFuncViews[idx]["name"];
                    if (currFuncName === name) {
                        removeIdx = idx;
                        selectedFuncViews.splice(removeIdx, 1);
                        return;
                    }
                }
            }
        }
    }
});

// refresh handler
$('#btn_refresh').bind('click',function(){
    getAllFuncViews()
})

// searchboxs
$('#searchbox').keyup(function(){
    // console.log('1');
    $("table tbody tr").hide().filter(":contains('" + ($(this).val()) + "')" ).show()

})