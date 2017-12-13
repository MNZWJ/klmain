//存放查询的危险源等级
var searchRank="";
//存放查询的企业名称
var searchCompanyName="";
//存放模糊查找的条件危险源名称
var searchSourceNmae = "";
$(function () {
    //获取浏览器高度
    var scanHeight = $(window).height();
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
        showRefresh: true,//是否显示 刷新按钮
        showExport: true,                     //是否显示导出
        exportDataType: "basic",              //basic', 'all', 'selected'.
        sortStable: true,//设置为 true 将获得稳定的排序，我们会添加_position属性到 row 数据中。
        selectItemName: 'state',
        idField: 'sourceId',
        rowStyle: function () {//自定义行样式
            return "MajorTableRow";
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
        },
        columns: [{
            title: '序号',
            field: 'number1',
            halign: 'center',
            align: 'center',
            formatter: function (value, row, index) {
                var page = $('#MajorTable').bootstrapTable('getOptions');
                return (page.pageNumber - 1) * page.pageSize + index + 1;
            }
        }, {
            field: 'state',
            checkbox: true
        }, {
            field: 'companyId',
            title: '企业名称',
            halign: 'center'
        },{
                field: 'sourceName',
                title: '危险源名称',
                halign: 'center'
            }, {
                field: 'rValue',
                title: 'R值',
                halign: 'center',
                align: 'center'
            }, {
                field: 'rank',
                title: '危险源等级',
                halign: 'center',
                align: 'center'
            },
            {
                field: 'recordNo',
                title: '备案编号',
                halign: 'center',
                align: 'center'
            },
            {
                field: 'validity',
                title: '有效期',
                halign: 'center',
                align: 'center'
            },
            {
                field: 'status',
                title: '状态',
                halign: 'center',
                align: 'center'
            },
            {
                field: 'accidentType',
                title: '可能引发的事故类型',
                halign: 'center'
            },
            {
                field: 'deathToll',
                title: '可能引发事故死亡人数',
                halign: 'center',
                align: 'right'
            },
            {
                field: 'recordDate',
                title: '登记日期',
                halign: 'center',
                align: 'center'
            },
            {
                field: 'outPersonCount',
                title: '厂区边界外500米范围内人数估值',
                halign: 'center',
                align: 'right'
            }
        ]
    });
});
//文本框数据加载
function init() {
    getCompanyList();
    MajorAangerous();
    $(".searchRank").selectpicker({noneSelectedText:'请选择'});
    $(".searchSourceNmae").selectpicker({noneSelectedText:'请选择'});
}
//获取重大危险源等级
function MajorAangerous() {
    debugger;
    $.ajax({
        type: 'get',
        async: false,
        url: '/SysDictionary/getDataDictList?typeId=' + MajorHazardRank,
        success: function (result) {
            var companyList = eval(result);
            $.each(companyList, function (i) {
                $('#searchRank').append("<option value='" + companyList[i].dictId + "'>" + companyList[i].dictName + "</option>");
            });
            $('#searchRank').selectpicker('val','')
            $('#searchRank  .selectpicker').selectpicker('refresh',{});
        },
        error: function () {
            alert("请求失败");
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
            });
            $('#searchCompanyName').selectpicker('val','');
            $('#searchCompanyName .selectpicker').selectpicker('refresh',{});
        },
        error: function () {
            alert("请求失败");
        }
    });
}

//导出Excel
function exportExcel(){
    searchCompanyName = searchCompanyName==null?"":searchCompanyName;
    searchRank = searchRank==null?"":searchRank;
    var url = "/MajorDangerSourceInfo/exportExcel?companyName="+searchCompanyName
    +"&sourceName="+searchSourceNmae+"&rank="+searchRank;
    window.top.location.href=url;
}

