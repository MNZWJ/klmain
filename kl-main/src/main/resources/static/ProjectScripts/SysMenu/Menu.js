var parentId = "";
var searchName = "";
var treeNode="";
$(function () {

    //获取浏览器高度
    var scanHeight = $(window).height();

    $("#treeDiv").height(scanHeight);

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
                data: result,
                //节点选中方法
                onNodeSelected: function (event, data) {
                    treeNode=$("#tree").treeview("getSelected");
                   // $('#tree').treeview('expandNode', [ treeNode, {  silent: true } ]);
                    searchName = "";//清空查询条件
                    $("#searchName").val('');//清空查询框
                    parentId = data.id;
                    $("#table").bootstrapTable("refresh", {query: {typeId: data.id}})
                }

            });
            parentId=result[0].id;
            treeNode=$("#tree").treeview("getNodes", result[0].id);
            $("#tree").treeview("selectNode",  [ treeNode[0]]);
        }
    });
    $('#table').bootstrapTable({
        height: scanHeight,
        striped: true,      //是否显示行间隔色
        cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        method: 'get',//请求方式
        url: '/menu/menuList',//请求url
        pagination: 'true',//显示分页条
        paginationLoop: 'true',//启用分页条无限循环功能
        pageNumber: 1,                       //初始化加载第一页，默认第一页
        pageSize: 10,                       //每页的记录行数（*）
        pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
        toolbar: '#toolbar',                //工具按钮用哪个容器
        clickToSelect: true,//是否启用点击选中行
        sidePagination: 'server',//'server'或'client'服务器端分页
        showRefresh: 'true',//是否显示 刷新按钮
        clickToSelect: false,    //是否启用点击选中行
        queryParams: queryParams,
        queryParamsType: '', //默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort
        // 设置为 ''  在这种情况下传给服务器的参数为：pageSize,pageNumber
        rowStyle: function () {//自定义行样式
            return "bootTableRow";
        },
        onLoadError:function(){


            BootstrapDialog.alert({
                title: '错误',
                size:BootstrapDialog.SIZE_SMALL,
                message: '表格加载失败！',
                type: BootstrapDialog.TYPE_DANGER , // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                closable: false, // <-- Default value is false
                draggable: true, // <-- Default value is false
                buttonLabel: '确定', // <-- Default value is 'OK',

            });
        },
        onClickRow:function(row, $element){

            $("#table").bootstrapTable("uncheckAll");
            $("#table").bootstrapTable("checkBy",{field:'MenuId',values:[row.MenuId]})
        },
        columns: [
            {

                title: '序号',
                formatter: function (value, row, index) {
                    var page = $('#table').bootstrapTable('getOptions');

                    return (page.pageNumber - 1) * page.pageSize + index + 1;
                }
            }
            ,
            {
                field:'state',
                checkbox: true
            },
            {

                field: 'MenuName',
                title: '菜单名称',
                halign: 'center',
                width: '30%'
            }, {
                field: 'URL',
                title: '菜单地址',
                halign: 'center',
                width: '50%'
            }, {
                field: 'MenuLevel',
                title: '菜单等级',
                halign: 'center',
                width: '20%'
            }]
    });


    //绑定保存按钮提交事件
    $("#btn_save").on("click", function () {
        //获取表单对象
        var bootstrapValidator = $("#menuForm").data('bootstrapValidator');
        //手动触发验证
        bootstrapValidator.validate();

        if (bootstrapValidator.isValid()) {
            //表单提交的方法、比如ajax提交
            //获取表单中的值
            var menu = {};
            var menuList = $('#menuForm').serializeArray();
            $.each(menuList, function () {
                menu[this.name] = this.value
            });

            $.ajax({
                type: 'post',
                url: '/menu/saveMenu',
                data: JSON.stringify(menu),
                contentType: 'application/json',
                success: function (result) {
                    if (result.code == 0) {

                        BootstrapDialog.alert({
                            title: "提示",
                            size:BootstrapDialog.SIZE_SMALL,
                            message: "保存成功！",
                            type: BootstrapDialog.TYPE_SUCCESS  , // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                            callback: function () {
                                if(result.obj!=""&&result.obj!=undefined){
                                    var singleNode = {
                                        text: menu['MenuName'],
                                        id:result.obj
                                    };
                                    $("#tree").treeview("addNode", [singleNode,treeNode]);
                                }else{
                                    var singleNode = {
                                        text: menu['MenuName'],
                                        id:menu['MenuId']
                                    };
                                    var node;
                                    var nodes=treeNode[0].nodes;
                                    $.each(nodes,function(i,n){
                                        if(n.id==menu['MenuId']) {
                                            node=n;
                                        }
                                    });


                                    $('#tree').treeview('updateNode', [ node, singleNode, { silent: true } ]);
                                }



                                $('#myModal').modal('hide');
                                $("#table").bootstrapTable("refresh");
                            }
                        });

                    }
                },
                error: function () {


                    BootstrapDialog.alert({
                        title: '错误',
                        message: '保存失败！',
                        size:BootstrapDialog.SIZE_SMALL,
                        type: BootstrapDialog.TYPE_DANGER , // <-- Default value is BootstrapDialog.TYPE_PRIMARY

                        closable: false, // <-- Default value is false
                        draggable: true, // <-- Default value is false
                        buttonLabel: '确定', // <-- Default value is 'OK',

                    });
                }


            });

        }
    });
    //绑定验证
    formValidator();

    //模态窗关闭事件
    $('#myModal').on('hidden.bs.modal', function () {
        //清空表单
        $(':input','#meunForm')
            .not(':button, :submit, :reset')
            .val('')
            .removeAttr('checked')
            .removeAttr('selected');
        $("#menuForm").data('bootstrapValidator').destroy();
        $('#menuForm').data('bootstrapValidator', null);
        formValidator();
    });

});

//表格返回参数方法
function queryParams(pageReqeust) {
    pageReqeust.parentId = parentId;  //
    pageReqeust.searchName = searchName;

    return pageReqeust;
}

//form验证规则
function formValidator() {
//表单验证
    $("#menuForm").bootstrapValidator({
        /**
         *  指定不验证的情况
         *  值可设置为以下三种类型：
         *  1、String  ':disabled, :hidden, :not(:visible)'
         *  2、Array  默认值  [':disabled', ':hidden', ':not(:visible)']
         *  3、带回调函数
         [':disabled', ':hidden', function($field, validator) {
            // $field 当前验证字段dom节点
            // validator 验证实例对象
            // 可以再次自定义不要验证的规则
            // 必须要return，return true or false;
            return !$field.is(':visible');
        }]
         */
        excluded: [':disabled', ':hidden', ':not(:visible)'],
        /**
         * 指定验证后验证字段的提示字体图标。（默认是bootstrap风格）
         * Bootstrap 版本 >= 3.1.0
         * 也可以使用任何自定义风格，只要引入好相关的字体文件即可
         * 默认样式
         .form-horizontal .has-feedback .form-control-feedback {
            top: 0;
            right: 15px;
        }
         * 自定义该样式覆盖默认样式
         .form-horizontal .has-feedback .form-control-feedback {
            top: 0;
            right: -15px;
        }
         .form-horizontal .has-feedback .input-group .form-control-feedback {
            top: 0;
            right: -30px;
        }
         */
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        /**
         * 生效规则（三选一）
         * enabled 字段值有变化就触发验证
         * disabled,submitted 当点击提交时验证并展示错误信息
         */
        live: 'enabled',
        /**
         * 为每个字段指定通用错误提示语
         */
        message: 'This value is not valid',
        /**
         * 指定提交的按钮，例如：'.submitBtn' '#submitBtn'
         * 当表单验证不通过时，该按钮为disabled
         */
        submitButtons: 'button[type="submit"]',
        /**
         * submitHandler: function(validator, form, submitButton) {
    *   //validator: 表单验证实例对象
    *   //form  jq对象  指定表单对象
    *   //submitButton  jq对象  指定提交按钮的对象
    * }
         * 在ajax提交表单时很实用
         *   submitHandler: function(validator, form, submitButton) {
            // 实用ajax提交表单
            $.post(form.attr('action'), form.serialize(), function(result) {
                // .自定义回调逻辑
            }, 'json');
         }
         *
         */
        submitHandler: null,
        /**
         * 为每个字段设置统一触发验证方式（也可在fields中为每个字段单独定义），默认是live配置的方式，数据改变就改变
         * 也可以指定一个或多个（多个空格隔开） 'focus blur keyup'
         */
        trigger: null,
        /**
         * Number类型  为每个字段设置统一的开始验证情况，当输入字符大于等于设置的数值后才实时触发验证
         */
        threshold: null,
        /**
         * 表单域配置
         */
        fields: {
            //多个重复
            MenuName: {
                //隐藏或显示 该字段的验证
                enabled: true,
                //错误提示信息
                message: 'This value is not valid',
                /**
                 * 定义错误提示位置  值为CSS选择器设置方式
                 * 例如：'#firstNameMeg' '.lastNameMeg' '[data-stripe="exp-month"]'
                 */
                container: null,
                /**
                 * 定义验证的节点，CSS选择器设置方式，可不必须是name值。
                 * 若是id，class, name属性，<fieldName>为该属性值
                 * 若是其他属性值且有中划线链接，<fieldName>转换为驼峰格式  selector: '[data-stripe="exp-month"]' =>  expMonth
                 */
                selector: null,
                /**
                 * 定义触发验证方式（也可在fields中为每个字段单独定义），默认是live配置的方式，数据改变就改变
                 * 也可以指定一个或多个（多个空格隔开） 'focus blur keyup'
                 */
                trigger: null,
                // 定义每个验证规则
                validators: {
                    //多个重复
                    //官方默认验证参照  http://bv.doc.javake.cn/validators/
                    // 注：使用默认前提是引入了bootstrapValidator-all.js
                    // 若引入bootstrapValidator.js没有提供常用验证规则，需自定义验证规则哦
                    notEmpty: {
                        message: '菜单名称不能为空'
                    },
                    stringLength: {
                        min: 0,
                        max: 50,
                        message: '菜单名称过长'
                    },
                    regexp: {
                        regexp: /[^\]@=/'\"$%&^*{}<>\\\\[:\;]+/,
                        message: '输入值中含有非法字符'
                    }
                }
            },
            URL: {
                validators: {
                    //多个重复
                    //官方默认验证参照  http://bv.doc.javake.cn/validators/
                    // 注：使用默认前提是引入了bootstrapValidator-all.js
                    // 若引入bootstrapValidator.js没有提供常用验证规则，需自定义验证规则哦

                    notEmpty: {
                        message: 'URL不能为空'
                    },
                    stringLength: {
                        min: 0,
                        max: 100,
                        message: 'URL过长'
                    }
                }

            },
            MenuLevel: {
                validators: {
                    notEmpty: {
                        message: '菜单等级不能为空'
                    },
                    regexp: {
                        regexp: /^(\d(\.\d)?|10)$/,
                        message: '菜单等级必须在0-10之间'
                    }
                }
            }
        }
    });
}


//按名称查询
function searchMenus() {
    searchName = $("#name").val();
    $("#table").bootstrapTable("refresh", {})
}

//新增菜单
function add() {
    //清空表单
    $(':input','#menuForm')
        .not(':button, :submit, :reset')
        .val('')
        .removeAttr('checked')
        .removeAttr('selected');
    //清空表单强化版
    // $(':input','#menuForm')
    //     .not(':button, :submit, :reset, :hidden')
    //     .val('')
    //     .removeAttr('checked')
    //     .removeAttr('selected');


    $("#menuForm").data('bootstrapValidator').resetForm(false)
    var node = $("#tree").treeview('getSelected');
    if (node.length <= 0) {

        BootstrapDialog.alert({
            title: '警告',
            message: '请选择父菜单！',
            size:BootstrapDialog.SIZE_SMALL,
            type: BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY

            closable: false, // <-- Default value is false
            draggable: true, // <-- Default value is false
            buttonLabel: '确定', // <-- Default value is 'OK',

        });
        return false;
    }
    $("#ParentMenuId").val(node[0].id);
    $("#myModalLabel").text("新增");
    $('#myModal').modal('show');

}

//修改
function edit() {
    //清空表单
    $(':input','#menuForm')
        .not(':button, :submit, :reset')
        .val('')
        .removeAttr('checked')
        .removeAttr('selected');
    var rows = $("#table").bootstrapTable("getSelections");//获取所有选中的行
    if (rows.length !=1) {

        BootstrapDialog.alert({
            title: '警告',
            message: '请选择一条要修改的数据！',
            size:BootstrapDialog.SIZE_SMALL,
            type: BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY

            closable: false, // <-- Default value is false
            draggable: true, // <-- Default value is false
            buttonLabel: '确定', // <-- Default value is 'OK',

        });
        return false;
    }

    for (var p in rows[0]) {

        $("#menuForm").find(":input[name='" + p + "']").val(rows[0][p]);

    }
    $("#myModalLabel").text("修改");
    $('#myModal').modal('show');


}

/**
 * 删除菜单
 */
function del() {
    var rows = $("#table").bootstrapTable("getSelections");//获取所有选中的行
    if (rows.length <= 0) {

        BootstrapDialog.alert({
            title: '警告',
            message: '请选择一条要删除的数据！',
            size:BootstrapDialog.SIZE_SMALL,
            type: BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY

            closable: false, // <-- Default value is false
            draggable: true, // <-- Default value is false
            buttonLabel: '确定', // <-- Default value is 'OK',

        });
        return false;
    }
    BootstrapDialog.confirm({
        message: "确定要删除选中的菜单吗？",
        type: BootstrapDialog.TYPE_WARNING,
        size:BootstrapDialog.SIZE_SMALL,
        title: "提示",
        btnCancelLabel: '取消', // <-- Default value is 'Cancel',
        btnOKLabel: '确定', // <-- Default value is 'OK',
        callback: function (result) {
            if(result){
                //选择ok后调用
                var ids = "";
                $.each(rows, function (i, n) {
                    ids += n.MenuId + ",";
                });
                ids = ids.substring(0, ids.length - 1);

                var nodes=treeNode[0].nodes;
                $.ajax({
                    type: 'post',
                    url: '/menu/deleteMenus',
                    data: {ids: ids},
                    success: function (result) {

                        if(result.code=="00"){

                            BootstrapDialog.alert({
                                title: '提示',
                                message: '删除成功！',
                                size:BootstrapDialog.SIZE_SMALL,
                                type: BootstrapDialog.TYPE_SUCCESS       , // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                                closable: false, // <-- Default value is false
                                draggable: true, // <-- Default value is false
                                buttonLabel: '确定', // <-- Default value is 'OK',
                                callback: function (result) {

                                    var nodeList=[];
                                    $.each(rows, function (i, n) {

                                        $.each(nodes,function(j,m){
                                            if(n.MenuId==m.id){
                                                nodeList.push(m);
                                            }
                                        });


                                    });
                                    $('#tree').treeview('removeNode', [ nodeList,{ silent: true }]);
                                    $("#table").bootstrapTable("refresh");
                                }

                            });


                        }else if(result.code=="01"){

                            BootstrapDialog.alert({
                                title: '警告',
                                message: result.msg,
                                size:BootstrapDialog.SIZE_SMALL,
                                type: BootstrapDialog.TYPE_WARNING     , // <-- Default value is BootstrapDialog.TYPE_PRIMARY

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
                            size:BootstrapDialog.SIZE_SMALL,
                            type: BootstrapDialog.TYPE_DANGER    , // <-- Default value is BootstrapDialog.TYPE_PRIMARY

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
 * 菜单排序
 */
function moveOrder(x){

    var rows=$("#table").bootstrapTable('getSelections');
    if (rows.length != 1) {

        BootstrapDialog.alert({
            title: '警告',
            message: "请选择一条要移动的数据！",
            size:BootstrapDialog.SIZE_SMALL,
            type: BootstrapDialog.TYPE_WARNING     , // <-- Default value is BootstrapDialog.TYPE_PRIMARY

            closable: false, // <-- Default value is false
            draggable: true, // <-- Default value is false
            buttonLabel: '确定', // <-- Default value is 'OK',

        });

        return false;
    }

    $.ajax({
        type:'post',
        url:'/menu/moveOrder',
        data:{type:x,dataDictStr:JSON.stringify(rows[0])},
        success:function(result){
            if(result.code=="0"){


                BootstrapDialog.alert({
                    title: '提示',
                    message: result.msg,
                    type: BootstrapDialog.TYPE_SUCCESS   , // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                    size:BootstrapDialog.SIZE_SMALL,
                    closable: false, // <-- Default value is false
                    draggable: true, // <-- Default value is false
                    buttonLabel: '确定', // <-- Default value is 'OK',
                    callback: function (result) {
                        $("#table").on("load-success.bs.table",function(data){
                            $("#table").bootstrapTable("checkBy", {field:"MenuId", values:[rows[0].MenuId]});
                            $("#table").off("load-success.bs.table");
                        });
                        $("#table").bootstrapTable("refresh");
                    }
                });




            }else {

                BootstrapDialog.alert({
                    title: '警告',
                    message: result.msg,
                    type: BootstrapDialog.TYPE_WARNING   , // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                    size:BootstrapDialog.SIZE_SMALL,
                    closable: false, // <-- Default value is false
                    draggable: true, // <-- Default value is false
                    buttonLabel: '确定', // <-- Default value is 'OK',

                });
            }
        }
    })


}