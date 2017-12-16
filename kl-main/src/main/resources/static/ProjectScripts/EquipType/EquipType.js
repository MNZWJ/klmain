var nodeId = "";
var treeNode = "";
$(function () {

    //获取浏览器高度
    var scanHeight = $(window).height();
    $("#treeDiv").height(scanHeight);
    $.ajax({
        type: 'get',
        url: '/EquipType/getEquipTypeTreeList',
        async: false,
        dataType: 'json',
        contentType : 'application/json;charset=utf-8',
        success: function (result) {
            //初始化treeView
            var $jsonTree = $('#tree').treeview({
                highlightSelected: true,//当选择节点时是否高亮显示。
                showBorder: false,//是否在节点上显示边框。
                data: result,
                //节点选中方法
                onNodeSelected: function (event, data) {
                    treeNode = $("#tree").treeview("getSelected");
                    nodeId = data.id;
                    $("#equipTable").bootstrapTable("refresh", {})
                }
            });
            nodeId = result[0].id;
            treeNode = $("#tree").treeview("getNodes", result[0].id);
            $("#tree").treeview("selectNode", [treeNode[0]]);
        }
    });

    $('#equipTable').bootstrapTable({
        height: scanHeight,
        striped: true,      //是否显示行间隔色
        cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        method: 'get',//请求方式
        url: '/EquipType/getEquipTypeTable',//请求url
        pagination: 'true',//显示分页条
        paginationLoop: 'true',//启用分页条无限循环功能
        pageNumber: 1,                       //初始化加载第一页，默认第一页
        pageSize: 10,                       //每页的记录行数（*）
        pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
        toolbar: '#equipToolbar',                //工具按钮用哪个容器
        clickToSelect: false,//是否启用点击选中行
        undefinedText: '-', //当数据为 undefined 时显示的字符
        sidePagination: 'server',//'server'或'client'服务器端分页
        showRefresh: 'true',//是否显示 刷新按钮
        search: false,	//是否启用搜索框
        queryParams: queryParams,
        queryParamsType: '', //默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort
        // 设置为 ''  在这种情况下传给服务器的参数为：pageSize,pageNumber
        sortStable: true,//设置为 true 将获得稳定的排序，我们会添加_position属性到 row 数据中。
        selectItemName: 'typeName',
        idField: 'typeCode',
        onLoadError: function () {
            BootstrapDialog.alert({
                title: '错误',
                message: '表格加载失败！',
                size: BootstrapDialog.SIZE_SMALL,
                type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                closable: false, // <-- Default value is false
                draggable: true, // <-- Default value is false
                buttonLabel: '确定', // <-- Default value is 'OK',
            });
        },
        onClickRow:function(row, $element){
            $("#equipTable").bootstrapTable("uncheckAll");
            $("#equipTable").bootstrapTable("checkBy",{field:'typeCode',values:[row.typeCode]})
        },
        columns: [
            {
                title: '序号',
                width: '10%',
                formatter: function (value, row, index) {
                    var page = $('#equipTable').bootstrapTable('getOptions');
                    return (page.pageNumber - 1) * page.pageSize + index + 1;
                }
            }
            ,
            {
                field: 'state',
                checkbox: true
            },
            {

                field: 'typeName',
                title: '设备类型',
                halign: 'center',
                align: 'center',
                width: '50%'
            },
            {
                field: 'typeCode',
                title: '设备类型编码',
                halign: 'center',
                align: 'center',
                width: '40%'
            }
        ]
    });

    formValidator();
    //绑定保存按钮提交事件
    $("#btn_save").on("click", function () {
        //获取表单对象
        var type=$("#myModalLabel").text();
        var bootstrapValidator = $("#equipForm").data('bootstrapValidator');
        //手动触发验证
        bootstrapValidator.validate();
        if (bootstrapValidator.isValid()) {
            //表单提交的方法、比如ajax提交
            var eqList = $('#equipForm').serializeArray();
            var eq = {};
            $.each(eqList, function () {
                eq[this.name] = this.value
            });
            $.ajax({
                type: 'post',
                url: '/EquipType/saveEquipType',
                data: JSON.stringify(eq),
                contentType: 'application/json',
                success: function (result) {
                    if (result) {
                        BootstrapDialog.alert({
                            title: "提示",
                            message: "保存成功！",
                            size: BootstrapDialog.SIZE_SMALL,
                            type: BootstrapDialog.TYPE_SUCCESS, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                             callback: function () {
                                var singleNode = {
                                     text: eq.typeName,
                                     id: eq.typeCode,
                                     code: eq.leveCode
                                 };
                                if (type=="新增") {
                                    $("#tree").treeview("addNode", [singleNode, treeNode]);
                                }else {
                                    var node =$('#tree').treeview('getNode',eq.typeCode);
                                    $('#tree').treeview('updateNode', [node, singleNode, {silent: true}]);
                                }
                                 $('#myModal').modal('hide');
                                 $("#equipTable").bootstrapTable("refresh");
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
        $(':input', '#equipForm')
            .not(':button, :submit, :reset')
            .val('')
            .removeAttr('checked')
            .removeAttr('selected');
        $("#equipForm").data('bootstrapValidator').destroy();
        $('#equipForm').data('bootstrapValidator', null);
        formValidator();

        if($('#typeCode').attr("readonly")!=undefined){
            $('#typeCode').removeAttr("readonly");
        }
    });
});

//表格返回参数方法
function queryParams(pageReqeust) {
    pageReqeust.nodeId = nodeId;
    return pageReqeust;
}

//form验证规则
function formValidator() {
//表单验证
    $("#equipForm").bootstrapValidator({
        /**
         * 表单域配置
         */
        fields: {
            //多个重复
            typeCode: {
                //隐藏或显示 该字段的验证
                enabled: true,
                threshold: 0,
                //有3字符以上才发送ajax请求，（input中输入一个字符，插件会向服务器发送一次，设置限制，6字符以上才开始）
                //错误提示信息
                message: '输入有误',
                // 定义每个验证规则
                validators: {
                    notEmpty: {
                        message: '设备名称编码不能为空'
                    },
                    stringLength: {
                        min: 0,
                        max: 10,
                        message: '设备名称编码过长'
                    },
                    regexp: {
                        regexp: /[^\]@=/'\"$%&^*{}<>\\\\[:\;]+/,
                        message: '输入值中含有非法字符'
                    },
                    remote:{
                        url:'/EquipType/validateTypeCode',
                        message: '设备类型编码已存在',
                        type: 'POST'
                    }
                },
            },
            typeName: {
                enabled: true,
                message: '输入有误',
                validators: {
                    notEmpty: {
                        message: '设备名称不能为空'
                    },
                    stringLength: {
                        min: 0,
                        max: 36,
                        message: '设备名称过长'
                    },
                    regexp: {
                        regexp: /[^\]@=/'\"$%&^*{}<>\\\\[:\;]+/,
                        message: '输入值中含有非法字符'
                    }
                }
            }
        }
    });
}

//新增设备类型
function equipAdd() {
    $('#equipForm')[0].reset();

    //清空表单
    $(':input', '#equipForm')
        .not(':button, :submit, :reset')
        .val('')
        .removeAttr('checked')
        .removeAttr('selected');
    $("#equipForm").data('bootstrapValidator').resetForm(false);
    var node = $("#tree").treeview('getSelected');
    if (node.length <= 0) {
        BootstrapDialog.alert({
            title: '警告',
            message: '请选择上一级设备类型！',
            size: BootstrapDialog.SIZE_SMALL,
            type: BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
            closable: false, // <-- Default value is false
            draggable: true, // <-- Default value is false
            buttonLabel: '确定', // <-- Default value is 'OK',
        });
        return false;
    }
    $("#pCode").val(node[0].id);
    var maxCode = "000";
    $.each(node[0].nodes, function (i, n) {
        if (n.code > maxCode) {
            maxCode = n.code;
        }
    });

    var code = node[0].code;

    $("#leveCode").val(code + (Array(3).join(0) + (parseInt(maxCode.substring(maxCode.length - 3, maxCode.length)) + 1)).slice(-3));

    $("#myModalLabel").text("新增");
    $('#myModal').modal('show');
    $("#equipForm").data('bootstrapValidator').addField("typeCode");//添加编码验证
}

//修改
function equipEdit() {
    //清空表单
    $(':input', '#equipForm')
        .not(':button, :submit, :reset')
        .val('')
        .removeAttr('checked')
        .removeAttr('selected');
    var rows = $("#equipTable").bootstrapTable("getSelections");//获取所有选中的行
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
        $("#"+p).val(rows[0][p]);
    }
    $("#myModalLabel").text("修改");
    $('#typeCode').attr("readonly","readonly");
    $('#myModal').modal('show');
    $("#equipForm").data('bootstrapValidator').removeField("typeCode");//删除编码验证
}

/**
 * 删除设备
 */
function equipDel() {
    var rows = $("#equipTable").bootstrapTable("getSelections");//获取所有选中的行
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
        message: "确定要删除选中设备类型吗？",
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
                    ids += n.typeCode + ",";
                });
                ids = ids.substring(0, ids.length - 1);
                var nodes = treeNode[0].nodes;
                $.ajax({
                    type: 'post',
                    url: '/EquipType/deleteEquip',
                    data: {ids: ids},
                    success: function (result) {
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
                                            if (n.typeCode == m.id) {
                                                nodeList.push(m);
                                            }
                                        });
                                    });
                                    $('#tree').treeview('removeNode', [nodeList, {silent: true}]);
                                    $("#equipTable").bootstrapTable("refresh");
                                }

                            });
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
 * 设备排序
 */
function moveOrder(x) {

    var rows = $("#equipTable").bootstrapTable('getSelections');
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
        url: '/EquipType/moveOrder',
        data: {type: x, typeCode:rows[0].typeCode,typeOrder:rows[0].typeOrder,pCode:rows[0].pCode},
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
                        $("#equipTable").bootstrapTable("refresh");
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
