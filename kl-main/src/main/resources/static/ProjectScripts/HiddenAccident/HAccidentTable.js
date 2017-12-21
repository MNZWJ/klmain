$(function () {

    //获取浏览器高度
    var scanHeight = $(window).height();
    //初始化日期元件
    loaddate();
    $('#table').bootstrapTable({
        height: scanHeight,
        striped: true,      //是否显示行间隔色
        cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        method: 'get',//请求方式
        url: '/HAccidentTable/getHAccidentTable',//请求url
        pagination: 'true',//显示分页条
        paginationLoop: 'true',//启用分页条无限循环功能
        pageNumber: 1,                       //初始化加载第一页，默认第一页
        pageSize: 10,                       //每页的记录行数（*）
        pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
        toolbar: '#toolbar',                //工具按钮用哪个容器
        clickToSelect: false,//是否启用点击选中行
        sidePagination: 'server',//'server'或'client'服务器端分页
        showRefresh: false,//是否显示 刷新按钮
        queryParams: queryParams,
        queryParamsType: '', //默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort
        idField:"dangerId",
        // 设置为 ''  在这种情况下传给服务器的参数为：pageSize,pageNumber
        onLoadError:function(){

        },
        onLoadSuccess:function(result){
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
                field: 'sourceName',
                title: '重大危险源名称',
                halign: 'center',
                align: 'left',
                width: '10%',
                class:"bootTableRow",
                formatter: function (value, row, index) {
                    value = value ==undefined?'-':value;
                    return '<span title="'+value+'">'+value+'</span>'
                }
            }, {
                field: 'hiddenDanager',
                title: '隐患描述',
                halign: 'center',
                align: 'left',
                width: '8.63%',
                class:"bootTableRow",
                formatter: function (value, row, index) {
                    value = value ==undefined?'-':value;
                    return '<span title="'+value+'">'+value+'</span>'
                }
            }, {
                field: 'area',
                title: '行政区划',
                halign: 'center',
                align: 'left',
                width: '8.63%',
                class:"bootTableRow",
                formatter: function (value, row, index) {
                    value = value ==undefined?'-':value;
                    return '<span title="'+value+'">'+value+'</span>'
                }
            }, {
                field: 'industry',
                title: '行业分类',
                halign: 'center',
                align: 'left',
                width: '8.63%',
                class:"bootTableRow",
                formatter: function (value, row, index) {
                    value = value ==undefined?'-':value;
                    return '<span title="'+value+'">'+value+'</span>'
                }
            },{
                field: 'superviseDept',
                title: '隐患监管部门',
                halign: 'center',
                align: 'left',
                width: '8.63%',
                class:"bootTableRow",
                formatter: function (value, row, index) {
                    value = value ==undefined?'-':value;
                    return '<span title="'+value+'">'+value+'</span>'
                }
            },{
                field: 'source',
                title: '隐患来源',
                halign: 'center',
                align: 'left',
                width: '8.63%',
                class:"bootTableRow",
                formatter: function (value, row, index) {
                    value = value ==undefined?'-':value;
                    return '<span title="'+value+'">'+value+'</span>'
                }
            },{
                field: 'category',
                title: '隐患类别',
                halign: 'center',
                align: 'left',
                width: '8.63%',
                class:"bootTableRow",
                formatter: function (value, row, index) {
                    value = value ==undefined?'-':value;
                    return '<span title="'+value+'">'+value+'</span>'
                }
            },{
                field: 'rank',
                title: '隐患级别',
                halign: 'center',
                align: 'center',
                width: '8.63%',
                class:"bootTableRow",
                formatter: function (value, row, index) {
                    value = value ==undefined?'-':value;
                    return '<span title="'+value+'">'+value+'</span>'
                }
            },{
                field: 'upReportDate',
                title: '上报日期',
                halign: 'center',
                align: 'center',
                width: '8.63%',
                class:"bootTableRow",
                formatter: function (value, row, index) {
                    value = value ==undefined?'-':value;
                    return '<span title="'+value+'">'+value+'</span>'
                }
            }, {
                field: 'reformTerm',
                title: '整改期限',
                halign: 'center',
                align: 'center',
                width: '8.63%',
                class:"bootTableRow",
                formatter: function (value, row, index) {
                    value = value ==undefined?'-':value;
                    return '<span title="'+value+'">'+value+'</span>'
                }
            }, {
                field: 'rectification',
                title: '整改情况',
                halign: 'center',
                align: 'center',
                width: '8.63%',
                class:"bootTableRow",
                formatter: function (value, row, index) {
                    value = value ==undefined?'-':value;
                    return '<span title="'+value+'">'+value+'</span>'
                }
            }
        ]
    });

});

//表格返回参数方法
function queryParams(pageReqeust) {
    return pageReqeust;
}

/**
 * 查询
 */
function search() {
    var hiddenDanger = $("#hiddenDanger").val();
    var dangerSource = $("#dangerSource").val();
    var rank = $("#rank").val();
    var rectification = $("#rectification").val();
    var startdate = $("#startdate").val();
    var enddate = $("#enddate").val();
    $("#table").bootstrapTable("refresh", {query:{hiddenDanger:hiddenDanger,dangerSource:dangerSource,rank:rank,
        rectification:rectification,startdate:startdate,enddate:enddate}})
}

/**
 * 导入
 */
function inputFile() {
    $('#myModal').modal('show');

    var oFileInput = new FileInput();
    oFileInput.Init("file", "/HAccidentTable/inputHAccident");

}

/**
 * 清空
 */
function clean() {
    $("#hiddenDanger").val("");
    $("#dangerSource").val("");
    $("#rank").val("");
    $("#rectification").val("");
    $("#startdate").val("");
    $("#enddate").val("");
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
            showPreview: true,//是否显示预览区域
            autoReplace: true,
            dropZoneEnabled: true,//是否显示拖拽区域
            showRemove: true,//显示移除按钮
            dropZoneTitle: '拖拽文件到这里 …',
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
            $("#myModal").modal("hide");
            $("#table").bootstrapTable("refresh", {})
            clearDiv();
            //$('#file').fileinput('clear');
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

/**
 * 表单清空导入记录
 */
function clearDiv() {
    $("#fileDiv").html("<input type=\"file\" name=\"file\" id=\"file\" class=\"file-loading\"/>");
}
function downloadModel() {
    window.location.href= "./../../Temp/事故隐患导入模板.xlsx";
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