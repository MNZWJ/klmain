//存放查询的企业名称
var searchCompanyName;
//存放查询的化学品工艺单元
var searchRisk;
$(function () {
    //获取浏览器高度
    var scanHeight = $(window).height();
    init();
    //加载列表
    $('#processTable').bootstrapTable({
        height: scanHeight - 6,
        url: '/DangerousProcessCheck/getProcess',
        method: 'get',                      //请求方式（*）
        toolbar: '#processToolbar',                //工具按钮用哪个容器
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
        showRefresh: true,//是否显示 刷新按钮
        sortStable: true,//设置为 true 将获得稳定的排序，我们会添加_position属性到 row 数据中。
        selectItemName: 'state',
        idField: 'companyId',
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
            width: '5%',
            formatter: function (value, row, index) {
                var page = $('#processTable').bootstrapTable('getOptions');
                return (page.pageNumber - 1) * page.pageSize + index + 1;
            }
        }, {
            field: 'state',
            checkbox: true
        },
            {
            field: 'companyName',
            title: '企业名称',
            halign: 'center',
            class: "bootTableRow",
            formatter: function (value, row, index) {
                value = value==undefined?"-":value;
                return '<span title="'+value+'">'+value+'</span>'
            }
        },{
            field: 'technologyName',
            title: '危险工艺名称',
            halign: 'center'
        }, {
            field: 'monitorUnit',
            title: '重点监控单元',
            halign: 'center',
            class: "bootTableRow",
            formatter: function (value, row, index) {
                value = value==undefined?"-":value;
                return '<span title="'+value+'">'+value+'</span>'
            }
        },   {
                field: 'companyType',
                title: '企业性质',
                halign: 'center'
            } ,{
                field: 'area',
                title: '行政区域',
                halign: 'center'
            },
        ]
    });
});
//预加载数据
function init() {
    RiskProcess();
    getCompanyList();
}
//获取危险化学品工艺
function RiskProcess() {
    $.ajax({
        type: 'get',
        async: false,
        url: '/SysDictionary/getDataDictList?typeId=' + RiskProcessDictId,
        success: function (result) {
            var companyList = eval(result);
            $.each(companyList, function (i) {
                $('#searchRisk').append("<option value='" + companyList[i].dictId + "'>" + companyList[i].dictName + "</option>");
            });
            $('#searchRisk').selectpicker('val','')
            $('#searchRisk  .selectpicker').selectpicker('refresh',{});
        },
        error: function () {
        }
    });
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
            });
            $('#searchCompanyName').selectpicker('val','');
            $('#searchCompanyName .selectpicker').selectpicker('refresh',{});
        },
        error: function () {
        }
    });
}
//查询
function searchMenus() {
    searchCompanyName = $("#searchCompanyName").selectpicker('val');
    searchRisk = $("#searchRisk").selectpicker('val');
    $("#processTable").bootstrapTable("refresh",{});
}
//清空查询条件
function clearRole() {
    $('#searchRisk').selectpicker('val','');
    $('#searchCompanyName').selectpicker('val','');
}
//表格返回参数方法
function queryParams(pageReqeust) {
    pageReqeust.companyName = searchCompanyName;
    pageReqeust.risk = searchRisk;
    return pageReqeust;
}
//导出Excel
function exportExcel(){
    searchCompanyName = searchCompanyName==null?"":searchCompanyName;
    searchRisk = searchRisk==null?"":searchRisk;
    var url = "/DangerousProcessCheck/exportExcel?companyName="+searchCompanyName
        +"&risk="+searchRisk;
    window.top.location.href=url;
}