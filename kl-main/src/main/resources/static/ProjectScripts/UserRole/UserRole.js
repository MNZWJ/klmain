//存放树节点对应的OrganiseId值
var typeId = "";
//存放模糊查找的条件
var searchName = "";
//存放树节点
var treeNode = "";
//存放组织机构类型对象
var sysOrgTypes={};
//开启页面直接加载
$(function () {
    //获取浏览器高度
    var scanHeight = $(window).height();
    $("#treeDiv").height(scanHeight);
    //左侧人员树加载
    $.ajax({
        type: 'post',
        url: '/ManagerRoleUser/getUserTreeList',
        async: false,
        dataType: 'json',
        success: function (result) {
            //初始化treeView
            var $jsonTree = $('#tree').treeview({
                highlightSelected: true,//当选择节点时是否高亮显示。
                showBorder: false,//是否在节点上显示边框。
                onlyLeafCheck: true,//只有根节点才能被选中
                data: result,
                //节点选中方法
                onNodeSelected: function (event, data) {
                    treeNode = $("#tree").treeview("getSelected");
                    //$('#tree').treeview('expandNode', [treeNode, {silent: true}]);
                    searchName = "";//清空查询条件
                    $("#searchName").val('');//清空查询
                    var id=treeNode[0].id;//获取所选人员iD
                    roleTBonClich(id);//人员ID过滤角色ID
                }
            });
            typeId = result[0].id;
            treeNode = $("#tree").treeview("getNodes", typeId);
            $("#tree").treeview("selectNode", [treeNode[0]]);
            //附上初值
            sysOrgTypes=result.data;
        }
    });
    //右侧角色表格加载
    $('#sysorgTable').bootstrapTable({
        height: scanHeight ,
        striped: true,      //是否显示行间隔色
        cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        method: 'get',//请求方式
        url:  '/SysRole/GetRoleList',//请求url
        pagination: 'true',//显示分页条
        paginationLoop: 'true',//启用分页条无限循环功能
        pageNumber: 1,                       //初始化加载第一页，默认第一页
        pageSize: 10,                       //每页的记录行数（*）
        pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
        toolbar: '#sysorgToolbar',                //工具按钮用哪个容器
        clickToSelect: true,//是否启用点击选中行
        sidePagination: 'server',//'server'或'client'服务器端分页
        showRefresh: 'true',//是否显示 刷新按钮
        queryParams: queryParams,//返回到前台的参数集
        queryParamsType: '', //默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort
        // 设置为 ''  在这种情况下传给服务器的参数为：pageSize,pageNumber
        sortStable: true,//设置为 true 将获得稳定的排序，我们会添加_position属性到 row 数据中。
        selectItemName: 'state',
        idField: 'roleId',
        rowStyle: function () {//自定义行样式
            return "sysorgTableRow";
        },
        onLoadError: function () {
        },
        columns: [
            {
                title: '序号',
                field: 'number1',
                halign: 'center',
                align: 'center',
                formatter: function (value, row, index) {
                    var page = $('#sysorgTable').bootstrapTable('getOptions');
                    return (page.pageNumber - 1) * page.pageSize + index + 1;
                }
            } ,
            {
                field: 'state',
                checkbox: true
            },
            {
                field: 'roleName',
                title: '角色名称',
                halign: 'center',
                align: 'center',
                width: '50%'
            },
            {
                field: 'roleCode',
                title: '角色编码',
                halign: 'center',
                align: 'center',
                width: '30%'
            }
        ]
    });
});
//按名称查询
function searchMenus() {
    searchName = $("#searchName").val();
    $("#sysorgTable").bootstrapTable("refresh",{});
}
//清空查询按钮
function clearRole() {
    $('#searchName').val("");
}
//人员角色菜单保存
function saveRoleMenu() {
    if (treeNode == null || treeNode == "") {
        BootstrapDialog.alert({
            title: '警告',
            message: '请选择需要赋权限的人员！！！',
            size: BootstrapDialog.SIZE_SMALL,
            type: BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY

            closable: false, // <-- Default value is false
            draggable: true, // <-- Default value is false
            buttonLabel: '确定', // <-- Default value is 'OK',

        });
        return;
    }
    if (treeNode[0].icon != "glyphicon glyphicon-user") {
        BootstrapDialog.alert({
            title: '警告',
            message: '请对人员赋权限！！！',
            size: BootstrapDialog.SIZE_SMALL,
            type: BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY

            closable: false, // <-- Default value is false
            draggable: true, // <-- Default value is false
            buttonLabel: '确定', // <-- Default value is 'OK',

        });
        return;
    }
    var roleId= $('#sysorgTable').bootstrapTable('getSelections');//获取所选角色
    var ids = roleId[0].roleId;
    for (var i = 1; i < roleId.length; i++) {
        ids+=","+roleId[i].roleId;
    }
    var nodeId="";
    $.each($('#tree').treeview("getSelected"),function(i,n){
        nodeId=n.id+nodeId;
    });//获取所选人员
    $.ajax({
        type: 'POST',
        url: '/UserRole/updateOrAddUserRole',
        async:false,
        data:{role:ids,menu:nodeId},
        success: function (result) {
            if(result){
                BootstrapDialog.alert({
                    title: '提示',
                    message:"保存成功",
                    size:BootstrapDialog.SIZE_SMALL,
                    type: BootstrapDialog.TYPE_SUCCESS , // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                    closable: false, // <-- Default value is false
                    draggable: true, // <-- Default value is false
                    buttonLabel: '确定', // <-- Default value is 'OK',

                });
            }
        },
        error:function (e) {
            BootstrapDialog.alert({
                title: '错误',
                message: '保存失败！',
                size: BootstrapDialog.SIZE_SMALL,
                type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY

                closable: false, // <-- Default value is false
                draggable: true, // <-- Default value is false
                buttonLabel: '确定', // <-- Default value is 'OK',

            });
        }
    });
}
//复原
function backSelect() {
    var id=treeNode[0].id;//获取所选人员iD
    roleTBonClich(id);
}
//表格返回参数方法
function queryParams(pageReqeust) {
    pageReqeust.roleSearchName = searchName;
    return pageReqeust;
}

//人员ID加载选中行
function roleTBonClich(id) {
    $("#sysorgTable").bootstrapTable("uncheckAll");//将角色列表取消选中重新SET
    $.ajax({
        type: 'get',
        url: "/UserRole/GetRoleInfo",
        async:false,
        data: {id: id},
        success: function (result) {
            var listNode=$("#sysorgTable").bootstrapTable('getData');//获取列表已有数据
            for(var i=0;i<result.length;i++){
                for(var j=0;j<listNode.length;j++){
                    if(listNode[j].roleId==result[i].roleId){
                        $("#sysorgTable").bootstrapTable("checkBy", {field:'roleId',values:[listNode[j].roleId]});
                    }
                }
            }
        }
    });
}