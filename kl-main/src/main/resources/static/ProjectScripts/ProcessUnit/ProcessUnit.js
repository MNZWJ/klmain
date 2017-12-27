//存放所有重大危险源
var sourceList = [];

//存放事件类型
var eventFlag="";

//是否只读的标识
var state=false;

//存放所有设备类型
var equipList = [];

//存放所有设备状态
var equipStatusList = [];

//存放危险源名称
var sourceName="";

//存放危险源ID
var sourceId="";

//存放公司ID
var companyId="";

//存放工艺单元ID
var unitId="";

//存放删除的设备的ID
var equipIds="";

//存放设备的ID
var equipId="";

//屏幕高度
var scanHeight="";
//开启页面直接加载
$(function () {
    //初始化表格
    initTable();

    //获取企业集合
    getCompanyList();

    //获取设备类型集合
    getEquipType();
    
    //获取设备状态集合
    getEquipStatus();

    initEquip();

    //获取所有危险源
    getDangerSource();

    formValidator();

    saveData();


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
        pageSize: 10,                       //每页的记录行数（*）
        pageList: [5,10,15,20,25,50,100],        //可供选择的每页的行数（*）
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

//初始化设备信息表格
function initEquip() {
    $("#equipInfoTable").bootstrapTable({
        method: 'get',
        editable:true,//开启编辑模式
        url:"/EquipInfo/getEquipInfoList",
        cache: false,
        pagination: true,
        clickToSelect: true,//是否启用点击选中行
        idField:'equipId',
        uniqueId: 'equipId', //设唯一索引
        striped: true,
        minimumCountColumns: 2,
        smartDisplay:true,
        queryParams: function (pageReqeust) {
            pageReqeust.unitId = unitId;
            return pageReqeust;
        },
        rowStyle: function () {//自定义行样式
            return "bootTableRow";
        },
        onLoadSuccess:function(){
            //当查看时控制可编辑表格不可编辑
            if(eventFlag=="look") {
                $("#equipInfoTable").find(".editable").editable('disable');
            }else if(eventFlag=="edit"){
                $("#equipInfoTable").find("#uniqueCode.editable").editable('disable');
            }

        },
        columns: [
            {
                title: '序号',
                field: 'number1',
                halign: 'center',
                align: 'center',
                formatter: function (value, row, index) {
                    var page = $('#equipInfoTable').bootstrapTable('getOptions');
                    return (page.pageNumber - 1) * page.pageSize + index + 1;
                }
            },
            {
                field: 'state',
                checkbox: true
            },
            {
                field: 'equipName',
                title: '设备名称',
                halign: 'center',
                editable:{
                    type: 'text',
                    title: '请输入',
                    validate: function (value) { //字段验证
                        if (!$.trim(value)) {
                            return '不能为空';
                        }
                    }
                }
            },{
                field: 'equipType',
                title: '设备类型',
                halign: 'center',
                align:'center',
                editable:{
                    type: 'select',
                    title: '请选择',
                    source: function () {
                        return equipList;
                    },
                    validate: function (value) { //字段验证
                        if (!$.trim(value)) {
                            return '不能为空';
                        }
                    }
                }
            },{
                field: 'uniqueCode',
                title: '唯一编码',
                halign: 'center',
                editable:{
                    type: 'text',
                    title: '请选择',
                    validate: function (value) { //字段验证

                        if (!$.trim(value)||$.trim(value)==null) {
                            return '不能为空';
                        }
                        var info="";
                        $.ajax({
                            type: 'post',
                            url: '/EquipInfo/validateEquipCode?UniqueCode='+value,
                            async: false,
                            contentType : 'application/json;charset=utf-8',
                            success: function (result) {
                                if(!result.end){
                                    info="此唯一编码已存在";
                                }
                            }
                        });
                        if(info!=""&&info!=null){
                            return info;
                        }
                    }
                }

            },{
                field: 'equipStatus',
                title: '设备状态',
                halign: 'center',
                align:'center',
                editable:{
                    type: 'select',
                    title: '请选择',
                    source: function () {
                        return equipStatusList;
                    },
                    validate: function (value) { //字段验证
                        if (!$.trim(value)) {
                            return '不能为空';
                        }
                    }
                }
            }
        ]
    });
    //新增
    $('#addEquip').click(function(){
        $('#equipInfoTable').bootstrapTable('selectPage', 1);
        var data = {equipName: '',equipType:'',uniqueCode:'',equipId:'',equipStatus:''};
        $('#equipInfoTable').bootstrapTable('prepend', data);
    });
//删除
    $('#delEquip').click(function(){
        var row = $("#equipInfoTable").bootstrapTable("getSelections");//获取所有选中的行
        if (row.length <= 0) {
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
        }else {
            for(var i=0;i<row.length;i++){
                if(eventFlag=='edit'){
                    equipIds+=row[i].equipId+",";
                }
                $("#equipInfoTable").bootstrapTable('removeByUniqueId', row[i].equipId);
            }
        }
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
                message: '<br>输入有误',

                // 定义每个验证规则
                validators: {
                    notEmpty: {
                        message: '<br>请输入工艺单元名称'
                    },
                    stringLength: {
                        min: 0,
                        max: 50,
                        message: '<br>工艺单元名称过长，名称长度不得大于50'
                    },
                    regexp: {
                        regexp: /[^\]@=/'\"$%&^*{}<>\\\\[:\;]+/,
                        message: '<br>工艺单元名称中含有非法字符'
                    }
                }
            },
            //唯一编码验证
            UniqueCodeU: {
                //隐藏或显示 该字段的验证
                enabled: true,
                threshold: 0,
                //有3字符以上才发送ajax请求，（input中输入一个字符，插件会向服务器发送一次，设置限制，6字符以上才开始）
                //错误提示信息
                message: '<br>输入有误',
                validators: {
                    notEmpty: {
                        message: '<br>唯一编码不能为空'
                    }, stringLength: {
                        min: 0,
                        max: 30,
                        message: '<br>唯一编码过长'
                    },
                    regexp: {
                        regexp: /[^\]@=/'\"$%&^*{}<>\\\\[:\;]+/,
                        message: '<br>输入值中含有非法字符'
                    },
                    remote:{
                        url:'/ProcessUnit/validateUniqueCode',
                        message: '<br>唯一编码已存在',
                        type: 'POST'
                    }
                }
            },
            //设置企业验证
            CompanyName: {
                validators: {
                    notEmpty: {
                        message: '<br>请选择企业'
                    }
                }
            },
            //设置企业对应危险源验证
            SourceId: {
                validators: {
                    notEmpty: {
                        message: '请选择危险源'
                    }
                }
            },
            //设置火灾爆炸指数 F&EI验证
            FEI: {
                validators: {
                    notEmpty: {
                        message: '<br>请输入火灾爆炸指数 F&EI'
                    }
                }
            },
            //设置危险等级验证
            DangerRank: {
                validators: {
                    notEmpty: {
                        message: '请选择危险等级'
                    }
                }
            },
            //设置补偿后的 F&EI验证
            AfterFEI: {
                validators: {
                    notEmpty: {
                        message: '<br>请输入补偿后的 F&EI'
                    }
                }
            },
            //设置补偿后的危险等级验证
            AfterDangerRank: {
                validators: {
                    notEmpty: {
                        message: '请选择补偿后的危险等级'
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
    $("#SourceId").selectpicker('val','');
}

//新增组织机构
function unitAdd() {
    eventFlag="add";
    //重置指定表单的控件
    $('#unitForm')[0].reset();

    //清空表单
    $(':input', '#unitForm')
        .not(':button, :submit, :reset')
        .val('')
        .removeAttr('checked')
        .removeAttr('selected');

    $("#unitForm").data('bootstrapValidator').resetForm(false);
    if(state){
        $("#unitForm").find('input').removeAttr('readonly');
        $("#unitForm").find('select').removeAttr("disabled", "disabled");
        state = false;
    }
    //刷新下拉菜单
    $("#CompanyName").selectpicker('refresh');
    $('#CompanyName').selectpicker('val','');
    $("#SourceId").selectpicker('refresh');

    changeDangerSource(document.myForm);

    　
    $("#UniqueCodeU").removeAttr("readonly");
    $("#SourceId").selectpicker('val','');
    $("#DangerRank").selectpicker('val','');
    $("#AfterDangerRank").selectpicker('val','');
    $("#equipInfoTable").bootstrapTable('load', []);
    //将此标签标题改为新增
    $("#myModalLabel").text("新增");

    //展示悬浮窗口
    $('#myModal').modal('show');
    $('#collapseOne').collapse('show');
    $('#collapseTwo').collapse('hide');
    $("#btn_save").show();
    $("#addEquip").show();
    $("#delEquip").show();
}

//修改
function unitEdit() {
    equipIds="";
    eventFlag="edit";
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
    unitId=rows[0].unitId;
    $("#unitForm").data('bootstrapValidator').resetForm(false);

    if(state){
        $("#unitForm").find('input').removeAttr('readonly');
        $("#unitForm").find('select').removeAttr("disabled", "disabled");
        state = false;
    }

    // for (var p in rows[0]) {
    //     $("#unitForm").find(":input[name='" + p + "']").val(rows[0][p]);
    //
    // }
    sourceId=rows[0].sourceId;


    $.each(sourceList, function (i,n) {
        if(n.sourceId==sourceId){
            companyId=n.companyId;
            return false;
        }

    });

    $('#CompanyName').selectpicker('val', companyId);
    changeDangerSource(document.myForm);




    $("#processUnitTable").bootstrapTable("refresh");
    $("#equipInfoTable").bootstrapTable("refresh");
    $.ajax({
        type: 'get',
        async:false,
        url: '/EquipInfo/getEquipInfoList?unitId='+rows[0].unitId,
        success: function (result) {
            //清空表单
            $(':input', '#unitForm')
                .not(':button, :submit, :reset')
                .val('')
                .removeAttr('checked')
                .removeAttr('selected');
            for (var p in result[0]) {
                $("#unitForm").find(":input[name='" + p + "']").val(result[0][p]);
            }
            //下拉框赋值
            $('#equipType').selectpicker('val', result[0].equipType);
            $('#equipStatus').selectpicker('val', result[0].equipStatus);
            $("#equipName").val(result[0].equipName);
            $("#uniqueCode").val(result[0].uniqueCode);
            equipId=result[0].equipId;
        }
    });


    //设置唯一编码为只读
    $('#UniqueCodeU').attr("readonly","readonly");
    $("#UnitName").val(rows[0].unitName);
    $("#UniqueCodeU").val(rows[0].uniqueCodeU);
    $("#FEI").val(rows[0].fEI);
    $("#DangerRank").selectpicker('val', rows[0].dangerRank);
    $("#AfterFEI").val(rows[0].afterFEI);
    $("#AfterDangerRank").selectpicker('val', rows[0].afterDangerRank);
    $('#CompanyName').selectpicker('val', companyId);
    $('#SourceId').selectpicker('val', rows[0].sourceId);
    $("#equipInfoTable").bootstrapTable('load', []);

    $("#myModalLabel").text("修改");
    $('#myModal').modal('show');
    $('#collapseOne').collapse('show');
    $('#collapseTwo').collapse('hide');
    $("#btn_save").show();
    $("#addEquip").show();
    $("#delEquip").show();
    $("#unitForm").data('bootstrapValidator').removeField("UniqueCodeU");//删除编码验证
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

//工艺单元点击事件弹出查看窗
function look(obj) {
    eventFlag="look";
    unitId=obj;
    //清空表单
    $(':input', '#unitForm')
        .not(':button, :submit, :reset')
        .val('')
        .removeAttr('checked')
        .removeAttr('selected');
    var rows = $("#processUnitTable").bootstrapTable("getSelections");//获取所有选中的行

    $("#unitForm").data('bootstrapValidator').resetForm(false);

    if(state){
        $("#unitForm").find('input').removeAttr('readonly');
        $("#unitForm").find('select').removeAttr("disabled", "disabled");
        state = false;
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

    unitId=rows[0].unitId;


    $("#processUnitTable").bootstrapTable("refresh");
    $("#equipInfoTable").bootstrapTable("refresh");

    $("#UnitName").val(rows[0].unitName);
    $("#UniqueCodeU").val(rows[0].uniqueCodeU);
    $("#FEI").val(rows[0].fEI);
    $("#DangerRank").selectpicker('val', rows[0].dangerRank);
    $("#AfterFEI").val(rows[0].afterFEI);
    $("#AfterDangerRank").selectpicker('val', rows[0].afterDangerRank);
    $('#CompanyName').selectpicker('val', companyId);
    $('#SourceId').selectpicker('val', rows[0].sourceId);
    $("#equipInfoTable").bootstrapTable('load', []);
    $("#myModalLabel").text("查看");
    $('#myModal').modal('show');
    $('#collapseOne').collapse('show');
    $('#collapseTwo').collapse('hide');
    $("#unitForm").find('input').attr({ readonly: 'true' });
    $("#unitForm").find('select').attr("disabled", "disabled");
    $("#btn_save").hide();
    $("#addEquip").hide();
    $("#delEquip").hide();
    state=true;
}

//适应页面大小
function resizePage(){


    //获取浏览器高度
    scanHeight = $(window).height();
    initTable();
}

//检验表单非空
function checkForm(obj){
    var info="";
    $.each(obj, function () {
        if((this.value==""||null==this.value)&&this.name!='unitId'){
            info="请将表单填写完整！！！"
            return false;
        }
    });
    if(info==""){
        return true;
    }
    BootstrapDialog.alert({
        title: '警告',
        message:info,
        size: BootstrapDialog.SIZE_SMALL,
        type: BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY

        closable: false, // <-- Default value is false
        draggable: true, // <-- Default value is false
        buttonLabel: '确定', // <-- Default value is 'OK',
    });
    return false;

}

//检验表格非空
function checkEquipTable(obj){
    var count=0;
    if(obj!=null){
        for(var key in obj){
            for(var item in obj[key]){
                if(item!='equipId'&&item!='state'){
                    if(obj[key][item]==''||obj[key][item]==null){
                        count++;
                        BootstrapDialog.alert({
                            title: '警告',
                            message:'请将设备信息表格内的数据填写完整！！！',
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
        }
        return true;
    }else if(count==0||obj.length==0){
        if(count==0){
            return true;
        }else{
            BootstrapDialog.alert({
                title: '警告',
                message:'请将设备信息表格内的数据填写完整！！！',
                size: BootstrapDialog.SIZE_SMALL,
                type: BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                closable: false, // <-- Default value is false
                draggable: true, // <-- Default value is false
                buttonLabel: '确定', // <-- Default value is 'OK',
            });
            return false;
        }
    }else{
        return true;
    }
}

//模版下载
function downloadModel() {
    window.location.href= "./../../Temp/工艺单元_设备信息导入模版.xlsx";
}

//文件的导入
function inputFile() {
    //导入框显示
    $('#importModal').modal('show');

    //bootstrap上传组件
    var oFileInput = new FileInput();
    //通过调用方法来进行文件导入
    oFileInput.Init("file", "/ProcessUnit/inputFile");

}

//初始化导入Div
function FileInput () {
    var oFile = new Object();

    //初始化fileinput控件（第一次初始化）
    oFile.Init = function(ctrlName, uploadUrl) {
        var control = $('#' + ctrlName);

        //初始化上传控件的样式
        control.fileinput({
            language: 'zh', //设置语言
            uploadUrl: uploadUrl, //上传的地址
            allowedFileExtensions: ['xls', 'xlsx'],//接收的文件后缀
            showUpload: true, //是否显示上传按钮
            showCaption: true,//是否显示被选文件的简介
            showPreview: false,//是否显示预览区域
            autoReplace: true,
            dropZoneEnabled: false,//是否显示拖拽区域
            showRemove: false,//显示移除按钮
            uploadLabel: '导入',
            browseClass: "btn btn-primary", //按钮样式
            maxFileCount: 1, //表示允许同时上传的最大文件个数
            enctype: 'multipart/form-data',
            validateInitialCount:true,
            previewFileIcon: "<i class='glyphicon glyphicon-level-up'></i>",
            fileActionSettings:{
                showRemove: true,
                showUpload: false,
                showZoom: false}
        });

        //导入文件上传完成之后的事件
        $("#file").on("fileuploaded", function (event, data, previewId, index) {
            $("#importModal").modal("hide");
            $("#processUnitTable").bootstrapTable("refresh", {})
            clearDiv();
            BootstrapDialog.alert({
                title: '提示',
                size:BootstrapDialog.SIZE_SMALL,
                message: data.response,
                type: BootstrapDialog.TYPE_SUCCESS , // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                closable: false, // <-- Default value is false
                draggable: true, // <-- Default value is false
                buttonLabel: '确定', // <-- Default value is 'OK',
            });
        });
    }
    return oFile;
};

//表单清空导入记录
function clearDiv() {
    $("#fileDiv").html("<input type=\"file\" name=\"file\" id=\"file\" class=\"file-loading\"/>");
}
