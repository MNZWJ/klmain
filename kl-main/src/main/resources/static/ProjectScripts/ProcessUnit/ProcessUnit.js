//存放所有重大危险源
var sourceList = [];

//存放危险源名称
var sourceName="";

//存放危险源ID
var sourceId="";

//存放公司ID
var companyId="";

//屏幕高度
var scanHeight="";
//开启页面直接加载
$(function () {
    //初始化表格
    initTable();

    //获取企业集合
    getCompanyList();

    //获取所有危险源
    getDangerSource();

    formValidator();
    //绑定保存按钮提交事件
    $("#btn_save").on("click", function () {
        //获取表单对象
        var bootstrapValidator = $("#unitForm").data('bootstrapValidator');
        //手动触发验证
        bootstrapValidator.validate();

        if (bootstrapValidator.isValid()) {
            //表单提交的方法、比如ajax提交
            var unit = {};
            //获取表单中输入的值和对应的表单控件名放入sysOrg对象
            var unitList = $('#unitForm').serializeArray();
            $.each(unitList, function () {
                unit[this.name] = this.value
            });

            $.ajax({
                type: 'post',
                url: '/ProcessUnit/saveData',
                //将sysOrg对象的JSON类型参数传到后台
                data: JSON.stringify(unit),
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
                                $('#myModal').modal('hide');
                                //更新数据表格
                                $("#processUnitTable").bootstrapTable("refresh");
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
        $(':input', '#unitForm')
            .not(':button, :submit, :reset')
            .val('')
            .removeAttr('checked')
            .removeAttr('selected');
        $("#unitForm").data('bootstrapValidator').destroy();
        $('#unitForm').data('bootstrapValidator', null);
        formValidator();
    });


});
//获取企业集合
function getCompanyList() {
    $.ajax({
        type: 'get',
        async: false,
        url: '/EnterpriseInfo/getCompanyList',
        success: function (result) {
            var companyList = eval(result);
            $.each(companyList, function (i) {
                $('#CompanyName').append("<option value='" + companyList[i].companyId + "'>" + companyList[i].companyName + "</option>");
            });
            $('#CompanyName').selectpicker('val','');
            $('#CompanyName .selectpicker').selectpicker('refresh',{});
        },
        error: function () {
            alert("请求失败");
        }
    });
}

//获取所有危险源
function getDangerSource() {
    $.ajax({
        type: 'get',
        url: '/DangerSource/getAllDSource',
        async: false,
        data: {sourceId: ''},
        contentType : 'application/json;charset=utf-8',
        success: function (result) {
            sourceList = result;
        }
    });
}

//清空查询条件
function clearRole() {
    $("#searchName").val('');//清空查询框
}

//初始化表格
function initTable(){
    //获取浏览器高度
    var scanHeight = $(window).height();
    //加载列表
    $('#processUnitTable').bootstrapTable({
        height: scanHeight ,
        striped: true,      //是否显示行间隔色
        cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        method: 'get',//请求方式
        url: '/ProcessUnit/getProcessUnitList',//请求url
        pagination: 'true',//显示分页条
        paginationLoop: 'true',//启用分页条无限循环功能
        pageNumber: 1,                       //初始化加载第一页，默认第一页
        pageSize: 5,                       //每页的记录行数（*）
        pageList: [5,10, 25, 50, 100],        //可供选择的每页的行数（*）
        toolbar: '#unitToolbar',                //工具按钮用哪个容器
        clickToSelect: true,//是否启用点击选中行
        sidePagination: 'server',//'server'或'client'服务器端分页
        showRefresh: 'true',//是否显示 刷新按钮
        queryParams: queryParams,//返回到前台的参数集
        queryParamsType: '', //默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort
        // 设置为 ''  在这种情况下传给服务器的参数为：pageSize,pageNumber
        sortStable: true,//设置为 true 将获得稳定的排序，我们会添加_position属性到 row 数据中。
        selectItemName: 'state',
        uniqueId:'unitId',
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
        },onClickRow:function(row, $element){

            $("#processUnitTable").bootstrapTable("uncheckAll");
            $("#processUnitTable").bootstrapTable("checkBy",{field:'Id',values:[row.unitId]})
        },
        columns: [{
            title: '序号',
            field: 'number1',
            formatter: function (value, row, index) {
                var page = $('#processUnitTable').bootstrapTable('getOptions');

                return (page.pageNumber - 1) * page.pageSize + index + 1;
            }
        }, {
            field: 'state',
            checkbox: true
        },{
            field: 'sourceId',
            title: '所属危险源',
            halign: 'center',
            align:'center',
            formatter: function (value, row, index) {
                $.each(sourceList, function (i, n) {
                    if (value == n.sourceId) {
                        sourceName = n.sourceName;

                    }
                });
                return sourceName;
            }
        },
            {
                field: 'unitName',
                title: '工艺单元名称',
                halign: 'center',
                align:'center',
                cellStyle: function (value, row, index, field) {
                    return {classes: '', css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis','overflow': 'hidden'}};
                }
            },{
                field: 'fEI',
                title: '火灾爆炸指数F&EI',
                halign: 'center',
                align:'center'
            }, {
                field: 'dangerRank',
                title: '危险等级',
                halign: 'center',
                align:'center'
            },  {
                field: 'afterFEI',
                title: '补偿后的F&EI',
                halign: 'center',
                align:'center'
            },   {
                field: 'afterDangerRank',
                title: '补偿后的危险等级',
                halign: 'center',
                align:'center'
            }
        ]
    });
}

//前端表格返回到后台的参数方法
function queryParams(pageReqeust) {
    pageReqeust.searchName = $(" #searchName ").val();
    return pageReqeust;
}

//form验证规则
function formValidator() {
//表单验证
    $("#unitForm").bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        /**
         * 表单域配置
         */
        fields: {
            //设置工艺单元名称验证
            UnitName: {
                //隐藏或显示 该字段的验证
                enabled: true,
                //错误提示信息
                message: '输入有误',

                // 定义每个验证规则
                validators: {
                    notEmpty: {
                        message: '请输入工艺单元名称'
                    },
                    stringLength: {
                        min: 0,
                        max: 50,
                        message: '工艺单元名称过长，名称长度不得大于50'
                    },
                    regexp: {
                        regexp: /[^\]@=/'\"$%&^*{}<>\\\\[:\;]+/,
                        message: '工艺单元名称中含有非法字符'
                    }
                }
            },
            //设置企业对应危险源验证
            SourceId: {
                validators: {
                    notEmpty: {
                        message: '请选择危险源，如果此公司没有危险源，那请先录入本公司的危险源'
                    }
                }
            },
            //设置火灾爆炸指数 F&EI验证
            FEI: {
                validators: {
                    notEmpty: {
                        message: '请输入火灾爆炸指数 F&EI'
                    }
                }
            },
            //设置危险等级验证
            DangerRank: {
                validators: {
                    notEmpty: {
                        message: '请输入危险等级'
                    }
                }
            },
            //设置补偿后的 F&EI验证
            AfterFEI: {
                validators: {
                    notEmpty: {
                        message: '请输入补偿后的 F&EI'
                    }
                }
            },
            //设置补偿后的危险等级验证
            AfterDangerRank: {
                validators: {
                    notEmpty: {
                        message: '请输入补偿后的危险等级'
                    }
                }
            }
        }
    });
}

//按名称查询
function searchMenus() {
    searchName = $("#searchName").val();
    $("#processUnitTable").bootstrapTable("refresh", {});
}

//select公司与危险源控件联动
function changeDangerSource(thisForm){
    var companyId=$("#CompanyName").val();
    $("#SourceId").html('');
    $.each(sourceList, function (i,n) {
        if(n.companyId==companyId){
            $('#SourceId').append("<option value='" + n.sourceId + "'>" + n.sourceName + "</option>");
        }

    });
    $("#SourceId").selectpicker('refresh');
}

//新增组织机构
function unitAdd() {

    //重置指定表单的控件
    $('#unitForm')[0].reset();

    //清空表单
    $(':input', '#unitForm')
        .not(':button, :submit, :reset')
        .val('')
        .removeAttr('checked')
        .removeAttr('selected');

    $("#unitForm").data('bootstrapValidator').resetForm(false);
    //刷新下拉菜单
    $("#CompanyName").selectpicker('refresh');
    $("#SourceId").selectpicker('refresh');

    changeDangerSource(document.myForm);
    //将此标签标题改为新增
    $("#myModalLabel").text("新增");
    //展示悬浮窗口
    $('#myModal').modal('show');
}

//修改
function unitEdit() {

    //清空表单
    $(':input', '#unitForm')
        .not(':button, :submit, :reset')
        .val('')
        .removeAttr('checked')
        .removeAttr('selected');
    var rows = $("#processUnitTable").bootstrapTable("getSelections");//获取所有选中的行
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
        $("#unitForm").find(":input[name='" + p + "']").val(rows[0][p]);

    }
    sourceId=rows[0].sourceId;
    $.each(sourceList, function (i,n) {
        if(n.sourceId==sourceId){
            companyId=n.companyId;
            return false;
        }

    });

    $('#CompanyName').selectpicker('val', companyId);
    changeDangerSource(document.myForm);

    $("#UnitName").val(rows[0].unitName);
    $("#FEI").val(rows[0].fEI);
    $("#DangerRank").val(rows[0].dangerRank);
    $("#AfterFEI").val(rows[0].afterFEI);
    $("#AfterDangerRank").val(rows[0].afterDangerRank);
    $('#SourceId').selectpicker('val', rows[0].sourceId);
    $("#myModalLabel").text("修改");
    $('#myModal').modal('show');
}

//删除字典
function unitDel() {
    var rows = $("#processUnitTable").bootstrapTable("getSelections");//获取所有选中的行
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
        message: "确定要删除选中的工艺单元吗？",
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
                    ids += n.unitId+ ",";
                });
                ids = ids.substring(0, ids.length - 1);


                $.ajax({
                    type: 'post',
                    url: '/ProcessUnit/delProcessUnit',
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
                                    $("#processUnitTable").bootstrapTable("refresh");
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

//适应页面大小
function resizePage(){


    //获取浏览器高度
    scanHeight = $(window).height();
    initTable();
}