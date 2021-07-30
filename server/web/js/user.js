var controllerUrl = GetFullUrl(window.location.host);
var ctlApi = null;
var nodeApi = new DatanodeServer(controllerUrl);
$(function () {
    bindGrid();
     // searchbox
     $('#searchbox').keyup(function(){
        // console.log('1');
        $("table tbody tr").hide().filter(":contains('" + ($(this).val()) + "')" ).show()

    })
});

var bindGrid = function () {
    ctlApi = new ControllerServer(controllerUrl);
    ctlApi.getUserList(function (re) {
        var ent = re;
        console.log(ent);
        $('#jsgrid').jsGrid({
            width: "100%",
            // height: "400px",
            data: ent,
            resize: true,
            fields: [{
                    name: "userId",
                    title: "User Name",
                    type: "text",
                    align: "center",
                    width: 150
                },
                {
                    name: "Script Execution",
                    type: "text",
                    width: 50,
                    align: "center",
                    itemTemplate: function (value, item) {
                        // console.log(item);
                        var s = "";
                        if (item.SCRIPT_EXEC == "allow") {
                            s = "checked"
                        }
                        return "<input type='checkbox' " + s + " onclick=\"setScriptExec('" + item.userId + "')\"/>"
                    }
                },
                {
                    name: "Script Test",
                    type: "text",
                    width: 50,
                    align: "center",
                    itemTemplate: function (value, item) {
                        var s = "";
                        if (item.TEST_EXEC == "allow") {
                            s = "checked"
                        }
                        return "<input type='checkbox' " + s + " onclick=\"setUnitTest('" + item.userId + "')\"/>"
                    }
                },
                {
                    name: "DB Management",
                    type: "text",
                    width: 50,
                    align: "center",
                    itemTemplate: function (value, item) {
                        var s = "";
                        if (item.DB_MANAGE == "allow") {
                            s = "checked"
                        }
                        return "<input type='checkbox' " + s + " onclick=\"setDBCreate('" + item.userId + "')\"/>"
                    }
                },
                {
                    name: "DB Ownership",
                    type: "text",
                    width: 50,
                    align: "center",
                    itemTemplate: function (value, item) {
                        var s = "";
                        if (item.DB_OWNER == "allow") {
                            s = "checked"
                        }
                        return "<input type='checkbox' " + s + " onclick=\"setDBOwner('" + item.userId + "')\"/>"
                    }
                },
                {
                    name: "View Execution",
                    type: "text",
                    width: 50,
                    align: "center",
                    itemTemplate: function (value, item) {
                        // console.log(item);
                        return `<a href='###' onclick='setViewGrant("${item.userId}")'>set</a>`
                    }
                },
                {
                    name: "Table Access",
                    type: "text",
                    width: 50,
                    align: "center",
                    itemTemplate: function (value, item) {
                        // console.log(item);
                        return `<a href='###' onclick='setReadGrant("${item.userId}")'>Read</a> | <a href='###' onclick='setWriteGrant("${item.userId}")'>Write</a> `
                    }
                },
                {
                    name: "DBObj Access",
                    type: "text",
                    width: 50,
                    align: "center",
                    itemTemplate: function (value, item) {
                        // console.log(item);
                        return `<a href='###' onclick='setCreateGrant("${item.userId}")'>Create</a> | <a href='###' onclick='setDeleteGrant("${item.userId}")'>Delete</a> `
                    }
                },

                {
                    headerTemplate: function () {
                        return "<a href='###' onclick='swapCheck()' >Select All <i class='Hui-iconfont'>&#xe676;</i></a>"

                    },
                    itemTemplate: function (_, item) {
                        return $("<input>").attr("type", "checkbox").attr("name", "chkSelect").attr("id", "chkSelect").attr("value", item.userId);
                    },
                    align: "center",
                    width: 50
                }
            ]
        });
    });
}

// add enventListener for add button
$("#btn_Add").bind("click", function () {
    var dialog = new DolphinDialog("dialogAdd");
    dialog.open({
        width: 300,
        height: 230,
        modal: true,
        buttons: {
            "Save": function () {
                ctlApi.createUser($("#txtUsername").val(), $("#txtPassword").val(), $("#chkIsAdmin").prop("checked"), function () {
                    bindGrid();
                });
                $(this).dialog("close");
            },
            "Cancel": function () {
                $(this).dialog("close");
            }
        }
    });
});

// add eventListener for delete button 
$("#btn_Del").bind("click", function () {
    if ($("#chkSelect:checked").length == 0) {
        alert("please choose the users you want to delete")
    }
    $.each($("#chkSelect:checked"), function (i, e) {
        ctlApi.deleteUser(e.value, function (re) {
            bindGrid();
        });
    });
});

// add eventListener for revoke button
$('#btn_Revoke').bind("click",function() {
    var selectedUser = $("#chkSelect:checked")
    if (selectedUser.length == 0) {
        alert("please choose the users you want to delete")
    }else {
        // console.log(selectedUser);
        $('#revokeDialog')[0].showModal()
        $('#revokeGrid').empty()
        $('#revokeGrid').append(`
        
        <div class="grantcheckbox">
            <input type="checkbox" name="grantcheckselect" id="" value="SCRIPT_EXEC">
            <label for="">Script Execution</label>
        </div>
        <div class="grantcheckbox">
            <input type="checkbox" name="grantcheckselect" id="" value="TEST_EXEC">
            <label for="">Script Test</label>
        </div>
        <div class="grantcheckbox">
            <input type="checkbox" name="grantcheckselect" id="" value="DB_MANAGE">
            <label for="">DB Management</label>
        </div>
        <div class="grantcheckbox">
            <input type="checkbox" name="grantcheckselect" id="" value="DB_OWNER">
            <label for="">DB Ownership</label>
        </div>
        <div class="grantcheckbox">
            <input type="checkbox" name="grantcheckselect" id="" value="VIEW_EXEC">
            <label for="">View Execution *</label>
        </div>
        <div class="grantcheckbox">
            <input type="checkbox" name="grantcheckselect" id="" value="TABLE_READ">
            <label for="">Table Read *</label>
        </div>
        <div class="grantcheckbox">
            <input type="checkbox" name="grantcheckselect" id="" value="TABLE_WRITE">
            <label for="">Table Write *</label>
        </div>
        <div class="grantcheckbox">
            <input type="checkbox" name="grantcheckselect" id="" value="DBOBJ_CREATE">
            <label for="">DBObj Create *</label>
        </div>
        <div class="grantcheckbox">
            <input type="checkbox" name="grantcheckselect" id="" value="DBOBJ_DELETE">
            <label for="">DBObj Delete *</label>
        </div>
        <div class="grantcheckbox">
            <input type="checkbox" name="seletAll" id="" onclick='swapGrantCheck()'>
            <label for="" style="color:#016090; font-weight: bold;">seletAll</label>
        </div>
        <div>* : revoke all </div>
      
        `)
        // confirm revoke handler
        $('#confirmrevokeBtn').bind('click',function(){
            for(var i=0,leni=selectedUser.length;i<leni;i++){
                // all selected Userid
                var user = selectedUser[i].value
                var selectedGrant = $('input[name="grantcheckselect"]:checked')
                for(var j=0,lenj=selectedGrant.length;j<lenj;j++){
                    ctlApi.revoke(user,selectedGrant[j].value,function(re){
                        console.log('revoke successful');
                    })
                }

            }
            bindGrid()
        })
        
    }
    

})


// set Script Execution
var setScriptExec = function (userId) {
    if (event.target.checked) {
        ctlApi.grant(userId, 6, [], function (re) {
            bindGrid();
        });
    } else {
        ctlApi.deny(userId, 6, [],function (re) {
            bindGrid();
        });
    }
}

// set Script Test
var setUnitTest = function (userId) {
    if (event.target.checked) {
        ctlApi.grant(userId, 7, [], function (re) {
            bindGrid();
        });
    } else {
        ctlApi.deny(userId, 7, [],function (re) {
            bindGrid();
        });
    }
}

// set DB Management
var setDBCreate = function (userId) {
    if (event.target.checked) {
        ctlApi.grant(userId, 4, [], function (re) {
            bindGrid();
        });
    } else {
        ctlApi.deny(userId, 4, [],function (re) {
            bindGrid();
        });
    }
}

// set DB ownership
var setDBOwner = function (userId) {
    if (event.target.checked) {
        ctlApi.grant(userId, 10, [], function (re) {
            bindGrid();
        });
    } else {
        ctlApi.deny(userId, 10,[], function (re) {
            bindGrid();
        });
    }
}

// set View Execution
var setViewGrant = function (userId) {
    // var userAccess = nodeApi.getUserAccess(userId)
    var userAccess = new DolphinEntity(nodeApi.getUserAccess(userId)).toTable()[0]
    // console.log(userAccess);
    // console.log(document.querySelector('#settingViewExecuteDialog'));
    // console.log($('#settingViewExecuteDialog'));
    $('#settingViewExecuteDialog')[0].showModal()
    // document.querySelector('#settingViewExecuteDialog').showModal()
    $('#viewExecutionLabel').empty()
    $('#viewExecutionLabel').append(`Setting ${userId}'s View Execution Grant:`)
    var re = nodeApi.getFunctionViews()
    // console.log(re);
    var ent = re.object[0].value[0].value
    // console.log(ent);
    $('#viewExecutionGrid').jsGrid({
        width: '100%',
        data: ent,
        resize: true,
        fields: [{
                name: "FuncName",
                type: "text",
                width: 100,
                align: "center",
                itemTemplate: function (value, item) {
                    return `<p>${item}</p>`
                }
            },
            {
                name: "Grant",
                type: "text",
                width: 50,
                align: "center",
                itemTemplate: function (value, item) {
                    var ifChecked = ''
                    if (userAccess.VIEW_EXEC_allowed.split(',').includes(item)) {
                        ifChecked = 'checked'
                    }
                    return `<input type="radio" name = "${item}" ${ifChecked} value="grant" data-user="${userId}"/>`
                }
            },
            {
                name: "Deny",
                type: "text",
                width: 50,
                align: "center",
                itemTemplate: function (value, item) {
                    var ifChecked = ''
                    if (userAccess.VIEW_EXEC_denied.split(',').includes(item)) {
                        ifChecked = 'checked'
                    }
                    return `<input type="radio" name = "${item}" ${ifChecked} value="deny" data-user="${userId}"/>`
                }
            },

        ]
    })

}
// confirm function view setting
var confirmFuncViewSetting = function () {
    var checkList = $("input[type='radio']:checked")
    // console.log($("input[type='radio']:checked"));
    for (var i = 0, len = checkList.length; i < len; i++) {
        // console.log(checkList[i].name,checkList[i].value,checkList[i].dataset.user);

        ctlApi[checkList[i].value](checkList[i].dataset.user, 5, checkList[i].name, function (re) {
            console.log('setting successful');
        });

    }


}

// set table read
var setReadGrant = function (userId) {
    var userAccess = new DolphinEntity(nodeApi.getUserAccess(userId)).toTable()[0]
    // console.log(userAccess);
    var allDFSTables = nodeApi.getClusterDFSTables().object[0].value;
    // console.log(allDFSTables);
    $('#settingTableReadDialog')[0].showModal()

    $('#TableReadLabel').empty()
    $('#TableReadLabel').append(`Setting ${userId}'s Table Read Grant:`)
    var re = nodeApi.getFunctionViews()

    var ent = re.object[0].value[0].value

    $('#TableReadGrid').jsGrid({
        width: '100%',
        data: allDFSTables,
        resize: true,
        fields: [{
                name: "Tables Name",
                type: "text",
                width: 100,
                align: "center",
                itemTemplate: function (value, item) {
                    return `<p>${item}</p>`
                }
            },
            {
                name: "Grant",
                type: "text",
                width: 50,
                align: "center",
                itemTemplate: function (value, item) {
                    var ifChecked = ''
                    if (userAccess.TABLE_READ_allowed.split(',').includes(item)) {
                        ifChecked = 'checked'
                    }
                    return `<input type="radio" name = "${item}" ${ifChecked} value="grant" data-user="${userId}"/>`
                }
            },
            {
                name: "Deny",
                type: "text",
                width: 50,
                align: "center",
                itemTemplate: function (value, item) {
                    var ifChecked = ''
                    if (userAccess.TABLE_READ_denied.split(',').includes(item)) {
                        ifChecked = 'checked'
                    }
                    return `<input type="radio" name = "${item}" ${ifChecked} value="deny" data-user="${userId}"/>`
                }
            },

        ]
    })

}
// confirm table read setting
var confirmTableReadSetting = function () {
    var checkList = $("input[type='radio']:checked")
    // console.log($("input[type='radio']:checked"));
    for (var i = 0, len = checkList.length; i < len; i++) {
        // console.log(checkList[i].name,checkList[i].value,checkList[i].dataset.user);

        ctlApi[checkList[i].value](checkList[i].dataset.user, 0, checkList[i].name, function (re) {
            console.log('setting successful');
        });

    }


}

// set table Write
var setWriteGrant = function (userId) {
    var userAccess = new DolphinEntity(nodeApi.getUserAccess(userId)).toTable()[0]
    // console.log(userAccess);
    var allDFSTables = nodeApi.getClusterDFSTables().object[0].value;
    // console.log(allDFSTables);
    $('#settingTableWriteDialog')[0].showModal()

    $('#TableWriteLabel').empty()
    $('#TableWriteLabel').append(`Setting ${userId}'s Table Write Grant:`)


    $('#TableWriteGrid').jsGrid({
        width: '100%',
        data: allDFSTables,
        resize: true,
        fields: [{
                name: "Tables Name",
                type: "text",
                width: 100,
                align: "center",
                itemTemplate: function (value, item) {
                    return `<p>${item}</p>`
                }
            },
            {
                name: "Grant",
                type: "text",
                width: 50,
                align: "center",
                itemTemplate: function (value, item) {
                    var ifChecked = ''
                    if (userAccess.TABLE_WRITE_allowed.split(',').includes(item)) {
                        ifChecked = 'checked'
                    }
                    return `<input type="radio" name = "${item}" ${ifChecked} value="grant" data-user="${userId}"/>`
                }
            },
            {
                name: "Deny",
                type: "text",
                width: 50,
                align: "center",
                itemTemplate: function (value, item) {
                    var ifChecked = ''
                    if (userAccess.TABLE_WRITE_denied.split(',').includes(item)) {
                        ifChecked = 'checked'
                    }
                    return `<input type="radio" name = "${item}" ${ifChecked} value="deny" data-user="${userId}"/>`
                }
            },

        ]
    })

}
// confirm table write setting
var confirmTableWriteSetting = function () {
    var checkList = $("input[type='radio']:checked")
    // console.log($("input[type='radio']:checked"));
    for (var i = 0, len = checkList.length; i < len; i++) {
        // console.log(checkList[i].name,checkList[i].value,checkList[i].dataset.user);

        ctlApi[checkList[i].value](checkList[i].dataset.user, 1, checkList[i].name, function (re) {
            console.log('setting successful');
        });

    }


}
// set DB Create
var setCreateGrant = function (userId) {
    var userAccess = new DolphinEntity(nodeApi.getUserAccess(userId)).toTable()[0]
    // console.log(userAccess);
    var allDFSDatabases = nodeApi.getClusterDFSDatabases().object[0].value;
    // console.log(allDFSDatabases);
    $('#settingDBcreateDialog')[0].showModal()

    $('#DBcreateLabel').empty()
    $('#DBcreateLabel').append(`Setting ${userId}'s DB Create Grant:`)


    $('#DBcreateGrid').jsGrid({
        width: '100%',
        data: allDFSDatabases,
        resize: true,
        fields: [{
                name: "Tables Name",
                type: "text",
                width: 100,
                align: "center",
                itemTemplate: function (value, item) {
                    return `<p>${item}</p>`
                }
            },
            {
                name: "Grant",
                type: "text",
                width: 50,
                align: "center",
                itemTemplate: function (value, item) {
                    var ifChecked = ''
                    if (userAccess.DBOBJ_CREATE_allowed.split(',').includes(item)) {
                        ifChecked = 'checked'
                    }
                    return `<input type="radio" name = "${item}" ${ifChecked} value="grant" data-user="${userId}"/>`
                }
            },
            {
                name: "Deny",
                type: "text",
                width: 50,
                align: "center",
                itemTemplate: function (value, item) {
                    var ifChecked = ''
                    if (userAccess.DBOBJ_CREATE_denied.split(',').includes(item)) {
                        ifChecked = 'checked'
                    }
                    return `<input type="radio" name = "${item}" ${ifChecked} value="deny" data-user="${userId}"/>`
                }
            },

        ]
    })

}
// confirm DB Create setting
var confirmDBCreateSetting = function () {
    var checkList = $("input[type='radio']:checked")
    // console.log($("input[type='radio']:checked"));
    for (var i = 0, len = checkList.length; i < len; i++) {
        // console.log(checkList[i].name,checkList[i].value,checkList[i].dataset.user);

        ctlApi[checkList[i].value](checkList[i].dataset.user, 2, checkList[i].name, function (re) {
            console.log('setting successful');
        });

    }


}


// set DB Delete
var setDeleteGrant = function (userId) {
    var userAccess = new DolphinEntity(nodeApi.getUserAccess(userId)).toTable()[0]
    // console.log(userAccess);
    var allDFSDatabases = nodeApi.getClusterDFSDatabases().object[0].value;
    // console.log(allDFSDatabases);
    $('#settingDBdeleteDialog')[0].showModal()

    $('#DBdeleteLabel').empty()
    $('#DBdeleteLabel').append(`Setting ${userId}'s DB Delete Grant:`)


    $('#DBdeleteGrid').jsGrid({
        width: '100%',
        data: allDFSDatabases,
        resize: true,
        fields: [{
                name: "Tables Name",
                type: "text",
                width: 100,
                align: "center",
                itemTemplate: function (value, item) {
                    return `<p>${item}</p>`
                }
            },
            {
                name: "Grant",
                type: "text",
                width: 50,
                align: "center",
                itemTemplate: function (value, item) {
                    var ifChecked = ''
                    if (userAccess.DBOBJ_DELETE_allowed.split(',').includes(item)) {
                        ifChecked = 'checked'
                    }
                    return `<input type="radio" name = "${item}" ${ifChecked} value="grant" data-user="${userId}"/>`
                }
            },
            {
                name: "Deny",
                type: "text",
                width: 50,
                align: "center",
                itemTemplate: function (value, item) {
                    var ifChecked = ''
                    if (userAccess.DBOBJ_DELETE_denied.split(',').includes(item)) {
                        ifChecked = 'checked'
                    }
                    return `<input type="radio" name = "${item}" ${ifChecked} value="deny" data-user="${userId}"/>`
                }
            },

        ]
    })

}
// confirm DB Delete setting
var confirmDBDeleteSetting = function () {
    var checkList = $("input[type='radio']:checked")
    // console.log($("input[type='radio']:checked"));
    for (var i = 0, len = checkList.length; i < len; i++) {
        // console.log(checkList[i].name,checkList[i].value,checkList[i].dataset.user);

        ctlApi[checkList[i].value](checkList[i].dataset.user, 3, checkList[i].name, function (re) {
            console.log('setting successful');
        });

    }


}


// selected all handler
var isCheckAll = false
var swapCheck = function () {
    if (isCheckAll) {
        $("input[name='chkSelect']").each(function () {
            this.checked = false;
        });
        isCheckAll = false;
        selectedUsers = [];
    } else {
        $("input[name='chkSelect']").each(function () {
            this.checked = true;
        })
        isCheckAll = true;

    }
}

// selected all handler
var isCheckAllGrant = false
var swapGrantCheck = function () {
    if (isCheckAllGrant) {
        $("input[name='grantcheckselect']").each(function () {
            this.checked = false;
        });
        isCheckAllGrant = false;
       
    } else {
        $("input[name='grantcheckselect']").each(function () {
            this.checked = true;
        })
        isCheckAllGrant = true;

    }
}
// refresh handler
$('#btn_refresh').bind('click', function () {
    bindGrid()
})