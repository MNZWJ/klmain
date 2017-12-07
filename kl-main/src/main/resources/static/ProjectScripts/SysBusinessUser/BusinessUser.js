//存放树节点对应的OrganiseId值
var typeId = "";
//存放树节点对应的OrganiseCode的值
var typeCode = "";
//存放模糊查找的条件
var searchName = "";
//存放树节点
var treeNode = "";
//存放显示的岗位类型字符串
var pType = "";
//存放显示的部门类型字符串
var sType = "";
//存放所有可显组织机构
var sysOrgs = {};
//存放所有用户
var users = [];

var loginNameG="";

//开启页面直接加载
$(function () {

    //获取浏览器高度
    var scanHeight = $(window).height();
    $("#treeDiv").height(scanHeight);
    $.ajax({
        type: 'post',
        url: '/SysBusinessUser/getSysOrganiseTreeList',
        async: false,
        dataType: 'json',
        success: function (result) {
            //初始化treeView
            var $jsonTree = $('#tree').treeview({
                highlightSelected: true,//当选择节点时是否高亮显示。
                showBorder: false,//是否在节点上显示边框。
                data: result.tm,
                //节点选中方法
                onNodeSelected: function (event, data) {

                    treeNode = $("#tree").treeview("getSelected");
                    $('#tree').treeview('expandNode', [treeNode, {silent: true}]);
                    searchName = "";//清空查询条件
                    $("#searchName").val('');//清空查询框
                    typeId = data.id;
                    typeCode = data.code;
                    $("#userTable").bootstrapTable("refresh", {query: {typeId: data.id, typeCode: data.code}})
                }
            });
            //获取点击的树的id和code
            typeId = result.tm[0].id;
            typeCode = result.tm[0].code;
            treeNode = $("#tree").treeview("getNodes", typeId);
            $("#tree").treeview("selectNode", [treeNode[0]]);

            //为组组织机构列表附上初值
            sysOrgs = result.syss;
        }
    });

    $('#userTable').bootstrapTable({
        height: scanHeight,
        striped: true,      //是否显示行间隔色
        cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        method: 'get',//请求方式
        url: '/SysBusinessUser/getBusinessUserList',//请求url
        pagination: 'true',//显示分页条
        paginationLoop: 'true',//启用分页条无限循环功能
        pageNumber: 1,                       //初始化加载第一页，默认第一页
        pageSize: 5,                       //每页的记录行数（*）
        pageList: [5, 10, 25, 50, 100],        //可供选择的每页的行数（*）
        toolbar: '#userToolbar',                //工具按钮用哪个容器
        clickToSelect: false,//是否启用点击选中行
        sidePagination: 'server',//'server'或'client'服务器端分页
        showRefresh: 'true',//是否显示 刷新按钮
        queryParams: queryParams,//返回到前台的参数集
        queryParamsType: '', //默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort
        // 设置为 ''  在这种情况下传给服务器的参数为：pageSize,pageNumber
        sortStable: true,//设置为 true 将获得稳定的排序，我们会添加_position属性到 row 数据中。
        selectItemName: 'state',
        idField: 'userId',
        uniqueId:'userId',
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
                buttonLabel: '确定', // <-- Default value is 'OK',

            });
        },
        onClickRow: function (row, $element) {

            $("#userTable").bootstrapTable("uncheckAll");
            $("#userTable").bootstrapTable("checkBy", {field: 'userId', values: [row.userId]})
        },

        columns: [
            {
                title: '序号',
                field: 'number1',
                formatter: function (value, row, index) {
                    var page = $('#userTable').bootstrapTable('getOptions');

                    return (page.pageNumber - 1) * page.pageSize + index + 1;
                }
            }
            ,
            {
                field: 'state',
                checkbox: true
            },
            {
                field: 'userName',
                title: '姓名',
                halign: 'center',
                align: 'center',
                width: '35%',
                formatter: function (value, rowData, rowIndex) {
                    users.push(rowData);
                    return "<a href='javascript:look(\""+rowData.userId+"\")'>" + value + "</a>";
                }
            },
            {
                field: 'sex',
                title: '性别',
                halign: 'center',
                align: 'center',
                width: '20%',
                formatter: function (value, row, index) {
                    if (value == "1") {
                        return "男";
                    } else {
                        return "女";
                    }
                }

            },

            {

                field: 'deptId',
                title: '部门',
                halign: 'center',
                align: 'center',
                width: '40%',
                formatter: function (value, row, index) {
                    $.each(sysOrgs, function (i, n) {
                        if (value == n.organiseId) {
                            sType = n.organiseName;

                        }
                    });
                    //返回对应类型名
                    return sType;

                }
            }
        ]
    });


    formValidator();
    //绑定保存按钮提交事件
    $("#btn_save").on("click", function () {
        //获取表单对象
        var bootstrapValidator = $("#userForm").data('bootstrapValidator');
        //手动触发验证
        bootstrapValidator.validate();

        if (bootstrapValidator.isValid()) {
            //表单提交的方法、比如ajax提交
            var bu = {};
            //获取表单中输入的值和对应的表单控件名放入user对象
            var buList = $('#userForm').serializeArray();
            $.each(buList, function () {
                bu[this.name] = this.value
            });
            var flag=true;
            if(loginNameG!=$("#loginName").val()){
                $.ajax({
                    type:'post',
                    url:'/SysBusinessUser/checkLoginName',
                    async:false,
                    data:{loginName:$("#loginName").val()},
                    success:function (result) {
                        if(result.obj){

                            flag=true;
                        }else{
                            BootstrapDialog.alert({
                                title: "提示",
                                message: "登录名已存在！",
                                size: BootstrapDialog.SIZE_SMALL,
                                type: BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY

                                //回调函数
                                callback: function () {


                                }
                            });
                            flag=false;
                        }
                    }
                });
            }


            if(flag==false){
                return false;
            }


            $.ajax({
                type: 'post',
                url: '/SysBusinessUser/updateOrAddBusinessUser',
                //将user对象的JSON类型参数传到后台
                data: JSON.stringify(bu),
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

                                //将弹出框隐藏
                                $('#myModel').modal('hide');
                                //更新数据表格
                                $("#userTable").bootstrapTable("refresh");
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
                        buttonLabel: '确定' // <-- Default value is 'OK',

                    });
                }
            });
        }
    });

//模态窗关闭事件
    $('#myModel').on('hidden.bs.modal', function () {
        //重置这个表单里面的所有控件
        $(':input', '#userForm')
            .not(':button, :submit, :reset')
            .val('')
            .removeAttr('checked')
            .removeAttr('selected');
        $("#userForm").data('bootstrapValidator').destroy();
        $('#userForm').data('bootstrapValidator', null);

        $("#myModel").find('input').attr('readonly', false);
        $("#myModel").find('select').removeAttr("disabled");
        $("#btn_save").show();
        $('#sex').selectpicker('refresh');
        $("#isLogin").removeAttr("disabled");
        $("#login").hide();
        formValidator();
    });


});

//前端表格返回到后台的参数方法
function queryParams(pageReqeust) {
    pageReqeust.typeCode = typeCode;  //组织机构编码
    pageReqeust.typeId = typeId;  //组织机构编码
    pageReqeust.searchName = searchName;

    return pageReqeust;
}

//form验证规则
function formValidator() {
//表单验证
    $("#userForm").bootstrapValidator({
        /**
         * 表单域配置
         */
        fields: {
            //设置用户名验证
            userName: {
                //隐藏或显示 该字段的验证
                enabled: true,
                //错误提示信息
                message: '输入有误',

                // 定义每个验证规则
                validators: {
                    notEmpty: {
                        message: '用户名不能为空'
                    },
                    stringLength: {
                        min: 0,
                        max: 50,
                        message: '用户名过长，用户名长度不得大于50'
                    },
                    regexp: {
                        regexp: /[^\]@=/'\"$%&^*{}<>\\\\[:\;]+/,
                        message: '用户名中含有非法字符'
                    }
                }
            },
            //设置电话号码名称验证
            telephone: {
                validators: {

                    regexp: {
                        regexp: /^1([3578]\d|4[57])\d{8}$/,
                        message: '请正确填写您的手机号码'
                    }
                }

            }
        }
    });
}

//按名称查询
function searchUsers() {
    searchName = $("#searchName").val();
    $("#userTable").bootstrapTable("refresh", {});
}


//新增人员
function userAdd() {

    loginNameG="";
    var node = $("#tree").treeview('getSelected');
    //如果没有选中
    if (node.length == 0) {
        BootstrapDialog.alert({
            title: '警告',
            message: '请选择一个最底层的组织机构！',
            size: BootstrapDialog.SIZE_SMALL,
            type: BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY

            closable: false, // <-- Default value is false
            draggable: true, // <-- Default value is false
            buttonLabel: '确定', // <-- Default value is 'OK',
        });
        return false;
    } else {
        //如果此机构下没有子机构
        if (node[0].nodes == null) {


            //重置指定表单的控件
            $('#userForm')[0].reset();

            //清空表单
            $(':input', '#userForm')
                .not(':button, :submit, :reset')
                .val('')
                .removeAttr('checked')
                .removeAttr('selected');


            $("#userForm").data('bootstrapValidator').resetForm(false);
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
            $("#deptId").val(node[0].id);
            $("#deptCode").val(node[0].code);

            $("#sex").selectpicker('refresh');
            //如果复选框被选中
            if ($('#isWxCreated').is(':checked')) {
                $('#login').style.visibility = "visible";
            }

            //将此标签标题改为新增
            $("#myModelLabel").text("新增");
            //展示悬浮窗口
            $('#myModel').modal('show');
        } else {
            BootstrapDialog.alert({
                title: '警告',
                message: '此机构下有子机构，不可添加！',
                size: BootstrapDialog.SIZE_SMALL,
                type: BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY

                closable: false, // <-- Default value is false
                draggable: true, // <-- Default value is false
                buttonLabel: '确定', // <-- Default value is 'OK',

            });
            return false;
        }
    }


}

//修改
function userEdit() {

    //清空表单
    $(':input', '#userForm')
        .not(':button, :submit, :reset')
        .val('')
        .removeAttr('checked')
        .removeAttr('selected');
    var rows = $("#userTable").bootstrapTable("getSelections");//获取所有选中的行

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

    loginNameG=rows[0].loginName;

    if(rows[0].loginName!=""&&rows[0].loginName!=null){
        $("#isLogin").prop("checked",true);
        $("#login").show();
    }else{
        $("#isLogin").prop("checked",false);
        $("#login").hide();
    }


    for (var p in rows[0]) {
        $("#userForm").find(":input[name='" + p + "']").val(rows[0][p]);

    }

    $('#sex').selectpicker('val', rows[0].sex);
    $("#myModelLabel").text("修改");
    $('#myModel').modal('show');
}

/**
 * 删除人员
 */
function userDel() {
    var rows = $("#userTable").bootstrapTable("getSelections");//获取所有选中的行
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
        message: "确定要删除选中的人员吗？",
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
                    ids += n.userId + ",";
                });
                ids = ids.substring(0, ids.length - 1);


                var nodes = treeNode[0].nodes;


                $.ajax({
                    type: 'post',
                    url: '/SysBusinessUser/deleteBusinessUser',
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
                                            if (n.userId == m.id) {
                                                nodeList.push(m);
                                            }
                                        });


                                    });
                                    $("#userTable").bootstrapTable("refresh");
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

//显示或隐藏登录名
function showOrHiddenLogin() {
    if ($("#isLogin").is(':checked')) {
        $("#login").show();
    } else {
        $("#login").hide();
        $("#loginName").val('');
    }
}

//点击弹出查看窗
function  look(userId) {

    var row=$("#userTable").bootstrapTable("getRowByUniqueId",userId);
    //清空表单
    $(':input', '#userForm')
        .not(':button, :submit, :reset')
        .val('')
        .removeAttr('checked')
        .removeAttr('selected');

    if(row.loginName!=""&&row.loginName!=null){
        $("#isLogin").prop("checked",true);
        $("#login").show();
    }else{
        $("#isLogin").prop("checked",false);
        $("#login").hide();
    }


    $('#sex').selectpicker('val', row.sex);
    $("#userName").val(row.userName);
    $("#telephone").val(row.telephone);
    $("#loginName").val(row.loginName);

    $("#myModelLabel").text("查看");
    $('#myModel').modal('show');
    $("#myModel").find('input').attr('readOnly', true);
    $("#myModel").find('select').attr("disabled", "disabled");
    $("#isLogin").attr("disabled", "disabled");

    $("#btn_save").hide();
}