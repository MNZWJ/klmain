var parentId = "";
var searchName = "";
var treeNode="";
$(function () {

    //获取浏览器高度
    var scanHeight = $(window).height();
    var buttonHeight = $("#rightButton").height();
    $("#treeDiv").height(scanHeight - buttonHeight*2-10);
    $.ajax({
        type: 'post',
        url: '/menu/getMenuTreeList',
        async:false,
        dataType: 'json',
        success: function (result) {
            //初始化treeView
            var $jsonTree = $('#tree').treeview({
                highlightSelected: true,//当选择节点时是否高亮显示。
                showBorder: false,//是否在节点上显示边框。
                showCheckbox:true,
                data: result,
                onNodeChecked:function(event, node){
                    var nodeIds =getChildNodeIdArr(node);
                    var listNode= [];
                    $.each(nodeIds,function(i,n){
                        listNode.push(($("#tree").treeview("getNode",n))[0]);
                    });
                    var p=$("#tree").treeview('getParents',node);
                    while (p.length == 1){
                        listNode.push(p[0]);
                        p=$("#tree").treeview('getParents',p[0]);
                    }
                    $("#tree").treeview('checkNode', [listNode,{ silent: true }]);
                },
                onNodeUnchecked:function(event, node){
                    var nodeIds=getChildNodeIdArr(node);
                    var listNode= [];
                    var p=$("#tree").treeview('getParents',node);
                    while (p.length==1){
                        var a=true;
                        $.each($("#tree").treeview('getChecked'),function (i,n) {
                            if($.inArray(n.id,getChildNodeIdArr(p[0]))!=-1&&(listNode.length==0||n.id!=listNode[listNode.length-1].id))
                                a=false;
                        });
                       if(a)
                           listNode.push(p[0]);
                        p=$("#tree").treeview('getParents',p[0]);
                    }
                    $.each(nodeIds,function(i,n){
                        listNode.push(($("#tree").treeview("getNode",n))[0]);
                    });
                    $("#tree").treeview('uncheckNode', [listNode,{ silent: true }]);
                }
            });
            parentId=result[0].id;//父节点ID
            treeNode=$("#tree").treeview("getNodes");//获取子节点
        }
    });
    $('#roleTable').bootstrapTable({
        height: scanHeight - 6,
        striped: true,      //是否显示行间隔色
        cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        method: 'get',//请求方式
        url: '/SysRole/GetRoleList',//请求url
        pagination: 'true',//显示分页条
        paginationLoop: 'true',//启用分页条无限循环功能
        pageNumber: 1,                       //初始化加载第一页，默认第一页
        pageSize: 10,                       //每页的记录行数（*）
        pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
        toolbar: '#roleToolbar',                //工具按钮用哪个容器
        clickToSelect: true,//是否启用点击选中行
        sidePagination: 'server',//'server'或'client'服务器端分页
        showRefresh: 'true',//是否显示 刷新按钮
        queryParams: queryParams,
        queryParamsType: '', //默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort
        // 设置为 ''  在这种情况下传给服务器的参数为：pageSize,pageNumber
        sortStable: true,//设置为 true 将获得稳定的排序，我们会添加_position属性到 row 数据中。
        selectItemName: 'state',
        idField: 'roleId',
        rowStyle: function () {//自定义行样式
            return "bootTableRow";
        },
        onLoadError: function () {
            BootstrapDialog.alert({
                title: '错误',
                message: '表格加载失败！',
                size: BootstrapDialog.SIZE_SMALL,
                type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                closable: false, // <-- Default value is false
                draggable: true, // <-- Default value is false
                buttonLabel: '确定' // <-- Default value is 'OK',

            });
        },
        onClickRow: function (row, $element) {
            $("#roleTable").bootstrapTable("uncheckAll");
            roleTBonClich(row.roleId);
        },
        columns: [
            {

                title: '序号',
                field: 'number1',
                formatter: function (value, row, index) {
                    var page = $('#roleTable').bootstrapTable('getOptions');

                    return (page.pageNumber - 1) * page.pageSize + index + 1;
                }
            }
            ,
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
    searchName = $("#roleSearchName").val();
    $("#roleTable").bootstrapTable("refresh", {})
}

//表格返回参数方法
function queryParams(pageReqeust) {
    pageReqeust.roleSearchName =searchName;
    return pageReqeust;
}

//角色ID过滤菜单树
function roleTBonClich(roleId) {
    $('#roleIdtext').val(roleId);
    $("#tree").treeview("uncheckAll");
    $.ajax({
        type: 'post',
        url: '/ManagerRoleMenu/getRoleMenuTreeList',
        async:false,
        data: {role: roleId},
        success: function (result) {
            //初始化treeView
           var listNode= new Array();
               $.each(result,function(i,n){
                   listNode[i]=($("#tree").treeview("getNode",n.MenuId));
           });
           $.each(listNode,function(i,n){
               $("#tree").treeview('checkNode', [n,{ silent: true }]);//选中节点
           })
        }
    });


}
//清空查询按钮
function clearRole() {
    $('#roleSearchName').val("");
}

//角色菜单保存
function saveRoleMenu() {
   var roleId=$('#roleIdtext').val();
   var nodeId="";
    $.each($('#tree').treeview("getChecked"),function(i,n){
        nodeId=n.id+","+nodeId;
    });
    if(nodeId!="")
        nodeId=nodeId.substring(0,nodeId.length-1);
    $.ajax({
        type: 'POST',
        url: '/ManagerRoleMenu/saveRoleMenu',
        async:false,
        data:{role:roleId,menu:nodeId},
        success: function (result) {
        if(result)
            alert("保存成功！");
        },
        error:function (e) {
            alert("保存失败！");
        }
    });
}

//获取子节点
function getChildNodeIdArr(node) {
    var ts = [];
    if (node.nodes) {
        for (x in node.nodes) {
            ts.push(node.nodes[x].id);
            if (node.nodes[x].nodes) {
                var getNodeDieDai = getChildNodeIdArr(node.nodes[x]);
                for (j in getNodeDieDai) {
                    ts.push(getNodeDieDai[j]);
                }
            }
        }
    }
    return ts;
}

//取消
function backSelect() {
    roleTBonClich( $('#roleIdtext').val())
}