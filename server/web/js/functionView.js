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
    bindGrid();
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

var codeMirrorEditor = function (element, width, height) {
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
        extraKeys: {
            "Ctrl-Alt-Space": "autocomplete"
        },
        hintOptions: {
            tables: {

            }
        }
    });

    editor.setSize(width, height);
    return editor;
};


var newFuncEditor 
var updateFuncEditor
// var updateFuncEditor = codeMirrorEditor($("#updateFuncView")[0], 900, 200);


var swapCheck = function () {
    if (isCheckAll) {
        $("input[type='checkbox']").each(function () {
            this.checked = false;
        });
        isCheckAll = false;
        selectedFuncViews = [];
    } else {
        $("input[type='checkbox']").each(function () {
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
            selectedFuncViews.push({
                "name": name,
                "body": body
            });
        }
    }
}

var bindGrid = function () {
    var re = nodeApi.getFunctionViews();
    // console.log(re);
    if (re.resultCode === "1") {
        alert(re.msg);
        parent.window.location.reload()

    } else {
        $("#functionViewTable").empty();
        var res = re.object[0];
        // name
        var nameList = res.value[0].value;
        // body
        var bodyList = res.value[1].value;
        var ent = []
        for (var i = 0; i < nameList.length; i++) {
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
            allFunctionViews.push({
                "name": name,
                "body": body
            });
        }

        $("#functionViewTable").jsGrid({
            width: "100%",
            // height: "400px",
            data: ent,
            resize: true,
            fields: [{
                    name: "FuncName",
                    type: "text",
                    width: 50,
                    align: "center",
                    itemTemplate: function (value, item) {
                        // console.log(item);
                        return `<p>${item.name}</p>`
                    }
                },
                {
                    name: "FuncDescription",
                    type: "text",
                    width: 500,
                    align: "center",
                    itemTemplate: function (value, item) {

                        return `<p>${item.body}</p>`
                    }
                },
                {
                    name: "Setting",
                    type: "text",
                    width: 50,
                    align: "center",
                    itemTemplate: function (value, item) {

                        return `<a href='###'  data-value="${item.name}" onclick="btnUpdateFunctionView('${item.name}')">Update<i class="Hui-iconfont">&#xe647;</i></a>`
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

var addDialog = `    <dialog id="newFuncViewDialog">
<form method="dialog">
  <p>
      <label>Add new function to DolphinDB Function View:</label>
      <div id="cm_container" class="panel panel-default" style="margin-bottom: 10px;min-height:150px;max-height:255px; overflow-y:auto">
          <textarea id="newFuncView" cols="5" style="width:100%;"></textarea>
      </div>
        
   
</p>
  <menu  class="text-center" style="padding-inline-start: 0px;">
    <button class="btn btn-sm  btn-info" id="confirmFuncViewBtn" value="default" >Confirm</button>
    <button class="btn btn-sm btn-light" value="cancel">Cancel</button>
  </menu>
</form>
</dialog>`

$("#btnAddFunctionView").bind("click", function (e) {
    $("#newFuncViewDialog").remove()
    $('body').prepend(addDialog)
    $("#newFuncViewDialog")[0].showModal();
    newFuncEditor = codeMirrorEditor($("#newFuncView")[0], 900, 200);
    newFuncEditor.setValue("  ");
    $("#confirmFuncViewBtn").bind("click", function (e) {
        // console.log('confirm add func');
        // var userInput = $("#newFuncView").val();
        var userInput = newFuncEditor.getValue();
        // encoding
        userInput = encodeURIComponent(userInput)
        var test = nodeApi.runSync(userInput);
        // console.log(test);
        // console.log(userInput);
        var i = userInput.indexOf("def");
        var j = userInput.indexOf("(");
        if (i === -1 || j === -1) {
            alert("Please provide a valid function definition");
            return false;
        }
        if (test.resultCode === '1'){
            alert(test.msg)
            return false
        }
        var funcName = userInput.substring(i + 3, j).trim();
        nodeApi.addFunctionView(funcName);
       
        bindGrid();
    });
});



$("#btnDeleteFunctionView").bind("click", function (e) {
    if (selectedFuncViews.length === 0) {
        $('#btn_refresh').after(`<div class="alert alert-warning fade in" id="grant_alert">
        <button type="button" class="close" data-dismiss="alert">&times;</button>
        <strong> Please select as least one function to delete !</strong> 
    </div>`)
    } else {
        for (var funcView of selectedFuncViews) {
            var funcName = funcView["name"];
            nodeApi.dropFunctionView(funcName);
        }
        bindGrid();
        selectedFuncViews = [];
    }
});


var updatedialog = ` 
<dialog id="updateFuncViewDialog">
    <form method="dialog">
      <p>
          <label>Update function in DolphinDB Function View:</label>
        <div id="cm_container" class="panel panel-default" style="margin-bottom: 10px;min-height:150px;max-height:255px; overflow-y:auto">
            <textarea id="updateFuncView" cols="5" style="width:100%;"></textarea>
        </div>
          
      
    </p>
      <menu  class="text-center" style="padding-inline-start: 0px;">
        <button class="btn btn-sm btn-info" id="confirmUpdateBtn" value="default">Confirm</button>
        <button class="btn btn-sm btn-light" value="cancel">Cancel</button>
      </menu>
    </form>
</dialog>`

var btnUpdateFunctionView = function (funcName) {
    $("#updateFuncViewDialog").remove()
    $('body').prepend(updatedialog)
    console.log(funcName);
    updateFuncEditor = codeMirrorEditor($("#updateFuncView")[0], 900, 200);
    $("#updateFuncViewDialog")[0].showModal();
    for (var i = 0; i < allFunctionViews.length; i++) {
        var currFuncName = allFunctionViews[i]["name"];
        if (currFuncName === funcName) {
            updateFuncEditor.setValue(allFunctionViews[i]["body"]);
        }
    }

    $("#confirmUpdateBtn").bind("click", function (e) {
        // console.log(e);
        e.stopPropagation()
        var updatedInput = updateFuncEditor.getValue();
        // console.log(updatedInput);
        var i = updatedInput.indexOf("def");
        var j = updatedInput.indexOf("(");
        if (i === -1 || j === -1) {
            alert("Please provide a valid function definition");
            return false;
        }
        // new function name
        var newFuncName = updatedInput.substring(i + 3, j).trim();
        //encoding
        updatedInput = encodeURIComponent(updatedInput)
        var res = nodeApi.runSync(updatedInput);
        if (res.resultCode === '1'){
            alert(res.msg)
            return false
        }
        // console.log(document.querySelector('#updateFuncViewDialog').returnValue);
        // drop and then add
        nodeApi.dropFunctionView(funcName);
        nodeApi.addFunctionView(newFuncName);
        bindGrid();

    });
}



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
