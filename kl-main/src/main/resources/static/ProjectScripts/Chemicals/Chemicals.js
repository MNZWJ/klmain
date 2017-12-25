//存放查询的化学品名称
var chemName = "";
//存放查询的企业
var companyName = "";
$(function () {
    //获取浏览器高度
    var scanHeight = $(window).height();
    init();
    $('#table').bootstrapTable({
        height: scanHeight,
        striped: true,      //是否显示行间隔色
        cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        method: 'get',//请求方式
        url: '/Chemicals/getChemicalsList',//请求url
        pagination: 'true',//显示分页条
        paginationLoop: 'true',//启用分页条无限循环功能
        pageNumber: 1,                       //初始化加载第一页，默认第一页
        pageSize: 10,                       //每页的记录行数（*）
        pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
        toolbar: '#toolbar',                //工具按钮用哪个容器
        clickToSelect: false,//是否启用点击选中行
        sidePagination: 'server',//'server'或'client'服务器端分页
        showRefresh: 'true',//是否显示 刷新按钮
        queryParams: queryParams,
        queryParamsType: '', //默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort
        idField:"chemId",
        // 设置为 ''  在这种情况下传给服务器的参数为：pageSize,pageNumber
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
        onLoadSuccess:function(result){
        },
        onClickRow:function(row, $element){
            $("#table").bootstrapTable("uncheckAll");
            $("#table").bootstrapTable("checkBy",{field:'chemId',values:[row.chemId]})
        },
        columns: [
            {
                title: '序号',
                halign: 'center',
                align: 'center',
                formatter: function (value, row, index) {
                    var page = $('#table').bootstrapTable('getOptions');
                    return (page.pageNumber - 1) * page.pageSize + index + 1;
                }
            }, {
                field: 'chemName',
                title: '化学品名称',
                halign: 'center',
                align: 'left',
                class: "bootTableRow",
                formatter: function (value, row, index) {
                    return '<span title="'+value+'">'+value+'</span>'
                }
            }, {
                field: 'cAS',
                title: 'CAS',
                halign: 'center',
                align: 'left',
                class: "bootTableRow"
            },{
                field: 'companyId',
                title: '企业名称',
                halign: 'center',
                align: 'left',
                class: "bootTableRow",
                formatter: function (value, row, index) {
                    return '<span title="'+value+'">'+value+'</span>'
                }
            },{
                field: 'dreserves',
                title: '设计储量',
                halign: 'center',
                align: 'left',
                class: "bootTableRow",
                formatter: function (value, row, index) {
                    return '<span title="'+value+'">'+value+'</span>'
                }
            },{
                field: 'unit',
                title: '单位',
                halign: 'center',
                align: 'left',
                class: "bootTableRow",
                formatter: function (value, row, index) {
                    return '<span title="'+value+'">'+value+'</span>'
                }
            }]
    });
});
function init() {
    getCompanyList();
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
                $('#companyName').append("<option value='" + companyList[i].companyId + "'>" + companyList[i].companyName + "</option>");
            });
            $('#companyName').selectpicker('val','',{ noneSelectedText:"==请选择=="});
            $('#companyName .selectpicker').selectpicker('refresh',{});
        },
        error: function () {
            alert("请求失败");
        }
    });
}
//表格返回参数方法
function queryParams(pageReqeust) {
    pageReqeust.chemName = chemName;
    pageReqeust.companyName = companyName;
    return pageReqeust;
}

/**
 * 查询
 */
function search() {
    chemName = $("#chemName").val();
    companyName = $("#companyName").selectpicker('val');
    $("#table").bootstrapTable("refresh", {})
}

/**
 * 清空
 */
function clean() {
    $("#chemName").val("");
    $('#companyName').selectpicker('val','');
}

//导出Excel
function exportExcel(){
    chemName = chemName==null?"":chemName;
    companyName = companyName==null?"":companyName;
    var url = "/Chemicals/exportExcel?chemName="+chemName
        +"&companyName="+companyName;
    window.top.location.href=url;
}

