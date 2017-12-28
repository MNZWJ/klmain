var typeId = "";
var dictSearchName = "";
var treeNode = "";
var scanHeight="";
$(function () {

    //获取浏览器高度
    scanHeight = $(window).height();
    $("#treeDiv").height(scanHeight);
    $.ajax({
        type: 'post',
        url: '/SysDictionary/getDictTreeList',
        async: false,
        dataType: 'json',
        success: function (result) {
            //初始化treeView
            var $jsonTree = $('#tree').treeview({
                highlightSelected: true,//当选择节点时是否高亮显示。
                showBorder: false,//是否在节点上显示边框。
                data: result,
                //节点选中方法
                onNodeSelected: function (event, data) {

                    treeNode = $("#tree").treeview("getSelected");
                   // $('#tree').treeview('expandNode', [treeNode, {silent: true}]);
                    dictSearchName = "";//清空查询条件
                    $("#dictSearchName").val('');//清空查询框
                    typeId = data.id;
                    $("#dictTable").bootstrapTable("refresh", {query: {typeId: data.id}})
                }
            });
            typeId = result[0].id;
            treeNode = $("#tree").treeview("getNodes", result[0].id);
            $("#tree").treeview("selectNode", [treeNode[0]]);


        }
    });

    initTable();

    formValidator();
    //绑定保存按钮提交事件
    $("#btn_save").on("click", function () {
        //获取表单对象
        var bootstrapValidator = $("#dictForm").data('bootstrapValidator');
        //手动触发验证
        bootstrapValidator.validate();

        if (bootstrapValidator.isValid()) {
            //表单提交的方法、比如ajax提交
            //获取表单中的值
            var dict = {};
            var dictList = $('#dictForm').serializeArray();
            $.each(dictList, function () {
                dict[this.name] = this.value
            });

            $.ajax({
                type: 'post',
                url: '/SysDictionary/saveDict',
                data: JSON.stringify(dict),
                contentType: 'application/json',
                success: function (result) {
                    if (result.code == 0) {

                        BootstrapDialog.alert({

                            title: "提示",
                            message: "保存成功！",
                            size: BootstrapDialog.SIZE_SMALL,
                            type: BootstrapDialog.TYPE_SUCCESS, // <-- Default value is BootstrapDialog.TYPE_PRIMARY

                            callback: function () {
                                if (result.obj != "" && result.obj != undefined) {
                                    var singleNode = {
                                        text: dict['dictName'],
                                        id: result.obj,
                                        code: dict['dictCode']
                                    };
                                    $("#tree").treeview("addNode", [singleNode, treeNode]);
                                } else {
                                    var singleNode = {
                                        text: dict['dictName'],
                                        id: dict['dictId'],
                                        code: dict['dictCode']
                                    };
                                    var node;
                                    var nodes = treeNode[0].nodes;
                                    $.each(nodes, function (i, n) {
                                        if (n.id == dict['dictId']) {
                                            node = n;
                                        }
                                    });


                                    $('#tree').treeview('updateNode', [node, singleNode, {silent: true}]);
                                }


                                $('#myModal').modal('hide');
                                $("#dictTable").bootstrapTable("refresh");
                            }
                        });


                    }
                },
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
        //清空表单
        $(':input', '#dictForm')
            .not(':button, :submit, :reset')
            .val('')
            .removeAttr('checked')
            .removeAttr('selected');
        $("#dictForm").data('bootstrapValidator').destroy();
        $('#dictForm').data('bootstrapValidator', null);
        formValidator();
    });


});

//表格返回参数方法
function queryParams(pageReqeust) {
    pageReqeust.typeId = typeId;  //
    pageReqeust.dictSearchName = dictSearchName;

    return pageReqeust;
}

//form验证规则
function formValidator() {
//表单验证
    $("#dictForm").bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        /**
         * 表单域配置
         */
        fields: {
            //多个重复
            dictName: {
                //隐藏或显示 该字段的验证
                enabled: true,
                //错误提示信息
                message: '输入有误',

                // 定义每个验证规则
                validators: {
                    //多个重复
                    //官方默认验证参照  http://bv.doc.javake.cn/validators/
                    // 注：使用默认前提是引入了bootstrapValidator-all.js
                    // 若引入bootstrapValidator.js没有提供常用验证规则，需自定义验证规则哦
                    notEmpty: {
                        message: '字典名称不能为空'
                    },
                    stringLength: {
                        min: 0,
                        max: 50,
                        message: '字典名称过长'
                    },
                    regexp: {
                        regexp: /[^\]@=/'\"$%&^*{}<>\\\\[:\;]+/,
                        message: '输入值中含有非法字符'
                    }
                }
            },
            isUsed: {
                validators: {
                    //多个重复
                    //官方默认验证参照  http://bv.doc.javake.cn/validators/
                    // 注：使用默认前提是引入了bootstrapValidator-all.js
                    // 若引入bootstrapValidator.js没有提供常用验证规则，需自定义验证规则哦

                    notEmpty: {
                        message: '请选择是否启用'
                    }
                }

            }
        }
    });
}

//初始化表格
function initTable(){
    $("#dictTable").bootstrapTable("destroy");
    $('#dictTable').bootstrapTable({
        height: scanHeight,
        striped: true,      //是否显示行间隔色
        cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        method: 'get',//请求方式
        url: '/SysDictionary/getDictList',//请求url
        pagination: 'true',//显示分页条
        paginationLoop: 'true',//启用分页条无限循环功能
        pageNumber: 1,                       //初始化加载第一页，默认第一页
        pageSize: 10,                       //每页的记录行数（*）
        pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
        toolbar: '#dictToolbar',                //工具按钮用哪个容器
        clickToSelect: false,//是否启用点击选中行
        sidePagination: 'server',//'server'或'client'服务器端分页
        showRefresh: 'true',//是否显示 刷新按钮
        queryParams: queryParams,
        queryParamsType: '', //默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort
        // 设置为 ''  在这种情况下传给服务器的参数为：pageSize,pageNumber
        sortStable: true,//设置为 true 将获得稳定的排序，我们会添加_position属性到 row 数据中。
        selectItemName: 'state',
        idField: 'dictId',
        rowStyle: function () {//自定义行样式
            return "bootTableRow";
        },
        onLoadError: function () {

        },
        onClickRow:function(row, $element){

            $("#dictTable").bootstrapTable("uncheckAll");
            $("#dictTable").bootstrapTable("checkBy",{field:'dictId',values:[row.dictId]})
        },
        columns: [
            {

                title: '序号',
                field: 'number1',
                align: 'center',
                formatter: function (value, row, index) {
                    var page = $('#dictTable').bootstrapTable('getOptions');

                    return (page.pageNumber - 1) * page.pageSize + index + 1;
                }
            }
            ,
            {
                field: 'state',
                checkbox: true
            },

            {

                field: 'dictName',
                title: '字典名称',
                halign: 'center',
                align: 'left',
                width: '60%'
            },
            {
                field: 'isUsed',
                title: '是否启用',
                halign: 'center',
                align: 'center',
                width: '30%',
                formatter: function (value, row, index) {
                    if (value == "1") {

                        return "是";
                    } else {
                        return "否";
                    }
                }
            }
        ]
    });
}


//按名称查询
function searchMenus() {
    dictSearchName = $("#dictSearchName").val();
    $("#dictTable").bootstrapTable("refresh", {})
}

//新增字典
function dictAdd() {

    $('#dictForm')[0].reset();

    //清空表单
    $(':input', '#dictForm')
        .not(':button, :submit, :reset')
        .val('')
        .removeAttr('checked')
        .removeAttr('selected');


    $("#dictForm").data('bootstrapValidator').resetForm(false)
    var node = $("#tree").treeview('getSelected');
    if (node.length <= 0) {

        BootstrapDialog.alert({
            title: '警告',
            message: '请选择父字典！',
            size: BootstrapDialog.SIZE_SMALL,
            type: BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY

            closable: false, // <-- Default value is false
            draggable: true, // <-- Default value is false
            buttonLabel: '确定', // <-- Default value is 'OK',

        });

        return false;
    }
    $("#typeId").val(node[0].id);
    $('#isUsed').selectpicker('refresh');
    var maxCode = "000";
    $.each(node[0].nodes, function (i, n) {
        if (n.code > maxCode) {
            maxCode = n.code;
        }
    });

    var code = node[0].code;

    $("#dictCode").val(code + (Array(3).join(0) + (parseInt(maxCode.substring(maxCode.length - 3, maxCode.length)) + 1)).slice(-3));

    $("#myModalLabel").text("新增");
    $('#myModal').modal('show');
}

//修改
function dictEdit() {
    //清空表单
    $(':input', '#dictForm')
        .not(':button, :submit, :reset')
        .val('')
        .removeAttr('checked')
        .removeAttr('selected');
    var rows = $("#dictTable").bootstrapTable("getSelections");//获取所有选中的行
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

    for (var p in rows[0]) {

        $("#dictForm").find(":input[name='" + p + "']").val(rows[0][p]);

    }
    $('#isUsed').selectpicker('val', rows[0].isUsed);
    $("#myModalLabel").text("修改");
    $('#myModal').modal('show');


}

/**
 * 删除字典
 */
function dictDel() {
    var rows = $("#dictTable").bootstrapTable("getSelections");//获取所有选中的行
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
        message: "确定要删除选中字典吗？",
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
                    ids += n.dictId + ",";
                });
                ids = ids.substring(0, ids.length - 1);


                var nodes = treeNode[0].nodes;


                $.ajax({
                    type: 'post',
                    url: '/SysDictionary/deleteDicts',
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
                                            if (n.dictId == m.id) {
                                                nodeList.push(m);
                                            }
                                        });


                                    });
                                    $('#tree').treeview('removeNode', [nodeList, {silent: true}]);
                                    $("#dictTable").bootstrapTable("refresh");
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
 * 字典排序
 */
function moveOrder(x) {

    var rows = $("#dictTable").bootstrapTable('getSelections');
    if (rows.length != 1) {

        BootstrapDialog.alert({
            title: '警告',
            message: "请选择一条要移动的数据！",
            size: BootstrapDialog.SIZE_SMALL,
            type: BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY

            closable: false, // <-- Default value is false
            draggable: true, // <-- Default value is false
            buttonLabel: '确定', // <-- Default value is 'OK',

        });

        return false;
    }

    $.ajax({
        type: 'post',
        url: '/SysDictionary/moveOrder',
        data: {type: x, dataDictStr: JSON.stringify(rows[0])},
        success: function (result) {
            if (result.code == "0") {


                BootstrapDialog.alert({
                    title: '提示',
                    message: result.msg,
                    size: BootstrapDialog.SIZE_SMALL,
                    type: BootstrapDialog.TYPE_SUCCESS, // <-- Default value is BootstrapDialog.TYPE_PRIMARY

                    closable: false, // <-- Default value is false
                    draggable: true, // <-- Default value is false
                    buttonLabel: '确定', // <-- Default value is 'OK',
                    callback: function (result) {
                        $("#dictTable").on("load-success.bs.table", function (data) {
                            $("#dictTable").bootstrapTable("checkBy", {field: "dictId", values: [rows[0].dictId]});
                            $("#dictTable").off("load-success.bs.table");
                        });
                        $("#dictTable").bootstrapTable("refresh");
                    }
                });


            } else {

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
        }
    })


}
//适应页面大小
function resizePage(){


    //获取浏览器高度
    scanHeight = $(window).height();


    $("#treeDiv").height($(window).height());


    initTable();
}