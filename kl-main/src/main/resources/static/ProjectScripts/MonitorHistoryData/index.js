var typeId = "";
var dictSearchName = "";
var treeNode = "";
var scanHeight="";
$(function () {
    //获取浏览器高度
    scanHeight = $(window).height();
    initTable();
});

//表格返回参数方法
function queryParams(pageReqeust) {
    pageReqeust.typeId = typeId;  //
    pageReqeust.dictSearchName = dictSearchName;

    return pageReqeust;
}

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
        pageSize: 5,                       //每页的记录行数（*）
        pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
        toolbar: '#dictToolbar',                //工具按钮用哪个容器
        clickToSelect: false,//是否启用点击选中行
        sidePagination: 'server',//'server'或'client'服务器端分页
        showRefresh: 'true',//是否显示 刷新按钮
       // queryParams: queryParams,
        queryParamsType: '', //默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort
        // 设置为 ''  在这种情况下传给服务器的参数为：pageSize,pageNumber
        sortStable: true,//设置为 true 将获得稳定的排序，我们会添加_position属性到 row 数据中。
        selectItemName: 'state',
        idField: 'dataId',
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
        onClickRow:function(row, $element){
            $("#dataTable").bootstrapTable("uncheckAll");
            $("#dataTable").bootstrapTable("checkBy",{field:'dataId',values:[row.dataId]})
        },
        columns: [
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
                field: 'unit',
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


//按名称查询
function searchMenus() {
    dictSearchName = $("#dictSearchName").val();
    $("#dictTable").bootstrapTable("refresh", {})
}

//适应页面大小
function resizePage(){
    //获取浏览器高度
    scanHeight = $(window).height();
    initTable();
}