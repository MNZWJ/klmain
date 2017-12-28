//存放树节点对应的OrganiseId值
var typeId = "";
//存放模糊查找的条件
var searchName = "";
//存放树节点
var treeNode = "";
//存放显示的组织机构类型字符串
var oType="";
//存放组织机构类型对象
var sysOrgTypes={};

var scanHeight="";
//开启页面直接加载
$(function () {

    //获取浏览器高度
    scanHeight = $(window).height();
    $("#treeDiv").height(scanHeight);
    $.ajax({
        type: 'post',
        url: '/SysOrganise/getSysOrganiseTreeList',
        async: false,
        dataType: 'json',
        success: function (result) {
            //初始化treeView
            var $jsonTree = $('#tree').treeview({
                highlightSelected: true,//当选择节点时是否高亮显示。
                showBorder: false,//是否在节点上显示边框。
                showImage: true,
                data: result.tm,
                //节点选中方法
                onNodeSelected: function (event, data) {

                    treeNode = $("#tree").treeview("getSelected");
                    //$('#tree').treeview('expandNode', [treeNode, {silent: true}]);
                    searchName = "";//清空查询条件
                    $("#searchName").val('');//清空查询框
                    typeId = data.id;
                    $("#sysorgTable").bootstrapTable("refresh", {query: {typeId: data.id}})
                }
            });
            typeId = result.tm[0].id;
            treeNode = $("#tree").treeview("getNodes", typeId);
            $("#tree").treeview("selectNode", [treeNode[0]]);
            //为组织结构附上初值
            sysOrgTypes=result.data;
        }
    });

    initTable();

    formValidator();
    //绑定保存按钮提交事件
    $("#btn_save").on("click", function () {
        //获取表单对象
        var bootstrapValidator = $("#sysorgForm").data('bootstrapValidator');
        //手动触发验证
        bootstrapValidator.validate();

        if (bootstrapValidator.isValid()) {
            //表单提交的方法、比如ajax提交
            var sysOrg = {};
            //获取表单中输入的值和对应的表单控件名放入sysOrg对象
            var sysOrgList = $('#sysorgForm').serializeArray();
            $.each(sysOrgList, function () {
                sysOrg[this.name] = this.value
            });

            $.ajax({
                type: 'post',
                url: '/SysOrganise/updateOrAddSysOrganise',
                //将sysOrg对象的JSON类型参数传到后台
                data: JSON.stringify(sysOrg),
                contentType: 'application/json',
                success: function (result) {
                    //根据返回的result进行判断
                    if (result.code == 0) {
                        //显示结果弹出框
                        BootstrapDialog.alert({
                            title: "提示",
                            message: "保存成功！",
                            size: BootstrapDialog.SIZE_SMALL,
                            type: BootstrapDialog.TYPE_SUCCESS, // <-- Default value is BootstrapDialog.TYPE_PRIMARY

                            //回调函数
                            callback: function () {
                                if (result.obj != "" && result.obj != undefined) {
                                    var singleNode = {
                                        text: sysOrg['organiseName'],
                                        id: result.obj,
                                        code: sysOrg['organiseCode']
                                    };
                                    //将singleNode节点添加到原树上
                                    $("#tree").treeview("addNode", [singleNode, treeNode]);
                                } else {
                                    var singleNode = {
                                        text: sysOrg['organiseName'],
                                        id: sysOrg['organiseId'],
                                        code: sysOrg['organiseCode']
                                    };
                                    var node;
                                    //除根节点的所有节点
                                    var nodes = treeNode[0].nodes;
                                    //i为索引，n为nodes的每一次遍历的元素
                                    $.each(nodes, function (i, n) {
                                        if (n.id == sysOrg['organiseId']) {
                                            //把原节点改为修改后的节点
                                            node = n;
                                        }
                                    });

                                    //将树进行更新节点
                                    $('#tree').treeview('updateNode', [node, singleNode, {silent: true}]);
                                }

                                //将弹出框隐藏
                                $('#myModal').modal('hide');
                                //更新数据表格
                                $("#sysorgTable").bootstrapTable("refresh");
                            }
                        });


                    }
                },
                //如果失败了
                error: function () {
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
    });

//模态窗关闭事件
    $('#myModal').on('hidden.bs.modal', function () {
        //重置这个表单里面的所有控件
        $(':input', '#sysorgForm')
            .not(':button, :submit, :reset')
            .val('')
            .removeAttr('checked')
            .removeAttr('selected');
        $('#sysorgForm').data('bootstrapValidator', null);
        formValidator();
    });


});

//初始化表格
function initTable(){
    $("#sysorgTable").bootstrapTable("destroy");
    $('#sysorgTable').bootstrapTable({
        height: scanHeight ,
        striped: true,      //是否显示行间隔色
        cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        method: 'get',//请求方式
        url: '/SysOrganise/getSysOrganiseList',//请求url
        pagination: 'true',//显示分页条
        paginationLoop: 'true',//启用分页条无限循环功能
        pageNumber: 1,                       //初始化加载第一页，默认第一页
        pageSize: 10,                       //每页的记录行数（*）
        pageList: [5,10, 25, 50, 100],        //可供选择的每页的行数（*）
        toolbar: '#sysorgToolbar',                //工具按钮用哪个容器
        clickToSelect: false,//是否启用点击选中行
        sidePagination: 'server',//'server'或'client'服务器端分页
        showRefresh: 'true',//是否显示 刷新按钮
        queryParams: queryParams,//返回到前台的参数集
        queryParamsType: '', //默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort
        // 设置为 ''  在这种情况下传给服务器的参数为：pageSize,pageNumber
        sortStable: true,//设置为 true 将获得稳定的排序，我们会添加_position属性到 row 数据中。
        selectItemName: 'state',
        idField: 'organiseId',
        rowStyle: function () {//自定义行样式
            return "bootTableRow";
        },
        onLoadError: function () {
        },
        onClickRow:function(row, $element){

            $("#sysorgTable").bootstrapTable("uncheckAll");
            $("#sysorgTable").bootstrapTable("checkBy",{field:'organiseId',values:[row.organiseId]})
        },
        columns: [
            {
                title: '序号',
                field: 'number1',
                formatter: function (value, row, index) {
                    var page = $('#sysorgTable').bootstrapTable('getOptions');

                    return (page.pageNumber - 1) * page.pageSize + index + 1;
                }
            }
            ,
            {
                field: 'state',
                checkbox: true
            },

            {

                field: 'organiseName',
                title: '组织机构名称',
                halign: 'center',
                align: 'center',
                width: '60%'
            },
            {
                field: 'orgType',
                title: '组织机构类型',
                halign: 'center',
                align: 'center',
                width: '30%',
                formatter: function (value, row, index) {
                    $.each(sysOrgTypes,function(i,n){
                        if(value==n.dictId){
                            oType=n.dictName;

                        }
                    });
                    //ajax实现方法，性能差
                    // $.ajax({
                    //     type: 'get',
                    //     url: '/SysOrganise/getType',
                    //     async: false,
                    //     dataType: 'json',
                    //     //在数据库查询所有组织结构类型返回一个Map类型的参数
                    //     success: function (result) {
                    //         //将返回过来的每条参数进行遍历
                    //         $.each(result.data, function (i) {
                    //             //将返回过来的参数与此单元格的value属性进行对比
                    //             if(value==result.data[i].dictId){
                    //                 //将符合的类型ID显示成数据库表中所对应的Name值
                    //                oType=result.data[i].dictName;
                    //             }
                    //         });
                    //     }
                    // });
                    //返回对应类型名
                    return oType;

                }
            }
        ]
    });
}

//前端表格返回到后台的参数方法
function queryParams(pageReqeust) {
    pageReqeust.typeId = typeId;  //
    pageReqeust.searchName = searchName;

    return pageReqeust;
}

//form验证规则
function formValidator() {
//表单验证
    $("#sysorgForm").bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        /**
         * 表单域配置
         */
        fields: {
            //设置组织机构名验证
            organiseName: {
                //隐藏或显示 该字段的验证
                enabled: true,
                //错误提示信息
                message: '输入有误',

                // 定义每个验证规则
                validators: {
                    notEmpty: {
                        message: '组织机构名称不能为空'
                    },
                    stringLength: {
                        min: 0,
                        max: 50,
                        message: '组织机构名称过长，名称长度不得大于50'
                    },
                    regexp: {
                        regexp: /[^\]@=/'\"$%&^*{}<>\\\\[:\;]+/,
                        message: '组织机构名中含有非法字符'
                    }
                }
            }
            // //设置组织机构名称验证
            // orgType: {
            //     validators: {
            //
            //         notEmpty: {
            //             message: '请选择组织机构类型'
            //         }
            //     }
            //
            // }
        }
    });
}

//按名称查询
function searchSysorgs() {
    searchName = $("#searchName").val();
    $("#sysorgTable").bootstrapTable("refresh", {});
}

//获取下拉组织机构类型列表
//如果是添加数据的话，参数为空
// 如果是修改数据的话，参数会有数据为类型的ID值
function getTypeList(obj) {
    //将id值为orgType的控件内的html元素清空
    $("#orgType").html('');
    // document.getElementById('orgType').innerHTML = '';
    //如果参数为空，说明是添加数据，下拉列表可为默认的选中项
    if(obj==""||obj==null){
        //遍历传来的每条数据
        $.each(sysOrgTypes, function (i,n) {
            //为id为orgType的控件添加一个下拉菜单选项
            $("#orgType").append("<option value=" + n.dictId + ">" + n.dictName + "</option>");
        });
    }else{
        //如果有值的话就是修改数据
        $.each(sysOrgTypes, function (i,n) {
            //要把数据库中的数据显示在下拉列表中并设为默认选中值
            if(obj==n.dictId){
                $("#orgType").append("<option selected='selected' value=" + n.dictId + ">" + n.dictName + "</option>");
            }else{
                $("#orgType").append("<option value=" + n.dictId + ">" + n.dictName + "</option>");
            }

        });
    }
    //更新这个select控件
    $("#orgType").selectpicker('refresh');
}

//新增组织机构
function sysorgAdd() {

    //获取下拉组织机构类型列表
    getTypeList();

    //重置指定表单的控件
    $('#sysorgForm')[0].reset();

    //清空表单
    $(':input', '#sysorgForm')
        .not(':button, :submit, :reset')
        .val('')
        .removeAttr('checked')
        .removeAttr('selected');


    $("#sysorgForm").data('bootstrapValidator').resetForm(false)
    //获取鼠标点击的树的节点的元素
    var node = $("#tree").treeview('getSelected');
    if (node.length <= 0) {
        BootstrapDialog.alert({
            title: '警告',
            message: '请选择父组织单位！',
            size: BootstrapDialog.SIZE_SMALL,
            type: BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY

            closable: false, // <-- Default value is false
            draggable: true, // <-- Default value is false
            buttonLabel: '确定', // <-- Default value is 'OK',

        });
        return false;
    }
    //为parentId赋值为节点的Id
    $("#parentId").val(node[0].id);
    //刷新下拉菜单
    $("#orgType").selectpicker('refresh');
    var maxCode = "000";
    $.each(node[0].nodes, function (i, n) {
        if (n.code > maxCode) {
            maxCode = n.code;
        }
    });

    var code = node[0].code;

    //将OriganiseCode进行字符串拼接
    //Array(3).join(0)  将长度为3的数组中的元素全换为1
    $("#organiseCode").val(code + (Array(3).join(0) + (parseInt(maxCode.substring(maxCode.length - 3, maxCode.length)) + 1)).slice(-3));

    //将此标签标题改为新增
    $("#myModalLabel").text("新增");
    //展示悬浮窗口
    $('#myModal').modal('show');
}

//修改
function sysorgEdit() {

    //清空表单
    $(':input', '#sysorgForm')
        .not(':button, :submit, :reset')
        .val('')
        .removeAttr('checked')
        .removeAttr('selected');
    var rows = $("#sysorgTable").bootstrapTable("getSelections");//获取所有选中的行
    if (rows.length != 1) {

        BootstrapDialog.alert({
            title: '警告',
            message: '请选择一条要修改的数据！',
            size: BootstrapDialog.SIZE_SMALL,
            type: BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY

            closable: false, // <-- Default value is false
            draggable: true, // <-- Default value is false
            buttonLabel: '确定', // <-- Default value is 'OK',

        });
        return false;
    }

    //初始化下拉列表
    getTypeList(rows[0].orgType);

    for (var p in rows[0]) {
        $("#sysorgForm").find(":input[name='" + p + "']").val(rows[0][p]);

    }

    $('#organiseName').val( rows[0].organiseName);
    $('#orgType').selectpicker('val', rows[0].orgType);
    $("#myModalLabel").text("修改");
    $('#myModal').modal('show');
}

/**
 * 删除字典
 */
function sysorgDel() {
    var rows = $("#sysorgTable").bootstrapTable("getSelections");//获取所有选中的行
    if (rows.length <= 0) {

        BootstrapDialog.alert({
            title: '警告',
            message: '请选择一条要删除的数据！',
            size: BootstrapDialog.SIZE_SMALL,
            type: BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY

            closable: false, // <-- Default value is false
            draggable: true, // <-- Default value is false
            buttonLabel: '确定', // <-- Default value is 'OK',

        });
        return false;
    }

    BootstrapDialog.confirm({
        message: "确定要删除选中的组织机构吗？",
        type: BootstrapDialog.TYPE_WARNING,
        size: BootstrapDialog.SIZE_SMALL,
        title: "提示",
        btnCancelLabel: '取消', // <-- Default value is 'Cancel',
        btnOKLabel: '确定', // <-- Default value is 'OK',
        callback: function (result) {
            if (result) {
                //选择ok后调用
                var ids = "";
                $.each(rows, function (i, n) {
                    ids += n.organiseId+ ",";
                });
                ids = ids.substring(0, ids.length - 1);


                var nodes = treeNode[0].nodes;


                $.ajax({
                    type: 'post',
                    url: '/SysOrganise/deleteSysOrganise',
                    data: {ids: ids},
                    success: function (result) {

                        if (result.code == "00") {

                            BootstrapDialog.alert({
                                title: '提示',
                                message: '删除成功！',
                                size: BootstrapDialog.SIZE_SMALL,
                                type: BootstrapDialog.TYPE_SUCCESS, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                                closable: false, // <-- Default value is false
                                draggable: true, // <-- Default value is false
                                buttonLabel: '确定', // <-- Default value is 'OK',
                                callback: function (result) {

                                    var nodeList = [];
                                    $.each(rows, function (i, n) {

                                        $.each(nodes, function (j, m) {
                                            if (n.organiseId == m.id) {
                                                nodeList.push(m);
                                            }
                                        });


                                    });
                                    $('#tree').treeview('removeNode', [nodeList, {silent: true}]);
                                    $("#sysorgTable").bootstrapTable("refresh");
                                }

                            });


                        } else if (result.code == "01") {

                            BootstrapDialog.alert({
                                title: '警告',
                                message: result.msg,
                                size: BootstrapDialog.SIZE_SMALL,
                                type: BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY

                                closable: false, // <-- Default value is false
                                draggable: true, // <-- Default value is false
                                buttonLabel: '确定', // <-- Default value is 'OK',

                            });
                        }

                    },
                    error: function () {

                        BootstrapDialog.alert({
                            title: '错误',
                            message: '删除失败',
                            size: BootstrapDialog.SIZE_SMALL,
                            type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY

                            closable: false, // <-- Default value is false
                            draggable: true, // <-- Default value is false
                            buttonLabel: '确定', // <-- Default value is 'OK',

                        });
                    }
                });
            }

        }
    });


}

/**
 * 组织机构列表排序
 */
// function moveOrder(x) {
//
//     var rows = $("#sysorgTable").bootstrapTable('getSelections');
//     if (rows.length != 1) {
//
//         BootstrapDialog.alert({
//             title: '警告',
//             message: "请选择一条要移动的数据！",
//             size: BootstrapDialog.SIZE_SMALL,
//             type: BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
//
//             closable: false, // <-- Default value is false
//             draggable: true, // <-- Default value is false
//             buttonLabel: '确定', // <-- Default value is 'OK',
//
//         });
//
//         return false;
//     }
//
//     $.ajax({
//         type: 'post',
//         url: '/SysOrganise/moveOrder',
//         data: {type: x, sysOrgStr: JSON.stringify(rows[0])},
//         success: function (result) {
//             if (result.code == "0") {
//
//
//                 BootstrapDialog.alert({
//                     title: '提示',
//                     message: result.msg,
//                     size: BootstrapDialog.SIZE_SMALL,
//                     type: BootstrapDialog.TYPE_SUCCESS, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
//
//                     closable: false, // <-- Default value is false
//                     draggable: true, // <-- Default value is false
//                     buttonLabel: '确定', // <-- Default value is 'OK',
//                     callback: function (result) {
//                         $("#sysorgTable").on("load-success.bs.table", function (data) {
//                             $("#sysorgTable").bootstrapTable("checkBy", {field: "organiseId", values: [rows[0].organiseId]});
//                             $("#sysorgTable").off("load-success.bs.table");
//                         });
//                         $("#sysorgTable").bootstrapTable("refresh");
//                     }
//                 });
//
//
//             } else {
//
//                 BootstrapDialog.alert({
//                     title: '警告',
//                     message: result.msg,
//                     size: BootstrapDialog.SIZE_SMALL,
//                     type: BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
//
//                     closable: false, // <-- Default value is false
//                     draggable: true, // <-- Default value is false
//                     buttonLabel: '确定', // <-- Default value is 'OK',
//
//                 });
//             }
//         }
//     })
//
//
// }
//适应页面大小
function resizePage(){


    //获取浏览器高度
    scanHeight = $(window).height();
    $("#treeDiv").height(scanHeight);
    initTable();
}