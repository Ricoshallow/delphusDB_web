var controllerUrl = GetFullUrl(window.location.host);
var ctlApi = null;
var nodeApi = new DatanodeServer(controllerUrl);
$(function () {
    bindGrid();
});
var bindGrid = function () {
    ctlApi = new ControllerServer(controllerUrl);
    var re = ctlApi.getGroupList()
    console.log(re);
    //var ent = [{ groupId: "dev" }, { groupId: "dolphindbGroup" }, { groupId: "hangzhou" }]
    if (re.resultCode === "1") {
        alert(re.msg)
        parent.window.location.reload()
    } else {
        var ent = new DolphinEntity(re).toTable();
        if (typeof ent[0] !== 'object') {
            ent = []
        }
        $('#jsgrid').jsGrid({
            width: "100%",
            // height: "400px",
            data: ent,
            resize: true,
            fields: [{
                    name: "groupName",
                    title: "Group Name",
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
                        var s = "";
                        if (item.SCRIPT_EXEC == "allow") {
                            s = "checked"
                        }
                        return "<input type='checkbox' " + s + " onclick=\"setScriptExec('" + item.groupName + "')\"/>"

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
                        return "<input type='checkbox' " + s + " onclick=\"setUnitTest('" + item.groupName + "')\"/>"
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
                        return "<input type='checkbox' " + s + " onclick=\"setDBCreate('" + item.groupName + "')\"/>"
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
                        return "<input type='checkbox' " + s + " onclick=\"setDBOwner('" + item.groupName + "')\"/>"
                    }
                },
                {
                    name: "View Execution",
                    type: "text",
                    width: 50,
                    align: "center",
                    itemTemplate: function (value, item) {

                        return `<a href='###' onclick='setViewGrant("${item.groupName}")'>set</a>`
                    }
                },
                {
                    name: "Table Access",
                    type: "text",
                    width: 50,
                    align: "center",
                    itemTemplate: function (value, item) {
                        return `<a href='###' onclick='setReadGrant("${item.groupName}")'>Read</a> | <a href='###' onclick='setWriteGrant("${item.groupName}")'>Write</a> `
                    }
                },
                {
                    name: "DBObj Access",
                    type: "text",
                    width: 50,
                    align: "center",
                    itemTemplate: function (value, item) {
                        return `<a href='###' onclick='setCreateGrant("${item.groupName}")'>Create</a> | <a href='###' onclick='setDeleteGrant("${item.groupName}")'>Delete</a> `
                    }
                },
                {
                    name: "Members",
                    type: "text",
                    width: 50,
                    align: "center",
                    itemTemplate: function (value, item) {
                        return `<a href="###" onclick= 'setMember("${item.groupName}")' value="${item.groupName}">Manager</a>`

                    }
                },

                {
                    headerTemplate: function () {
                        return "<a href='###' onclick='swapCheck()' >Select All <i class='Hui-iconfont'>&#xe676;</i></a>"

                    },
                    itemTemplate: function (_, item) {
                        return $("<input>").attr("type", "checkbox").attr("name", "chkSelect").attr("id", "chkSelect").attr("value", item.groupName);
                    },
                    align: "center",
                    width: 50
                }
            ]
        });
    }

}

// add eventListener for add button 
$("#btn_Add").bind("click", function () {
    var dialog = new DolphinDialog("dialogAdd");
    dialog.open({
        width: 300,
        height: 230,
        modal: true,
        buttons: {
            "Save": function () {
                ctlApi.createGroup($("#txtGroupname").val(), function () {
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
        $('#btn_refresh').after(`<div class="alert alert-warning fade in" id="grant_alert">
        <button type="button" class="close" data-dismiss="alert">&times;</button>
        <strong> Please select as least one group to delete !</strong> 
    </div>`)

    }
    $.each($("#chkSelect:checked"), function (i, e) {
        ctlApi.deleteGroup(e.value, function (re) {
            bindGrid();
        });
    });
});

// add eventListener for revoke button
$('#btn_Revoke').bind("click", function () {
    var selectedGroup = $("#chkSelect:checked")
    if (selectedGroup.length == 0) {
        $('#btn_refresh').after(`<div class="alert alert-warning fade in" id="grant_alert">
        <button type="button" class="close" data-dismiss="alert">&times;</button>
        <strong> Choose the groups you want revoke !</strong> 
    </div>`)
    } else {
        // console.log(selectedGroup);
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
        $('#confirmrevokeBtn').bind('click', function () {
            for (var i = 0, leni = selectedGroup.length; i < leni; i++) {
                // all selected Userid
                var user = selectedGroup[i].value
                var selectedGrant = $('input[name="grantcheckselect"]:checked')
                for (var j = 0, lenj = selectedGrant.length; j < lenj; j++) {
                    ctlApi.revoke(user, selectedGrant[j].value, function (re) {
                        console.log('revoke successful');
                    })
                }

            }
            bindGrid()
        })

    }


})

// manage member
var managedGroup = '';
var setMember = function (groupId) {
    // console.log(groupId);
    managedGroup = groupId
    $("#settingMemberDialog")[0].showModal()
    $("#MemberLabel").empty()
    $("#MemberLabel").append(`manage ${groupId}'s member`)
    $("#memberGrid").empty()
    ctlApi.getExistsUserByGroupId(groupId, function (re) {
        // console.log("re", re);
        $("#userTemplate").tmpl(re).appendTo("#memberGrid");
    });


}
// confirm member manage
$('#confirmMemberBtn').bind('click', function () {
    var userArr = [];
    var unChkUserArr = [];
    $.each($("#chkUser:checked"), function (i, e) {
        userArr.push(e.value);
    });
    $.each($("#chkUser:not(:checked)"), function (i, e) {
        unChkUserArr.push(e.value);
    });
    // console.log(managedGroup);
    ctlApi.addGroupMember(managedGroup, userArr, function (re) {
        ctlApi.deleteGroupMember(managedGroup, unChkUserArr, function (re) {
            console.log('sucessful manage member...');
        })
    });
})




// set Script Execution
var setScriptExec = function (groupId) {
    if (event.target.checked) {
        ctlApi.grant(groupId, 6, [], function (re) {
            bindGrid();
        });
    } else {
        ctlApi.revoke(groupId, 6, function (re) {
            bindGrid();
        });
    }
}

// set Script Test
var setUnitTest = function (groupId) {
    if (event.target.checked) {
        ctlApi.grant(groupId, 7, [], function (re) {
            bindGrid();
        });
    } else {
        ctlApi.revoke(groupId, 7, function (re) {
            bindGrid();
        });
    }
}

// set DB Management
var setDBCreate = function (groupId) {
    if (event.target.checked) {
        ctlApi.grant(groupId, 4, [], function (re) {
            bindGrid();
        });
    } else {
        ctlApi.revoke(groupId, 4, function (re) {
            bindGrid();
        });
    }
}

// set DB ownership
var setDBOwner = function (groupId) {
    if (event.target.checked) {
        ctlApi.grant(groupId, 10, [], function (re) {
            bindGrid();
        });
    } else {
        ctlApi.revoke(groupId, 10, function (re) {
            bindGrid();
        });
    }
}

// set View Execution
var setViewGrant = function (groupId) {
    var groupAccess = new DolphinEntity(nodeApi.getGroupAccess(groupId)).toTable()[0]
    // console.log(groupAccess);
    $('#settingViewExecuteDialog')[0].showModal()
    // document.querySelector('#settingViewExecuteDialog').showModal()
    $('#viewExecutionLabel').empty()
    $('#viewExecutionLabel').append(`Setting ${groupId}'s View Execution Grant:`)
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
                    if (groupAccess.VIEW_EXEC_allowed.split(',').includes(item)) {
                        ifChecked = 'checked'
                    }
                    return `<input type="radio" name = "${item}" ${ifChecked} value="grant" data-group="${groupId}"/>`
                }
            },
            {
                name: "Deny",
                type: "text",
                width: 50,
                align: "center",
                itemTemplate: function (value, item) {
                    var ifChecked = ''
                    if (groupAccess.VIEW_EXEC_denied.split(',').includes(item)) {
                        ifChecked = 'checked'
                    }
                    return `<input type="radio" name = "${item}" ${ifChecked} value="deny" data-group="${groupId}"/>`
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
        // console.log(checkList[i].name,checkList[i].value,checkList[i].dataset.group);

        ctlApi[checkList[i].value](checkList[i].dataset.group, 5, checkList[i].name, function (re) {
            console.log('setting successful');
        });

    }


}

// set table read
var setReadGrant = function (groupId) {
    var groupAccess = new DolphinEntity(nodeApi.getGroupAccess(groupId)).toTable()[0]
    // console.log(groupAccess);
    var allDFSTables = nodeApi.getClusterDFSTables().object[0].value;
    // console.log(allDFSTables);
    $('#settingTableReadDialog')[0].showModal()

    $('#TableReadLabel').empty()
    $('#TableReadLabel').append(`Setting ${groupId}'s Table Read Grant:`)
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
                    if (groupAccess.TABLE_READ_allowed.split(',').includes(item)) {
                        ifChecked = 'checked'
                    }
                    return `<input type="radio" name = "${item}" ${ifChecked} value="grant" data-group="${groupId}"/>`
                }
            },
            {
                name: "Deny",
                type: "text",
                width: 50,
                align: "center",
                itemTemplate: function (value, item) {
                    var ifChecked = ''
                    if (groupAccess.TABLE_READ_denied.split(',').includes(item)) {
                        ifChecked = 'checked'
                    }
                    return `<input type="radio" name = "${item}" ${ifChecked} value="deny" data-group="${groupId}"/>`
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
        // console.log(checkList[i].name,checkList[i].value,checkList[i].dataset.group);

        ctlApi[checkList[i].value](checkList[i].dataset.group, 0, checkList[i].name, function (re) {
            console.log('setting successful');
        });

    }


}

// set table Write
var setWriteGrant = function (groupId) {
    var groupAccess = new DolphinEntity(nodeApi.getGroupAccess(groupId)).toTable()[0]
    // console.log(groupAccess);
    var allDFSTables = nodeApi.getClusterDFSTables().object[0].value;
    // console.log(allDFSTables);
    $('#settingTableWriteDialog')[0].showModal()

    $('#TableWriteLabel').empty()
    $('#TableWriteLabel').append(`Setting ${groupId}'s Table Write Grant:`)


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
                    if (groupAccess.TABLE_WRITE_allowed.split(',').includes(item)) {
                        ifChecked = 'checked'
                    }
                    return `<input type="radio" name = "${item}" ${ifChecked} value="grant" data-group="${groupId}"/>`
                }
            },
            {
                name: "Deny",
                type: "text",
                width: 50,
                align: "center",
                itemTemplate: function (value, item) {
                    var ifChecked = ''
                    if (groupAccess.TABLE_WRITE_denied.split(',').includes(item)) {
                        ifChecked = 'checked'
                    }
                    return `<input type="radio" name = "${item}" ${ifChecked} value="deny" data-group="${groupId}"/>`
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
        // console.log(checkList[i].name,checkList[i].value,checkList[i].dataset.group);

        ctlApi[checkList[i].value](checkList[i].dataset.group, 1, checkList[i].name, function (re) {
            console.log('setting successful');
        });

    }


}
// set DB Create
var setCreateGrant = function (groupId) {
    var groupAccess = new DolphinEntity(nodeApi.getGroupAccess(groupId)).toTable()[0]
    // console.log(groupAccess);
    var allDFSDatabases = nodeApi.getClusterDFSDatabases().object[0].value;
    // console.log(allDFSDatabases);
    $('#settingDBcreateDialog')[0].showModal()

    $('#DBcreateLabel').empty()
    $('#DBcreateLabel').append(`Setting ${groupId}'s DB Create Grant:`)


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
                    if (groupAccess.DBOBJ_CREATE_allowed.split(',').includes(item)) {
                        ifChecked = 'checked'
                    }
                    return `<input type="radio" name = "${item}" ${ifChecked} value="grant" data-group="${groupId}"/>`
                }
            },
            {
                name: "Deny",
                type: "text",
                width: 50,
                align: "center",
                itemTemplate: function (value, item) {
                    var ifChecked = ''
                    if (groupAccess.DBOBJ_CREATE_denied.split(',').includes(item)) {
                        ifChecked = 'checked'
                    }
                    return `<input type="radio" name = "${item}" ${ifChecked} value="deny" data-group="${groupId}"/>`
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
        // console.log(checkList[i].name,checkList[i].value,checkList[i].dataset.group);

        ctlApi[checkList[i].value](checkList[i].dataset.group, 2, checkList[i].name, function (re) {
            console.log('setting successful');
        });

    }


}


// set DB Delete
var setDeleteGrant = function (groupId) {
    var groupAccess = new DolphinEntity(nodeApi.getGroupAccess(groupId)).toTable()[0]
    // console.log(groupAccess);
    var allDFSDatabases = nodeApi.getClusterDFSDatabases().object[0].value;
    // console.log(allDFSDatabases);
    $('#settingDBdeleteDialog')[0].showModal()

    $('#DBdeleteLabel').empty()
    $('#DBdeleteLabel').append(`Setting ${groupId}'s DB Delete Grant:`)


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
                    if (groupAccess.DBOBJ_DELETE_allowed.split(',').includes(item)) {
                        ifChecked = 'checked'
                    }
                    return `<input type="radio" name = "${item}" ${ifChecked} value="grant" data-group="${groupId}"/>`
                }
            },
            {
                name: "Deny",
                type: "text",
                width: 50,
                align: "center",
                itemTemplate: function (value, item) {
                    var ifChecked = ''
                    if (groupAccess.DBOBJ_DELETE_denied.split(',').includes(item)) {
                        ifChecked = 'checked'
                    }
                    return `<input type="radio" name = "${item}" ${ifChecked} value="deny" data-group="${groupId}"/>`
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
        // console.log(checkList[i].name,checkList[i].value,checkList[i].dataset.group);

        ctlApi[checkList[i].value](checkList[i].dataset.group, 3, checkList[i].name, function (re) {
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
