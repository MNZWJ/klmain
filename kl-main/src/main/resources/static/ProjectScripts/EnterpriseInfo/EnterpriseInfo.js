//存放查询的企业名称
var companyId;
//存放查询的企业规模
var searchScaleCode;
//存放的企业类型
var searchTypeCode;
//存放的企业行业
var searchIndustryCode;
//存放企业
var users = [];
//存放所选企业主键
var company;
$(function () {
    //获取浏览器高度
    var scanHeight = $(window).height();
    //加载列表
    $('#enterpriseTable').bootstrapTable({
        height: scanHeight - 6,
        url: '/EnterpriseInfo/getCompanyInfoList',
        method: 'get',                      //请求方式（*）
        toolbar: '#enterpriseToolbar',                //工具按钮用哪个容器
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
        uniqueId:'companyId',
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
        },
        columns: [{
            title: '序号',
            field: 'number1',
            halign: 'center',
            align: 'center',
            formatter: function (value, row, index) {
                var page = $('#enterpriseTable').bootstrapTable('getOptions');
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
                formatter: function (value, rowData, rowIndex) {
                    users.push(rowData);
                    return "<a href='javascript:look(\""+rowData.companyId+"\")'>" + value + "</a>";
                }
            },{
                field: 'legalPerson',
                title: '法人代表',
                halign: 'center',
                align:'center'
            }, {
                field: 'contactWay',
                title: '联系方式',
                halign: 'center',
                align:'center'
            },  {
                field: 'safeManageRank',
                title: '安全管理分级',
                halign: 'center',
                align:'right'
            },   {
                field: 'standardRank',
                title: '标准化等级',
                halign: 'center',
                align:'right'
            },   {
                field: 'operatingState',
                title: '经营状态',
                halign: 'center'
            },   {
                field: 'industryCode',
                title: '所属行业',
                halign: 'center'
            },   {
                field: 'scaleCode',
                title: '企业规模',
                halign: 'center',
                align:'center'
            },   {
                field: 'typeCode',
                title: '企业类型',
                halign: 'center',
                align:'center'
            }, {
                field: 'area',
                title: '行政区域',
                halign: 'center'
            }
        ]
    });
    init();
});
//预加载
function  init() {
    getCompanyList();
    getTypeCodeList();
    getScaleCodeList();
    getIndustryCodeList();
    $("#myTabDrop1").on("shown.bs.tab", function (e) {
        $('#riskTable').bootstrapTable("refresh");
    });
    $("#chemicalsTab").on("shown.bs.tab", function (e) {
        $('#chemistryTable').bootstrapTable("refresh");
    });
    $("#companyArt").on("shown.bs.tab", function (e) {
        $('#companyArtTable').bootstrapTable("refresh");
    });
    //模态窗关闭事件
    $('#myModal').on('hidden.bs.modal', function () {
        $('#myTab a[href="#companyInfo"]').tab('show');
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
//获取企业类型集合
function getTypeCodeList() {
    $.ajax({
        type: 'get',
        async: false,
        url: '/SysDictionary/getDataDictList?typeId=' + TypeCodeDictId,
        success: function (result) {
            var companyList = eval(result);
            $.each(companyList, function (i) {
                $('#searchTypeCode').append("<option value='" + companyList[i].dictId + "'>" + companyList[i].dictName + "</option>");
            });
            $('#searchTypeCode').selectpicker('val','')
            $('#searchTypeCode  .selectpicker').selectpicker('refresh',{});
        },
        error: function () {
            alert("请求失败");
        }
    });
}
//获取企业规模集合
function getScaleCodeList() {
    $.ajax({
        type: 'get',
        async: false,
        url: '/SysDictionary/getDataDictList?typeId=' + ScaleCodeDictId,
        success: function (result) {
            var companyList = eval(result);
            $.each(companyList, function (i) {
                $('#searchScaleCode').append("<option value='" + companyList[i].dictId + "'>" + companyList[i].dictName + "</option>");
            });
            $('#searchScaleCode').selectpicker('val','')
            $('#searchScaleCode  .selectpicker').selectpicker('refresh',{});
        },
        error: function () {
            alert("请求失败");
        }
    });
}
//获取企业行业集合
function getIndustryCodeList() {
    $.ajax({
        type: 'get',
        async: false,
        url: '/SysDictionary/getDataDictList?typeId=' + IndustryCodeDictId,
        success: function (result) {
            var companyList = eval(result);
            $.each(companyList, function (i) {
                $('#searchIndustryId').append("<option value='" + companyList[i].dictId + "'>" + companyList[i].dictName + "</option>");
            });
            $('#searchIndustryId').selectpicker('val','')
            $('#searchIndustryId  .selectpicker').selectpicker('refresh',{});
        },
        error: function () {
            alert("请求失败");
        }
    });
}
//查询
function searchMenus() {
    companyId = $("#searchCompanyName").selectpicker('val');
    searchScaleCode = $("#searchScaleCode").selectpicker('val');
    searchTypeCode = $("#searchTypeCode").selectpicker('val');
    searchIndustryCode = $("#searchIndustryId").selectpicker('val');
    $("#enterpriseTable").bootstrapTable("refresh",{});
}
//清空查询条件
function clearRole() {
    $('#searchScaleCode').selectpicker('val','');
    $('#searchTypeCode').selectpicker('val','');
    $('#searchIndustryId').selectpicker('val','');
    $('#searchCompanyName').selectpicker('val','');
}
//表格返回参数方法
function queryParams(pageReqeust) {
    pageReqeust.companyName = companyId;
    pageReqeust.scaleCode = searchScaleCode;
    pageReqeust.typeCode = searchTypeCode;
    pageReqeust.industryId = searchIndustryCode;
    return pageReqeust;
}
//企业点击事件弹出查看窗
function look(companyId) {
    var row=$("#enterpriseTable").bootstrapTable("getRowByUniqueId",companyId);
    company=row.companyId;
         $.ajax({
            type: 'post',
            url: '/EnterpriseInfo/getCompanyInfo',
            data: {companyId: company},
            success: function (result) {
                //清空表单
                $(':input', '#companyForm')
                    .not(':button, :submit, :reset')
                    .val('')
                    .removeAttr('checked')
                    .removeAttr('selected');
                for (var p in result[0]) {
                    $("#companyForm").find(":input[name='" + p + "']").val(result[0][p]);
                }
            },
            error: function () {
                BootstrapDialog.alert({
                    title: '错误',
                    message: '请检查网络连接！',
                    size: BootstrapDialog.SIZE_SMALL,
                    type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                    closable: false, // <-- Default value is false
                    draggable: true, // <-- Default value is false
                    buttonLabel: '确定', // <-- Default value is 'OK',
                });
            }
        });
    $('#myModal').modal('show');
    initTable();
    }
//初始化表格
function initTable() {
    //获取浏览器高度
    var scanHeight = $(window).height();
    //化学品表格
    $('#chemistryTable').bootstrapTable({
        height: scanHeight * 4 / 7,
        striped: true,      //是否显示行间隔色
        cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        method: 'get',//请求方式
        url: '/EnterpriseInfo/getChemicalsInfoList',//请求url
        clickToSelect: true,//是否启用点击选中行
        showRefresh: false,//是否显示 刷新按钮
        queryParams: function (pageReqeust) {
            pageReqeust.companyId = company;
            return pageReqeust;
        },
        rowStyle: function () {//自定义行样式
            return "bootTableRow";
        },
        onLoadError: function () {
            BootstrapDialog.alert({
                title: '错误',
                size: BootstrapDialog.SIZE_SMALL,
                message: '表格加载失败！',
                type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                closable: false, // <-- Default value is false
                draggable: true, // <-- Default value is false
                buttonLabel: '确定', // <-- Default value is 'OK',
            });
        },
        columns: [
            {
                title: '序号',
                formatter: function (value, row, index) {
                    return index + 1;
                }
            },
            {
                field: 'chemName',
                title: '化学品名称',
                halign: 'center',
                width: '40%',
                cellStyle: function (value, row, index, field) {
                    return {classes: '', css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis'}};
                }
            }, {
                field: 'cAS',
                title: 'CAS',
                halign: 'center',
                width: '50%'
            }]
    });
    //危险源表格
    $('#riskTable').bootstrapTable({
        height: scanHeight * 4 / 7,
        striped: true,      //是否显示行间隔色
        cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        method: 'get',//请求方式
        url: '/EnterpriseInfo/getDangerSourceList',//请求url
        clickToSelect: true,//是否启用点击选中行
        showRefresh: false,//是否显示 刷新按钮
        queryParams: function (pageReqeust) {
            pageReqeust.companyId = company;
            return pageReqeust;
        },
        rowStyle: function () {//自定义行样式
            return "bootTableRow";
        },
        onLoadError: function () {
            BootstrapDialog.alert({
                title: '错误',
                size: BootstrapDialog.SIZE_SMALL,
                message: '表格加载失败！',
                type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                closable: false, // <-- Default value is false
                draggable: true, // <-- Default value is false
                buttonLabel: '确定', // <-- Default value is 'OK',
            });
        },
        columns: [
            {
                title: '序号',
                width: '5%',
                formatter: function (value, row, index) {
                    return index + 1;
                }
            },
            {
                field: 'sourceName',
                title: '危险源名称',
                halign: 'center',
                width: '30%',
                cellStyle: function (value, row, index, field) {
                    return {classes: '', css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis'}};
                }
            }, {
                field: 'rank',
                title: '危险源等级',
                halign: 'center',
                width: '20%'
            }, {
                field: 'OutPersonCount',
                title: '500米范围内人数估值',
                halign: 'center',
                width: '20%'
            }, {
                field: 'recordDate',
                title: '投用时间',
                halign: 'center',
                width: '30%'
            }]
    });
    //危险关联工艺
    $('#companyArtTable').bootstrapTable({
        height: scanHeight * 4 / 7,
        striped: true,      //是否显示行间隔色
        cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        method: 'get',//请求方式
        url: '/EnterpriseInfo/getCompanyArtList',//请求url
        clickToSelect: true,//是否启用点击选中行
        showRefresh: false,//是否显示 刷新按钮
        queryParams: function (pageReqeust) {
            pageReqeust.companyId = company;
            return pageReqeust;
        },
        rowStyle: function () {//自定义行样式
            return "bootTableRow";
        },
        onLoadError: function () {
            BootstrapDialog.alert({
                title: '错误',
                size: BootstrapDialog.SIZE_SMALL,
                message: '表格加载失败！',
                type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                closable: false, // <-- Default value is false
                draggable: true, // <-- Default value is false
                buttonLabel: '确定', // <-- Default value is 'OK',
            });
        },
        columns: [
            {
                title: '序号',
                formatter: function (value, row, index) {
                    return index + 1;
                }
            } ,
            {
                field: 'technologyName',
                title: '工艺名称',
                halign: 'center',
                width: '40%',
                cellStyle: function (value, row, index, field) {
                    return {classes: '', css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis'}};
                }
            }, {
                field: 'monitorUnit',
                title: '重点监控单元',
                halign: 'center',
                width: '50%'
            }]
    });
}

//导出Excel
function exportExcel(){
    companyId = companyId==null?"":companyId;
    searchScaleCode = searchScaleCode==null?"":searchScaleCode;
    searchTypeCode = searchTypeCode==null?"":searchTypeCode;
    searchIndustryCode = searchIndustryCode==null?"":searchIndustryCode;
    var url = "/EnterpriseInfo/exportExcel?companyName="+companyId
        +"&scaleCode="+searchScaleCode+"&typeCode="+searchTypeCode+"&industryId="+searchIndustryCode;
    window.top.location.href=url;
}