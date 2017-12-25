//屏幕高度
var scanHeight="";
//开启页面直接加载
$(function () {
    //初始化表格
    initTable();

    //校验设置
    formValidator();

    //保存按钮点击事件
    saveData();


//模态窗关闭事件
    $('#myModal').on('hidden.bs.modal', function () {
        //重置这个表单里面的所有控件
        $(':input', '#alarmForm')
            .not(':button, :submit, :reset')
            .val('')
            .removeAttr('checked')
            .removeAttr('selected');
        $("#alarmForm").data('bootstrapValidator').destroy();
        $('#alarmForm').data('bootstrapValidator', null);
        formValidator();
    });

});

//保存事件
function saveData(){
    //绑定保存按钮提交事件
    $("#btn_save").on("click", function () {

        //获取表单对象
        var bootstrapValidator = $("#unitForm").data('bootstrapValidator');
        //手动触发验证
        bootstrapValidator.validate();
        if (bootstrapValidator.isValid()) {
            //表单提交的方法、比如ajax提交
            var unit = new Object();
            //获取表单中输入的值和对应的表单控件名放入unit对象
            var unitList = $('#unitForm').serializeArray();
            //检验表单
            var end = checkForm(unitList);
            var c=false;
            $.each(unitList, function () {

                if(this.name=="unitId"){
                    unit[this.name] = unitId;
                }
                if(this.name=='SourceId'){
                    c=true;
                }
                unit[this.name] = this.value;
            });
            if (!end) {
                return false;
            }
            if(!c){
                BootstrapDialog.alert({
                    title: '错误',
                    message: '请选择重大危险源！！！',
                    size: BootstrapDialog.SIZE_SMALL,
                    type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY

                    closable: false, // <-- Default value is false
                    draggable: true, // <-- Default value is false
                    buttonLabel: '确定', // <-- Default value is 'OK',

                });
                return false;
            }


            //获取折叠面板equipInfoTable表格中的值
            var equipInfoTable = $('#equipInfoTable').bootstrapTable('getData');
            var e = checkEquipTable(equipInfoTable);
            if (!e) {
                return false;
            }
            //,"deleteIds":equipIds.substring(0,equipIds.length-1)
            var cmd = {
                "unit": unit,
                "equipInfoTable": equipInfoTable,
                "deleteIds": equipIds.substring(0, equipIds.length - 1)
            };

            $.ajax({
                type: 'post',
                url: '/ProcessUnit/saveData',
                //将sysOrg对象的JSON类型参数传到后台
                data: {cmd: JSON.stringify(cmd)},
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

}

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

//获取所有设备类型
function getEquipType() {
    $.ajax({
        url: '/EquipType/getEquipTypeTreeList',
        async: false,
        type: "get",
        dataType: 'json',
        contentType : 'application/json;charset=utf-8',
        success: function (n) {
            var arr=n[0].nodes;
            $.each(arr, function (i) {
                equipList.push({ value:arr[i].id, text: arr[i].text });
            });
        }
    });
}

//获取所有设备状态
function getEquipStatus() {
    $.ajax({
        url: '/SysDictionary/getDataDictList?typeId=1c42a1c0-5701-47e2-894a-0987e70c58bd',
        async: false,
        type: "get",
        dataType: 'json',
        contentType : 'application/json;charset=utf-8',
        success: function (n) {
            $.each(n, function (i) {
                equipStatusList.push({ value:n[i].dictId, text: n[i].dictName });
            });
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
                field: 'unitName',
                title: '工艺单元名称',
                halign: 'center',
                align:'center',
                cellStyle: function (value, row, index, field) {
                    return {classes: '', css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis','overflow': 'hidden'}};
                },
                formatter: function (value, rowData, rowIndex) {
                    return "<a href='javascript:look(\""+rowData.unitId+"\")'>" + value + "</a>";
                }
            },{
            field: 'companyName',
            title: '企业名称',
            halign: 'center',
            align:'center'
        },{
            field: 'sourceId',
            title: '危险源名称',
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
        },{
            field: 'uniqueCodeU',
            title: '唯一编码',
            halign: 'center',
            align:'center'
        },{
                field: 'fEI',
                title: '火灾爆炸指数F&EI',
                halign: 'center',
                align:'center'
            },   {
                field: 'afterFEI',
                title: '补偿后的F&EI',
                halign: 'center',
                align:'center'
            },{
                field: 'dangerRank',
                title: '危险等级',
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
    $("#alarmForm").bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        /**
         * 表单域配置
         */
        fields: {
            //唯一编码验证
            typeCode: {
                //隐藏或显示 该字段的验证
                enabled: true,
                threshold: 0,
                //有3字符以上才发送ajax请求，（input中输入一个字符，插件会向服务器发送一次，设置限制，6字符以上才开始）
                //错误提示信息
                message: '输入有误',
                validators: {
                    notEmpty: {
                        message: '唯一编码不能为空'
                    }, stringLength: {
                        min: 0,
                        max: 30,
                        message: '唯一编码过长'
                    },
                    remote:{
                        url:'/AlarmType/validateTypeCode',
                        message: '唯一编码已存在',
                        type: 'POST'
                    }
                }
            },
            //设置工艺单元名称验证
            typeName: {
                //隐藏或显示 该字段的验证
                enabled: true,
                //错误提示信息
                message: '输入有误',

                // 定义每个验证规则
                validators: {
                    notEmpty: {
                        message: '请输入报警类型名称'
                    },
                    stringLength: {
                        min: 0,
                        max: 50,
                        message: '报警类型名称过长，名称长度不得大于50'
                    },
                    regexp: {
                        regexp: /[^\]@=/'\"$%&^*{}<>\\\\[:\;]+/,
                        message: '报警类型名称中含有非法字符'
                    }
                }
            }
        }
    });
}

//按名称查询
function searchMenus() {
    //获取模糊查询条件
    searchName = $("#searchName").val();
    //更新表格
    $("#alarmTypeTable").bootstrapTable("refresh", {});
}

//新增报警类型
function alarmAdd() {
    //重置指定表单的控件
    $('#alarmForm')[0].reset();

    //清空表单
    $(':input', '#alarmForm')
        .not(':button, :submit, :reset')
        .val('')
        .removeAttr('checked')
        .removeAttr('selected');

    $("#alarmForm").data('bootstrapValidator').resetForm(false);
    //刷新下拉菜单
    $("#iDCode").selectpicker('refresh');
    $('#typeName').selectpicker('val','');
    $('#typeCode').selectpicker('val','');
    　
    $("#typeCode").removeAttr("readonly");
    $("#alarmTypeTable").bootstrapTable('load', []);
    //将此标签标题改为新增
    $("#myModalLabel").text("新增");

    //展示悬浮窗口
    $('#myModal').modal('show');
}

//修改报警类型
function alarmEdit() {
    //清空表单
    $(':input', '#alarmForm')
        .not(':button, :submit, :reset')
        .val('')
        .removeAttr('checked')
        .removeAttr('selected');
    var rows = $("#alarmTypeTable").bootstrapTable("getSelections");//获取所有选中的行

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
    $("#alarmForm").data('bootstrapValidator').resetForm(false);




    // $("#alarmTypeTable").bootstrapTable("refresh");


    //设置唯一编码为只读
    $('#typeCode').attr("readonly","readonly");
    $("#typeName").val(rows[0].typeName);
    $('#iDCode').selectpicker('val',rows[0].iDCode);
    $("#typeCode").val(rows[0].typeCode);

    $("#alarmTypeTable").bootstrapTable('load', []);

    $("#myModalLabel").text("修改");
    $('#myModal').modal('show');
    // $("#unitForm").data('bootstrapValidator').removeField("UniqueCodeU");//删除编码验证
}

//删除报警类型
function alarmDel() {
    var rows = $("#alarmTypeTable").bootstrapTable("getSelections");//获取所有选中的行
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
        message: "确定要删除选中的报警类型吗？",
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
                    ids += n.typeCode+ ",";
                });
                ids = ids.substring(0, ids.length - 1);


                $.ajax({
                    type: 'post',
                    url: '/AlarmType/delAlarmType',
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
                                    $("#alarmTypeTable").bootstrapTable("refresh");
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