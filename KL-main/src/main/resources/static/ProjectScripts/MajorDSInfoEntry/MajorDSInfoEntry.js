//存放查询的危险源等级
var searchRank="";
//存放查询的企业名称
var searchCompanyName="";
//存放模糊查找的条件危险源名称
var searchSourceNmae = "";
//存放查询的企业名称
var companyId="";
//存放查询的企业规模
var searchScaleCode="";
//存放的企业类型
var searchTypeCode="";
//存放的企业行业
var searchIndustryCode="";
//存放企业
var users = [];
//存放所选企业主键
var company="";
//存放所选危险源的主键
var sourceId = "";
//是否只读的标识
var state=false;
//是否初始化的标志位
var flag=true;
//点击事件标志位
var eventFlag="";
//查询的化学品名称
var chemName = "";
//查询的cas
var cas = "";
//存放新增中选择的企业信息
var companyChemical ="";
//获取浏览器高度
var scanHeight = $(window).height();
//初始化列表
$(function () {
    initCert();//初始化相关证书表格
    initTable();//初始化危险工艺表格
    initChemiacalAllTable();//初始化化学品全部信息列表
    initChemicalTable();//初始话所引用化学品信息列表
    init();
    //加载列表
    $('#MajorTable').bootstrapTable({
        height: scanHeight - 6,
        url: '/MajorDangerSourceInfo/getMajor',
        method: 'get',                      //请求方式（*）
        toolbar: '#sysorgToolbar',                //工具按钮用哪个容器
        striped: true,                      //是否显示行间隔色
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,                   //是否显示分页（*）
        sortable: false,                     //是否启用排序
        sortOrder: "asc",                   //排序方式
        queryParams: queryParams,//传递参数（*）
        queryParamsType: '', //默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort
        // 设置为 ''  在这种情况下传给服务器的参数为：pageSize,pageNumber
        sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
        clickToSelect: true,//是否启用点击选中行
        pageNumber: 1,                       //初始化加载第一页，默认第一页
        pageSize: 10,                       //每页的记录行数（*）
        pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
        showRefresh: false,//是否显示 刷新按钮
        sortStable: true,//设置为 true 将获得稳定的排序，我们会添加_position属性到 row 数据中。
        selectItemName: 'state',
        idField: 'sourceId',
        uniqueId:'sourceId',
        rowStyle: function () {//自定义行样式
            return "bootTableRow";
        },
        onLoadError: function () {
        },
        columns: [{
            title: '序号',
            field: 'number1',
            halign: 'center',
            align: 'center',
            width: '2%',
            valign:'middle',
            formatter: function (value, row, index) {
                var page = $('#MajorTable').bootstrapTable('getOptions');
                return (page.pageNumber - 1) * page.pageSize + index + 1;
            }
        }, {
            field: 'state',
            checkbox: true,
            valign:'middle',
            width:'2%',
        }, {
            field: 'sourceName',
            title: '危险源名称',
            halign: 'center',
            width:'10%',
            valign:'middle',
            cellStyle: function (value, row, index, field) {
                return {classes: '', css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis','overflow': 'hidden'}};
            },
            formatter: function (value, rowData, rowIndex) {
                users.push(rowData);
                return "<a href='javascript:look(\""+rowData.sourceId+"\")'>" + value + "</a>";
            },
        }, {
            field: 'companyId',
            title: '企业名称',
            halign: 'center',
            width:'10%',
            valign:'middle',
            cellStyle: function (value, row, index, field) {
                return {classes: '', css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis','overflow': 'hidden'}};
            },
            formatter: function (value, row, index) {
                return '<span title="'+value+'">'+value+'</span>'
            }
        },
            {
            field: 'rValue',
            title: 'R值',
            halign: 'center',
            align: 'right',
            width:'2%',
                valign:'middle',
        }, {
            field: 'rank',
            title: '危险源等级',
            halign: 'center',
            align: 'center',
            width:'4%',
                valign:'middle',
        },
            {
                field: 'validity',
                title: '有效期',
                halign: 'center',
                align: 'center',
                width:'4%',
                valign:'middle',
            },
            {
                field: 'accidentType',
                title: '可能引发<br/>事故类型',
                halign: 'center',
                width:'5%',
                align: 'center',
                valign:'middle'
                  // cellStyle: function (value, row, index, field) {
                  //     return {classes: '', css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis','overflow': 'hidden'}};
                  // },
                  // formatter: function (value, row, index) {
                  //   if(value!=undefined){
                  //       return '<span title="'+value+'">'+value+'</span>'
                  //   }else{
                  //       return "";
                  //   }
                  // }
            },
            {
                field: 'deathToll',
                title: '可能引发事故<br/>死亡人数',
                halign: 'center',
                align: 'right',
                valign:'middle',
                width:'4%',

            },
            {
                field: 'recordDate',
                title: '登记日期',
                halign: 'center',
                align: 'center',
                width:'4%',
                valign:'middle',
            }
        ]
    });
});
//文本框数据加载
function init() {
    getCompanyList();
    MajorAangerous();
    getacccidentTyptList();
    getaSourceStatusList();
    saveData();
    formValidator();
    $(".searchRank").selectpicker({noneSelectedText:'请选择'});
    $(".searchSourceNmae").selectpicker({noneSelectedText:'请选择'});
    //模态窗关闭事件
    $('#myModal').on('hidden.bs.modal', function () {
        $('#myTab a[href="#companyInfo"]').tab('show');
        //清空表单
        $(':input', '#companyForm')
            .not(':button, :submit, :reset')
            .val('')
            .removeAttr('checked')
            .removeAttr('selected');
        $("#companyForm").data('bootstrapValidator').destroy();
        $('#companyForm').data('bootstrapValidator', null);
        formValidator();

        if($('#uniqueCode').attr("readonly")!=undefined){
            $('#uniqueCode').removeAttr("readonly");
        }
    });
}
//获取重大危险源等级
function MajorAangerous() {
    $.ajax({
        type: 'get',
        async: false,
        url: '/SysDictionary/getDataDictList?typeId=' + MajorHazardRank,
        success: function (result) {
            var companyList = eval(result);
            $.each(companyList, function (i) {
                $('#searchRank').append("<option value='" + companyList[i].dictId + "'>" + companyList[i].dictName + "</option>");
                $('#rank').append("<option value='" + companyList[i].dictId + "'>" + companyList[i].dictName + "</option>");
            });
            $('#searchRank').selectpicker('val', '');
            $('#rank').selectpicker('val', '');
            $('#searchRank  .selectpicker').selectpicker('refresh',{});
            $('#rank  .selectpicker').selectpicker('refresh',{});
        },
        error: function () {
        }
    });
}
//查询
function searchMenus() {
    searchCompanyName = $("#searchCompanyName").selectpicker('val');
    searchSourceNmae = $("#searchSourceNmae").val();
    searchRank = $("#searchRank").selectpicker('val');
    $("#MajorTable").bootstrapTable("refresh",{});
}
//表格返回参数方法
function queryParams(pageReqeust) {
    pageReqeust.companyName = searchCompanyName;
    pageReqeust.sourceNmae = searchSourceNmae;
    pageReqeust.rank=searchRank;
    return pageReqeust;
}
//清空查询条件
function clearRole() {
    $('#searchRank').selectpicker('val','');
    $('#searchSourceNmae').val("");
    $('#searchCompanyName').selectpicker('val','');
}
//获取企业集合
function getCompanyList() {
    $.ajax({
        type: 'get',
        async: false,
        url: '/Inspection/getCompanyList',
        success: function (result) {
            var companyList = eval(result);
            $.each(companyList, function (i) {
                $('#searchCompanyName').append("<option value='" + companyList[i].companyId + "'>" + companyList[i].companyName + "</option>");
                $('#companyId').append("<option value='" + companyList[i].companyId + "'>" + companyList[i].companyName + "</option>");
            });
            $('#searchCompanyName').selectpicker('val','');
            $('#companyId').selectpicker('val','');
            $('#searchCompanyName .selectpicker').selectpicker('refresh',{});
            $('#companyId .selectpicker').selectpicker('refresh',{});
        },
        error: function () {
        }
    });
}
//获取事故类型集合
function getacccidentTyptList() {
    $.ajax({
        type: 'get',
        async: false,
        url: '/SysDictionary/getDataDictList?typeId=' + acccidentTyptDictId,
        success: function (result) {
            var companyList = eval(result);
            $.each(companyList, function (i) {
                $('#accidentType').append("<option value='" + companyList[i].dictId + "'>" + companyList[i].dictName + "</option>");
            });
            $('#accidentType').selectpicker('val','');
            $('#accidentType .selectpicker').selectpicker('refresh',{});
        },
        error: function () {
        }
    });
}
//获取危险源状态集合
function getaSourceStatusList() {
    $.ajax({
        type: 'get',
        async: false,
        url: '/SysDictionary/getDataDictList?typeId=' + sourceStatusDictId,
        success: function (result) {
            var companyList = eval(result);
            $.each(companyList, function (i) {
                $('#status').append("<option value='" + companyList[i].dictId + "'>" + companyList[i].dictName + "</option>");
            });
            $('#status').selectpicker('val','');
            $('#status .selectpicker').selectpicker('refresh',{});
        },
        error: function () {
        }
    });
}
//企业点击事件弹出查看窗
function look(sourceId) {
    eventFlag="look";
    var row=$("#MajorTable").bootstrapTable("getRowByUniqueId",sourceId);
    company=row.sourceId;
    $('#companyId').selectpicker('val', '');
    $('#accidentType').selectpicker('val', '');
    $('#status').selectpicker('val', '');
    $('#rank').selectpicker('val', '');
    //刷新表格
    $("#equipTable").bootstrapTable('refresh');
    $("#legalTable").bootstrapTable('refresh');
    $("#chemicalTable").bootstrapTable('refresh');
    //input赋值
    $.ajax({
        type: 'post',
        url: '/MajorDSInfoEntry/getSourceInfo',
        data: {sourceId: company},
        success: function (result) {
            debugger;
            //清空表单
            $(':input', '#companyForm')
                .not(':button, :submit, :reset')
                .val('')
                .removeAttr('checked')
                .removeAttr('selected');
            for (var p in result[0]) {
                $("#companyForm").find(":input[name='" + p + "']").val(result[0][p]);
            }
            //下拉框赋值
            $('#companyId').selectpicker('val', result[0].companyId);
            if(result[0].accidentType!=null) {
                $('#accidentType').selectpicker('val', result[0].accidentType.split(','));//多选时
            }
            $('#rank').selectpicker('val', result[0].rank);
            $('#status').selectpicker('val', result[0].status);
        },
        error: function () {
        }
    });
    $("#myModelLabel").text("查看");
    $('#myModal').modal('show');
    $('#collapseOne').collapse('show');
    $('#collapseTwo').collapse('hide');
    $('#collapseThree').collapse('hide');
    $('#collapseFour').collapse('hide');
    $("#companyForm").find('input').attr({ readonly: 'true' });
    $("#companyForm").find('select').attr("disabled", "disabled");
    $("#btn_save").hide();
    $("#addData").hide();
    $("#delData").hide();
    $("#certAdd").hide();
    $("#certDel").hide();
    $("#select").hide();
    $("#delChemical").hide();
    state=true;
}
//新增
function companyAdd() {
    eventFlag="add";
    //清空表单
    $(':input', '#companyForm')
        .not(':button, :submit, :reset')
        .val('')
        .removeAttr('checked')
        .removeAttr('selected');
    $('#companyId').selectpicker('val', '');
    $('#accidentType').selectpicker('val', '');
    $('#rank').selectpicker('val', '');
    $('#status').selectpicker('val', '');
    $("#companyForm").data('bootstrapValidator').resetForm(false);
    $("#btn_save").show();
    $("#addData").show();
    $("#delData").show();
    $("#certAdd").show();
    $("#certDel").show();
    $("#select").show();
    $("#delChemical").show();
    if(state){
        $("#companyForm").find('input').removeAttr('readonly');
        $("#companyForm").find('select').removeAttr("disabled", "disabled");
        $('#uniqueCode').removeAttr("readonly");
        state = false;
    }
    //清空表格
    $("#equipTable").bootstrapTable('load', []);
    $("#legalTable").bootstrapTable('load', []);
    $("#chemicalTable").bootstrapTable('load', []);
    $("#myModelLabel").text("新增");
    $('#myModal').modal('show');
    $('#collapseOne').collapse('show');
    $('#collapseTwo').collapse('hide');
    $('#collapseThree').collapse('hide');
    $('#collapseFour').collapse('hide');
    $("#companyForm").data('bootstrapValidator').addField("uniqueCode");//添加编码验证
}
//修改
function companyEdit() {
    eventFlag="edit";
    //清空表单
    $(':input', '#companyForm')
        .not(':button, :submit, :reset')
        .val('')
        .removeAttr('checked')
        .removeAttr('selected');
    $('#companyId').selectpicker('val', '');
    $('#accidentType').selectpicker('val', '');
    $('#rank').selectpicker('val', '');
    $('#status').selectpicker('val', '');
    var row = $("#MajorTable").bootstrapTable("getSelections");//获取所有选中的行
    if (row.length !==1) {
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
    $("#companyForm").data('bootstrapValidator').resetForm(false);
    if(state){
        $("#companyForm").find('input').removeAttr('readonly');
        $("#companyForm").find('select').removeAttr("disabled", "disabled");
        state = false;
    }
    $("#btn_save").show();
    $("#addData").show();
    $("#delData").show();
    $("#certAdd").show();
    $("#certDel").show();
    $("#select").show();
    $("#delChemical").show();
    company=row[0].sourceId;
    //刷新表格
    $("#equipTable").bootstrapTable("refresh");
    $("#legalTable").bootstrapTable("refresh");
    $("#chemicalTable").bootstrapTable("refresh");
    $.ajax({
        type: 'post',
        url: '/MajorDSInfoEntry/getSourceInfo',
        data: {sourceId: company},
        success: function (result) {
            debugger;
            //清空表单
            $(':input', '#companyForm')
                .not(':button, :submit, :reset')
                .val('')
                .removeAttr('checked')
                .removeAttr('selected');
            for (var p in result[0]) {
                $("#companyForm").find(":input[name='" + p + "']").val(result[0][p]);
            }
            //下拉框赋值
            $('#companyId').selectpicker('val', result[0].companyId);
            if(result[0].accidentType!=null) {
                $('#accidentType').selectpicker('val', result[0].accidentType.split(','));//多选时
            }
            $('#rank').selectpicker('val', result[0].rank);
            $('#status').selectpicker('val', result[0].status);
        },
        error: function () {
        }
    });
    $('#uniqueCode').attr("readonly","readonly");
    $("#myModelLabel").text("修改");
    $('#myModal').modal('show');
    $('#collapseOne').collapse('show');
    $('#collapseTwo').collapse('hide');
    $('#collapseThree').collapse('hide');
    $('#collapseFour').collapse('hide');
    $("#companyForm").data('bootstrapValidator').removeField("uniqueCode");//删除编码验证
}
//初始化装置设施表格
function initTable(x) {
    $("#equipTable").bootstrapTable({
        method: 'get',//请求方式
        clickToSelect: true,//是否启用点击选中行
        showRefresh: false,//是否显示 刷新按钮
        url: '/MajorDSInfoEntry/getSourceEquipList',
        striped: true,                      //是否显示行间隔色
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        queryParams: function (pageReqeust) {
            pageReqeust.sourceId = company;
            return pageReqeust;
        },
        rowStyle: function () {//自定义行样式
            return "bootTableRow";
        },
        editable:true,//开启编辑模式
        pagination: true,
        idField:'facilities',
        uniqueId: 'facilities', //将companyId列设为唯一索引
        minimumCountColumns: 2,
        smartDisplay:true,
        onLoadError: function () {
        },
        onLoadSuccess:function(){
            //当查看时控制可编辑表格不可编辑
            if(eventFlag=="look"){
                $("#equipTable").find(".editable").editable('disable');
            }
        },
        columns: [
            {
                title: '序号',
                field: 'number1',
                halign: 'center',
                align: 'center',
                formatter: function (value, row, index) {
                    var page = $('#equipTable').bootstrapTable('getOptions');
                    return (page.pageNumber - 1) * page.pageSize + index + 1;
                }
            },
            {
                field: 'state',
                checkbox: true
            },
            {
                field: 'facilities',
                title: '装置设施名称',
                halign: 'center',
                align:'center',
                editable:{
                    type: 'text',
                    title: '装置设施名称',
                    emptytext: '请输入',
                },
            },{
                field: 'environment',
                title: '周边环境名称',
                halign: 'center',
                editable:{
                    type: 'text',
                    title: '周边环境名称',
                    emptytext: '请输入',
                }
            },{
                field: 'realDistance',
                title: '实际距离（米）',
                halign: 'center',
                editable:{
                    type: 'text',
                    title: '实际距离（米）',
                    emptytext: '请输入',
                }
            },{
                field: 'standardDistance',
                title: '标准要求',
                halign: 'center',
                editable:{
                    type: 'text',
                    title: '标准要求',
                    emptytext: '请输入',
                }
            },{
                field: 'conformance',
                title: '与标准符合性',
                halign: 'center',
                editable:{
                    type: 'select',
                    title: '与标准符合性',
                    emptytext: '请选择',
                    source: function () {
                        var result = [{value:'符合',text:'符合'},{value:'不符合',text:'不符合'}];
                        return result;
                    }
                }
            }
        ]
    });
    //新增
    $('#addData').click(function(){
        $('#equipTable').bootstrapTable('selectPage', 1);
        var data = {facilities: '',environment:'',realDistance:'',realDistance:'',standardDistance:'',conformance:''};
        $('#equipTable').bootstrapTable('prepend', data);
    });
    //删除
    $('#delData').click(function(){
        var row = $("#equipTable").bootstrapTable("getSelections");//获取所有选中的行
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
                $("#equipTable").bootstrapTable('removeByUniqueId', row[i].facilities);
            }
        }
    });
}
//初始化法律保护区表格
function initCert(x) {
    $("#legalTable").bootstrapTable({
        method: 'get',
        editable:true,//开启编辑模式
        url: '/MajorDSInfoEntry/getSourceLegalList',
        cache: false,
        pagination: true,
        clickToSelect: true,//是否启用点击选中行
        idField:'protectArea',
        uniqueId: 'protectArea', //将companyId列设为唯一索引
        striped: true,
        minimumCountColumns: 2,
        smartDisplay:true,
        queryParams: function (pageReqeust) {
            pageReqeust.sourceId = company;
            return pageReqeust;
        },
        rowStyle: function () {//自定义行样式
            return "bootTableRow";
        },
        onLoadError: function () {
        },
        onLoadSuccess:function(){
            //当查看时控制可编辑表格不可编辑
            if(eventFlag=="look"){
                $("#legalTable").find(".editable").editable('disable');
            }
        },
        columns: [
            {
                title: '序号',
                field: 'number1',
                halign: 'center',
                align: 'center',
                formatter: function (value, row, index) {
                    var page = $('#legalTable').bootstrapTable('getOptions');
                    return (page.pageNumber - 1) * page.pageSize + index + 1;
                }
            },
            {
                field: 'state',
                checkbox: true
            },
            {
                field: 'protectArea',
                title: '保护区',
                halign: 'center',
                align:'center',
                editable:{
                    type: 'text',
                    title: '保护区',
                    emptytext: '请输入',
                },
            },{
                field: 'environment',
                title: '周边环境说明',
                halign: 'center',
                editable:{
                    type: 'text',
                    title: '周边环境说明',
                    emptytext: '请输入',
                }
            },{
                field: 'conformance',
                title: '与规定符合性',
                halign: 'center',
                editable:{
                    type: 'select',
                    title: '与规定符合性',
                    emptytext: '请选择',
                     source: function () {
                       var result = [{value:'符合',text:'符合'},{value:'不符合',text:'不符合'}];
                       return result;
                   }
                }
            }
        ]
    });
    //新增
    $('#certAdd').click(function(){
        $('#legalTable').bootstrapTable('selectPage', 1);
        var data = {protectArea:'',environment:'',conformance:''};
        $('#legalTable').bootstrapTable('prepend', data);
    });
    //删除
    $('#certDel').click(function(){
        var row = $("#legalTable").bootstrapTable("getSelections");//获取所有选中的行
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
                $("#legalTable").bootstrapTable('removeByUniqueId', row[i].protectArea);
            }
        }
    });
}
//保存
function saveData() {
    $('#btn_save').click(function () {
        //获取表单对象
        var bootstrapValidator = $("#companyForm").data('bootstrapValidator');
        //获取BS中的List值
        var processTable = $('#equipTable').bootstrapTable('getData');
        var certTable = $('#legalTable').bootstrapTable('getData');
        var chemicalTable = $('#chemicalTable').bootstrapTable('getData');
        //手动触发验证
        bootstrapValidator.validate();
        if (bootstrapValidator.isValid()) {
            //获取表单中的值
            var form = {};
            var menuList = $('#companyForm').serializeArray();
            var accidentType="";
            for(var i=0;i<menuList.length;i++){
                if(menuList[i].name=='accidentType'){
                    accidentType+=','+menuList[i].value;
                }}
            $.each(menuList, function () {
                form[this.name] = this.value;
            });
            form.accidentType=accidentType.substring(1);
            var cmd = {"form": form, "processTable": processTable, "certTable": certTable,"chemicalTable":chemicalTable};
            $.ajax({
                type: 'post',
                url: '/MajorDSInfoEntry/saveData',
                data: {cmd:JSON.stringify(cmd)},
                success: function (result) {
                    if (result.code == 0) {
                        BootstrapDialog.alert({
                            title: "提示",
                            size: BootstrapDialog.SIZE_SMALL,
                            message: "保存成功！",
                            type: BootstrapDialog.TYPE_SUCCESS, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                            callback: function () {
                                $('#myModal').modal('hide');
                                $("#MajorTable").bootstrapTable("refresh");
                            }
                        });
                    }
                },
                error: function () {
                }
            });
        }
    });
}
//删除
function companyDel() {
    var rows = $("#MajorTable").bootstrapTable("getSelections");//获取所有选中的行
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
        message: "确定要删除选中的危险源信息吗？",
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
                    ids += n.sourceId + ",";
                });
                ids = ids.substring(0, ids.length - 1);
                $.ajax({
                    type: 'post',
                    url: '/MajorDSInfoEntry/delSourceInfo',
                    data: {sourceId: ids},
                    success: function (result) {
                        if (result.code == "00") {
                            BootstrapDialog.alert({
                                title: "提示",
                                size: BootstrapDialog.SIZE_SMALL,
                                message: "删除成功！",
                                type: BootstrapDialog.TYPE_SUCCESS, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                                callback: function () {
                                    $('#myModal').modal('hide');
                                    $("#MajorTable").bootstrapTable("refresh");
                                }
                            });
                        }
                    },
                    error: function () {
                    }
                });
            }
        }
    });
}
//form验证规则
function formValidator() {
//表单验证
    $("#companyForm").bootstrapValidator({
        fields: {
            //多个重复
            sourceName: {
                enabled: true,
                message: '输入有误',
                validators: {
                    //多个重复
                    //官方默认验证参照  http://bv.doc.javake.cn/validators/
                    // 注：使用默认前提是引入了bootstrapValidator-all.js
                    // 若引入bootstrapValidator.js没有提供常用验证规则，需自定义验证规则哦
                    notEmpty: {
                        message: '企业名称不能为空'
                    },
                    stringLength: {
                        min: 0,
                        max: 50,
                        message: '企业名称过长'
                    },
                    regexp: {
                        regexp: /[^\]@=/'\"$%&^*{}<>\\\\[:\;]+/,
                        message: '输入值中含有非法字符'
                    }
                }
            },
            companyId: {
             validators: {
                 notEmpty: {
                     message: '请选择所属企业'
                 }
             }
         },
            uniqueCode: {
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
                    regexp: {
                        regexp: /[^\]@=/'\"$%&^*{}<>\\\\[:\;]+/,
                        message: '输入值中含有非法字符'
                    },
                    remote:{
                        url:'/BasicInfoEntry/validateTypeCode',
                        message: '唯一编码已存在',
                        type: 'POST'
                    }
                }
            },
        }
    });
}
//初始化模态窗中全部化学品数据
function initChemiacalAllTable() {
    $('#chemicalAllTable').bootstrapTable({
        url: '/MajorDSInfoEntry/getChemicalInfoByCompany',
        method: 'get',                      //请求方式（*）
        striped: true,                      //是否显示行间隔色
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,                   //是否显示分页（*）
        sortable: false,                     //是否启用排序
        sortOrder: "asc",                   //排序方式
        sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
        clickToSelect: true,//是否启用点击选中行
        pageNumber: 1,                       //初始化加载第一页，默认第一页
        pageSize: 20,                       //每页的记录行数（*）
        pageList: [20, 50, 100, 200],        //可供选择的每页的行数（*）
        sortStable: true,//设置为 true 将获得稳定的排序，我们会添加_position属性到 row 数据中。
        queryParamsType: '', //默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort
        // 设置为 ''  在这种情况下传给服务器的参数为：pageSize,pageNumber
        selectItemName: 'state',
        idField: 'chemId',
        uniqueId: 'chemId',
        queryParams: function (pageReqeust) {
            pageReqeust.chemName = chemName;
            pageReqeust.cas = cas;
            pageReqeust.companyId = companyChemical;
            return pageReqeust;
        },
        rowStyle: function () {//自定义行样式
            return "bootTableRow";
        },
        onLoadSuccess:function () {
            var chemicalRows = $('#chemicalTable').bootstrapTable('getData');//获取当前数据
            if(chemicalRows.length>0) {
                for(var  i=0;i<chemicalRows.length;i++) {
                    $('#chemicalAllTable').bootstrapTable('hideRow', {uniqueId:chemicalRows[i].chemId});
                }
            }
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
                    var page = $('#chemicalAllTable').bootstrapTable('getOptions');
                    return (page.pageNumber - 1) * page.pageSize + index + 1;
                }
            }, {
                field: 'state',
                checkbox: true
            },
            {
                field: 'chemName',
                title: '化学品名称',
                halign: 'center',
                width:'23%',
            }, {
                field: 'cAS',
                title: 'CAS',
                halign: 'center',
                align: 'center',
                width:'23%',
            }, {
                field: 'alisaName',
                title: '别名',
                halign: 'center',
                align: 'center',
                width:'23%',
            }, {
                field: 'dangerType',
                title: '化学品危险类别',
                halign: 'center',
                align: 'center',
                width:'26%',
            }]
    })
    //保存所选的化学品信息
    $('#saveChemical').click(function () {
        var rows=$('#chemicalAllTable').bootstrapTable('getSelections');//获取选中行
        if(rows.length>0) {
            for(var  i=0;i<rows.length;i++) {
                $('#chemicalTable').bootstrapTable('selectPage', 1);
                var data = {chemId:rows[i].chemId,chemName:rows[i].chemName,cAS:rows[i].cAS, dreserves: '', unit: ''};
                $('#chemicalTable').bootstrapTable('prepend', data);
            }
        }else {
            BootstrapDialog.alert({
                title: '警告',
                message: '请至少选择一条要保存的数据！',
                size: BootstrapDialog.SIZE_SMALL,
                type: BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                closable: false, // <-- Default value is false
                draggable: true, // <-- Default value is false
                buttonLabel: '确定', // <-- Default value is 'OK',
            });
            return false;
        }
        $('#chemicalMadel').modal('hide');
    });
}
//加载模态窗中选中的化学品数据
function initChemicalTable() {
    $('#chemicalTable').bootstrapTable({
        method: 'get',
        editable:true,//开启编辑模式
        url: '/MajorDSInfoEntry/getChemicalList',
        cache: false,
        pagination: true,
        clickToSelect: true,//是否启用点击选中行
        striped: true,
        minimumCountColumns: 2,
        smartDisplay:true,
        idField: 'chemId',
        uniqueId: 'chemId',
        queryParams: function (pageReqeust) {
            pageReqeust.sourceId = company;
            return pageReqeust;
        },
        rowStyle: function () {//自定义行样式
            return "bootTableRow";
        },
        onLoadError: function () {
        },
        onLoadSuccess:function(){
            //当查看时控制可编辑表格不可编辑
            if(eventFlag=="look"){
                $("#chemicalTable").find(".editable").editable('disable');
            }
        },
        columns: [
            {
                title: '序号',
                field: 'number1',
                halign: 'center',
                align: 'center',
                formatter: function (value, row, index) {
                    var page = $('#chemicalTable').bootstrapTable('getOptions');
                    return (page.pageNumber - 1) * page.pageSize + index + 1;
                }
            },
            {
                field: 'state',
                checkbox: true
            },{
                field: 'chemId',
                title: '化学品ID',
                halign: 'center',
                align:'center',
                visible:false,
            },
            {
                field: 'chemName',
                title: '化学品名称',
                halign: 'center',
                align:'center',
            },{
                field: 'cAS',
                title: 'CAS',
                halign: 'center',
            },{
                field: 'dreserves',
                title: '设计储量',
                halign: 'center',
                editable:{
                    type: 'text',
                    title: '设计储量',
                    emptytext: '请输入',
                }
            },{
                field: 'unit',
                title: '单位',
                halign: 'center',
                editable:{
                    type: 'text',
                    title: '单位',
                    emptytext: '请输入',
                }
            }]
    })
//点击引用按钮弹出模态窗选择化学品信息
    $('#select').click(function () {
        debugger;
        var form = {};
        var menuList = $('#companyForm').serializeArray();
        $.each(menuList, function () {
            form[this.name] = this.value;
        });
        if(form.companyId != null) {
            companyChemical = form.companyId;
            $('#chemicalMadel').modal('show');
            $("#chemicalAllTable").bootstrapTable('refresh');
        }else {
            alert("请先选择企业")
        }

    });
//删除所选化学品
    $('#delChemical').click(function(){
        var row = $("#chemicalTable").bootstrapTable("getSelections");//获取所有选中的行
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
                $("#chemicalTable").bootstrapTable('removeByUniqueId', row[i].chemId);
            }
        }
    });
}
//化学品查询
function searchchem() {
    chemName = $("#chemName").val();
    cas = $("#cas").val();
    $("#chemicalAllTable").bootstrapTable("refresh",{});
}
//化学品清空查询条件
function cleanchem() {
    chemName = $("#chemName").val("");
    cas = $("#cas").val("");
}


//模版下载
function downloadModel() {
    window.location.href= "./../../Temp/重大危险源信息导入模版.xlsx";
}

//文件的导入
function inputFile() {
    //导入框显示
    $('#importModal').modal('show');

    //bootstrap上传组件
    var oFileInput = new FileInput();
    //通过调用方法来进行文件导入
    oFileInput.Init("file", "/MajorDSInfoEntry/inputFile");

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
            showRemove: true,//显示移除按钮
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
