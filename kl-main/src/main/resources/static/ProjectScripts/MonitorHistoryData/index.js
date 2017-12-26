var companyCode = "";//企业编码
var resourceCode = "";//重大危险源编码
var unitCode = "";//工艺单元编码
var equipCode = "";//设备编码
var targetCode = "";//指标编码
var startdate = "";//开始时间
var enddate = "";//结束时间
var scanHeight="";
$(function () {
    //获取浏览器高度
    scanHeight = $(window).height();
    initTable();
    init();
});

//初始化表格
function initTable(){
    $("#dataTable").bootstrapTable("destroy");
    $('#dataTable').bootstrapTable({
        height: scanHeight,
        striped: true,      //是否显示行间隔色
        cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        method: 'get',//请求方式
        url: '/MHistoryData/getDataList',//请求url
        pagination: 'true',//显示分页条
        paginationLoop: 'true',//启用分页条无限循环功能
        pageNumber: 1,                       //初始化加载第一页，默认第一页
        pageSize: 10,                       //每页的记录行数（*）
        pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
        toolbar: '#dictToolbar',                //工具按钮用哪个容器
        clickToSelect: false,//是否启用点击选中行
        sidePagination: 'server',//'server'或'client'服务器端分页
       // showRefresh: 'false',//是否显示 刷新按钮
        queryParams: queryParams,
        queryParamsType: '', //默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort
        // 设置为 ''  在这种情况下传给服务器的参数为：pageSize,pageNumber
        sortStable: true,//设置为 true 将获得稳定的排序，我们会添加_position属性到 row 数据中。
        selectItemName: 'state',
        idField: 'dataId',
        rowStyle: function () {//自定义行样式
            return "bootTableRow";
        },
        onLoadError: function () {

        },
        onClickRow:function(row, $element){
            $("#dataTable").bootstrapTable("uncheckAll");
            $("#dataTable").bootstrapTable("checkBy",{field:'dataId',values:[row.dataId]})
        },
        columns: [
            {
                title: '序号',
                field: 'dataNum',
                halign: 'center',
                align: 'center',
                formatter: function (value, row, index) {
                    var page = $('#dataTable').bootstrapTable('getOptions');
                    return (page.pageNumber - 1) * page.pageSize + index + 1;
                }
            },
            {
                field: 'companyName',
                title: '企业名称',
                halign: 'center',
                align: 'left'
            },
            {
                field: 'dResourceName',
                title: '重大危险源名称',
                halign: 'center',
                align: 'left'
            },
            {
                field: 'unitName',
                title: '工艺单元',
                halign: 'center',
                align: 'center'
            },
            {
                field: 'equipName',
                title: '设备名称',
                halign: 'center',
                align: 'center'
            },
            {
                field: 'targetName',
                title: '指标名称',
                halign: 'center',
                align: 'center'
            },
            {
                field: 'realValue',
                title: '实时值',
                halign: 'center',
                align: 'center'
            },
            {
                field: 'targetUnit',
                title: '单位',
                halign: 'center',
                align: 'center'
            },
            {
                field: 'collectDate',
                title: '采集时间',
                halign: 'center',
                align: 'center'
            }
        ]
    });
}

//查询框的初始化
function init() {
    getCompanyList();
    getTargetList();
    loaddate();
}
//按名称查询
function searchData() {
    companyCode = $("#searchCompanyName").selectpicker('val');
    companyCode = companyCode==null?"":companyCode;
    resourceCode = $("#qResourceName").selectpicker('val');
    resourceCode = resourceCode==null?"":resourceCode;
    unitCode = $("#qUnitName").selectpicker('val');
    unitCode = unitCode==null?"":unitCode;
    equipCode = $("#qEquipName").selectpicker('val');
    equipCode = equipCode==null?"":equipCode;
    targetCode = $("#qTargetName").selectpicker('val');
    targetCode = targetCode==null?"":targetCode;
    startdate = $("#startdate").val();
    enddate = $("#enddate").val();
    $("#dataTable").bootstrapTable("refresh",{});
}

//清空查询条件
function clearParam() {
    $('#searchCompanyName').selectpicker('val','');
    $('#qResourceName').selectpicker('val','');
    $('#qUnitName').selectpicker('val','');
    $('#qEquipName').selectpicker('val','');
    $('#qTargetName').selectpicker('val','');
    $('#startdate').val("");
    $('#enddate').val("");
}

//表格返回参数方法
function queryParams(pageReqeust) {
    pageReqeust.companyCode = companyCode;
    pageReqeust.resourceCode = resourceCode;
    pageReqeust.unitCode=unitCode;
    pageReqeust.equipCode=equipCode;
    pageReqeust.targetCode=targetCode;
    pageReqeust.startdate=startdate;
    pageReqeust.enddate=enddate;
    return pageReqeust;
}

/**
 * 初始化日期组件
 */
function loaddate() {
    $('#startdateDiv').datetimepicker({
        language: 'zh-CN',//显示中文
        format: 'yyyy-mm-dd',//显示格式
        minView: "month",//设置只显示到月份
        initialDate: new Date(),
        autoclose: true,//选中自动关闭
        todayBtn: true//显示今日按钮
    });
    $('#enddateDiv').datetimepicker({
        language: 'zh-CN',//显示中文
        format: 'yyyy-mm-dd',//显示格式
        minView: "month",//设置只显示到月份
        initialDate: new Date(),
        autoclose: true,//选中自动关闭
        todayBtn: true//显示今日按钮
    });
}

//获取企业集合
function getCompanyList() {
    $.ajax({
        type: 'post',
        async: false,
        url: '/MHistoryData/getCompanyDict',
        success: function (result) {
            for(var key in result){
                var dict = result[key];
                $('#searchCompanyName').append("<option value='" + dict.UniqueCode + "'>" + dict.CompanyName + "</option>");
            }
            $('#searchCompanyName').selectpicker('refresh');
            $('#searchCompanyName').selectpicker('val','');
        },
        error: function () {
        }
    });
}

//企业下拉选择改变事件
function onchangeCompany(){
    getDresourceList();
}

//重大危险源选择改变事件
function onchangeResource() {
    getUnitList();
}

//工艺单元选择改变事件
function onchangeUnit(){
    getEquipList();
}

//获取重大危险源集合
function getDresourceList() {
   var companyCode = $("#searchCompanyName").selectpicker('val');
    companyCode = companyCode==null?"":companyCode;
    $.ajax({
        type: 'post',
        async: false,
        url: '/MHistoryData/getDresourceDict',
        data:{companyCode:companyCode},
        success: function (result) {
            $("#qResourceName").html('');
            for(var key in result){
                var dict = result[key];
                $('#qResourceName').append("<option value='" + dict.UniqueCode + "'>" + dict.SourceName + "</option>");
            }
            $("#qResourceName").selectpicker('refresh');
            $("#qResourceName").selectpicker('val','');
        },
        error: function () {
        }
    });
}

//获取工艺单元集合
function getUnitList() {
    var dresourceCode = $("#qResourceName").selectpicker('val');
    dresourceCode = dresourceCode==null?"":dresourceCode;
    $.ajax({
        type: 'post',
        async: false,
        url: '/MHistoryData/getUnitDict',
        data:{dresourceCode:dresourceCode},
        success: function (result) {
            $("#qUnitName").html('');
            for(var key in result){
                var dict = result[key];
                $('#qUnitName').append("<option value='" + dict.UniqueCode + "'>" + dict.UnitName + "</option>");
            }
            $("#qUnitName").selectpicker('refresh');
            $("#qUnitName").selectpicker('val','');
        },
        error: function () {
        }
    });
}

//获取设备集合
function getEquipList() {
    var unitCode = $("#qUnitName").selectpicker('val');
    unitCode = unitCode==null?"":unitCode;
    $.ajax({
        type: 'get',
        async: false,
        url: '/MHistoryData/getUnitDict',
        success: function (result) {
            $("#qEquipName").html('');
            for(var key in result){
                var dict = result[key];
                $('#qEquipName').append("<option value='" + dict.UniqueCode + "'>" + dict.EquipName + "</option>");
            }
            $("#qEquipName").selectpicker('refresh');
            $("#qEquipName").selectpicker('val','');
        },
        error: function () {
        }
    });
}

//获取指标集合
function getTargetList() {
    $.ajax({
        type: 'get',
        async: false,
        url: '/MHistoryData/getTargetDict',
        success: function (result) {
            for(var key in result){
                var dict = result[key];
                $('#qTargetName').append("<option value='" + dict.TargetCode + "'>" + dict.TargetName + "</option>");
            }
            $("#qTargetName").selectpicker('refresh');
            $("#qTargetName").selectpicker('val','');
        },
        error: function () {
        }
    });
}

//适应页面大小
function resizePage(){
    //获取浏览器高度
    scanHeight = $(window).height();
    initTable();
}