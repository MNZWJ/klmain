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
//存放危险工艺单元名称ID
var technologyId="";
//存放证书类型
var certType="";
//是否只读的标识
var state=false;
//是否初始化的标志位
var flag=true;
//点击事件标志位
var eventFlag="";

//初始化列表
$(function () {
    //获取浏览器高度
    var scanHeight = $(window).height();
    initCert();//初始化相关证书表格
    initTable();//初始化危险工艺表格
    init();
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
            },
            {
                field: 'directArea',
                title: '直属区域',
                halign: 'center'
            }
        ]
    });
});
//预加载
function  init() {
    getCompanyList();
    getTypeCodeList();
    getScaleCodeList();
    getIndustryCodeList();
    getDirectAreaList();
    getstandardRankList();
    getoperatingStateList();
    getSafeManageRankList();
    savedata();
    formValidator();
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
                $('#typeCode').append("<option value='" + companyList[i].dictId + "'>" + companyList[i].dictName + "</option>");

            });
            $('#searchTypeCode').selectpicker('val', '');
            $('#typeCode').selectpicker('val', '');
            $('#searchTypeCode  .selectpicker').selectpicker('refresh',{});
            $('#typeCode  .selectpicker').selectpicker('refresh',{});
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
                $('#scaleCode').append("<option value='" + companyList[i].dictId + "'>" + companyList[i].dictName + "</option>");
            });
            $('#searchScaleCode').selectpicker('val', '');
            $('#scaleCode').selectpicker('val', '');
            $('#searchScaleCode  .selectpicker').selectpicker('refresh',{});
            $('#scaleCode  .selectpicker').selectpicker('refresh',{});
        },
        error: function () {
            alert("请求失败");
        }
    });
}
//垦利行政区域
function getDirectAreaList() {
    $.ajax({
        type: 'get',
        async: false,
        url: '/SysDictionary/getDataDictList?typeId=' + DirectAreaDictId,
        success: function (result) {
            var companyList = eval(result);
            $.each(companyList, function (i) {
                $('#directArea').append("<option value='" + companyList[i].dictId + "'>" + companyList[i].dictName + "</option>");
            });
            $('#directArea').selectpicker('val','')
            $('#directArea  .selectpicker').selectpicker('refresh',{});
        },
        error: function () {
            alert("请求失败");
        }
    });
}
//获取经营状态集合
function getoperatingStateList() {
    $.ajax({
        type: 'get',
        async: false,
        url: '/SysDictionary/getDataDictList?typeId=' + operatingStateDictId,
        success: function (result) {
            var companyList = eval(result);
            $.each(companyList, function (i) {
                $('#operatingState').append("<option value='" + companyList[i].dictId + "'>" + companyList[i].dictName + "</option>");
            });
            $('#operatingState').selectpicker('val','')
            $('#operatingState  .selectpicker').selectpicker('refresh',{});
        },
        error: function () {
            alert("请求失败");
        }
    });
}
//安全管理分级
function getSafeManageRankList() {
    $.ajax({
        type: 'get',
        async: false,
        url: '/SysDictionary/getDataDictList?typeId=' + safeManageRankDictId,
        success: function (result) {
            var companyList = eval(result);
            $.each(companyList, function (i) {
                $('#safeManageRank').append("<option value='" + companyList[i].dictId + "'>" + companyList[i].dictName + "</option>");
            });
            $('#safeManageRank').selectpicker('val','')
            $('#safeManageRank  .selectpicker').selectpicker('refresh',{});
        },
        error: function () {
            alert("请求失败");
        }
    });
}
//标准化等级
function getstandardRankList() {
    $.ajax({
        type: 'get',
        async: false,
        url: '/SysDictionary/getDataDictList?typeId=' + standardRankDictId,
        success: function (result) {
            var companyList = eval(result);
            $.each(companyList, function (i) {
                $('#standardRank').append("<option value='" + companyList[i].dictId + "'>" + companyList[i].dictName + "</option>");
            });
            $('#standardRank').selectpicker('val','')
            $('#standardRank  .selectpicker').selectpicker('refresh',{});
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
                $('#industryCode').append("<option value='" + companyList[i].dictId + "'>" + companyList[i].dictName + "</option>");
            });
            $('#searchIndustryId').selectpicker('val','')
            $('#industryCode').selectpicker('val','')
            $('#searchIndustryId  .selectpicker').selectpicker('refresh',{});
            $('#industryCode  .selectpicker').selectpicker('refresh',{});
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
    eventFlag="look";
    var row=$("#enterpriseTable").bootstrapTable("getRowByUniqueId",companyId);
    company=row.companyId;
    $('#typeCode').selectpicker('val', '');
    $('#industryCode').selectpicker('val', '');
    $('#scaleCode').selectpicker('val', '');
    $('#operatingState').selectpicker('val', '');
    $('#standardRank').selectpicker('val', '');
    $('#safeManageRank').selectpicker('val', '');
    $('#directArea').selectpicker('val', '');
    //刷新表格
    $("#table").bootstrapTable('refresh');
    $("#certTable").bootstrapTable('refresh');

    //input赋值
    $.ajax({
        type: 'post',
        url: '/BasicInfoEntry/getCompanyInfo',
        data: {companyId: company},
        success: function (result) {
            debugger;
            //清空表单
            $(':input', '#companyForm')
                .not(':button, :submit, :reset')
                .val('')
                .removeAttr('checked')
                .removeAttr('selected');
            //下拉框赋值
            $('#typeCode').selectpicker('val', result[0].typeCode);
            if(result[0].industryCode!=null) {
                $('#industryCode').selectpicker('val', result[0].industryCode.split(','));//多选时
            }
            $('#scaleCode').selectpicker('val', result[0].scaleCode);
            $('#operatingState').selectpicker('val', result[0].operatingState);
            $('#standardRank').selectpicker('val', result[0].standardRank);
            $('#safeManageRank').selectpicker('val', result[0].safeManageRank);
            $('#directArea').selectpicker('val', result[0].directArea);
            //input赋值
            $("#companyName").val(result[0].companyName);
            $("#uniqueCode").val(result[0].uniqueCode);
            $("#legalPerson").val(result[0].legalPerson);
            $("#contactWay").val(result[0].contactWay);
            $("#longt").val(result[0].longt);
            $("#lat").val(result[0].lat);
            $("#area").val(result[0].area);
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

    $("#myModelLabel").text("查看");
    $('#myModal').modal('show');
    $('#collapseOne').collapse('show');
    $('#collapseTwo').collapse('hide');
    $('#collapseThree').collapse('hide');
    $("#companyForm").find('input').attr({ readonly: 'true' });
    $("#companyForm").find('select').attr("disabled", "disabled");
    $("#btn_save").hide();
    $("#addData").hide();
    $("#delData").hide();
    $("#certAdd").hide();
    $("#certDel").hide();
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
    $('#typeCode').selectpicker('val', '');
    $('#industryCode').selectpicker('val', '');
    $('#scaleCode').selectpicker('val', '');
    $('#operatingState').selectpicker('val', '');
    $('#standardRank').selectpicker('val', '');
    $('#safeManageRank').selectpicker('val', '');
    $('#directArea').selectpicker('val', '');
    $("#companyForm").data('bootstrapValidator').resetForm(false)
    $("#btn_save").show();
    $("#addData").show();
    $("#delData").show();
    $("#certAdd").show();
    $("#certDel").show();
    if(state){
        $("#companyForm").find('input').removeAttr('readonly');
        $("#companyForm").find('select').removeAttr("disabled", "disabled");
        state = false;
    }
    //清空表格
    $("#table").bootstrapTable('load', []);
    $("#certTable").bootstrapTable('load', []);

    $("#myModelLabel").text("新增");
    $('#myModal').modal('show');
    $('#collapseOne').collapse('show');
    $('#collapseTwo').collapse('hide');
    $('#collapseThree').collapse('hide');

}
//修改
function companyEdit() {
    eventFlag="edit";
    var row = $("#enterpriseTable").bootstrapTable("getSelections");//获取所有选中的行
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
    company=row[0].companyId;
    //刷新表格
    $("#table").bootstrapTable("refresh");
    $("#certTable").bootstrapTable("refresh");

    $.ajax({
        type: 'post',
        url: '/BasicInfoEntry/getCompanyInfo',
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
            //下拉框赋值
            $('#typeCode').selectpicker('val', result[0].typeCode);
            $('#industryCode').selectpicker('val', result[0].industryCode.split(','));//多选时
            $('#scaleCode').selectpicker('val', result[0].scaleCode);
            $('#operatingState').selectpicker('val', result[0].operatingState);
            $('#standardRank').selectpicker('val', result[0].standardRank);
            $('#safeManageRank').selectpicker('val', result[0].safeManageRank);
            $('#directArea').selectpicker('val', result[0].directArea);
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
    $("#myModelLabel").text("修改");
    $('#myModal').modal('show');
    $('#collapseOne').collapse('show');
    $('#collapseTwo').collapse('hide');
    $('#collapseThree').collapse('hide');
}
//初始化危险工艺表格
function initTable(x) {
    $("#table").bootstrapTable({
        method: 'get',//请求方式
        clickToSelect: true,//是否启用点击选中行
        showRefresh: false,//是否显示 刷新按钮
        url: '/EnterpriseInfo/getCompanyArtList',
        striped: true,                      //是否显示行间隔色
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        queryParams: function (pageReqeust) {
            pageReqeust.companyId = company;
            return pageReqeust;
        },
        rowStyle: function () {//自定义行样式
            return "bootTableRow";
        },
        editable:true,//开启编辑模式
        pagination: true,
        idField:'technologyId',
        uniqueId: 'technologyId', //将companyId列设为唯一索引
        minimumCountColumns: 2,
        smartDisplay:true,
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
        onLoadSuccess:function(){
            //当查看时控制可编辑表格不可编辑
          if(eventFlag=="look"){
            $("#table").find(".editable").editable('disable');
          }
        },
        columns: [
            {
                title: '序号',
                field: 'number1',
                halign: 'center',
                align: 'center',
                formatter: function (value, row, index) {
                    var page = $('#table').bootstrapTable('getOptions');
                    return (page.pageNumber - 1) * page.pageSize + index + 1;
                }
            },
            {
                field: 'state',
                checkbox: true
            },
            {
                field: 'technologyId',
                title: '危险工艺名称',
                halign: 'center',
                align:'center',
                editable:{
                    type: 'select',
                    title: '请选择',
                    source: function () {
                        var result = [];
                        $.ajax({
                            url: '/SysDictionary/getDataDictList?typeId=' + RiskProcessDictId,
                            async: false,
                            type: "get",
                            success: function (companyList) {
                                $.each(companyList, function (i) {
                                    result.push({ value:companyList[i].dictId, text: companyList[i].dictName });
                                });
                            }
                        });
                        return result;
                    }
                },
            },{
                field: 'monitorUnit',
                title: '重点监控单元',
                halign: 'center',
                editable:{
                    type: 'text',
                    title: '请输入',
                }
            }
        ]
    });
    //新增
    $('#addData').click(function(){
        $('#table').bootstrapTable('selectPage', 1);
        var data = {technologyId: '',monitorUnit:''};
        $('#table').bootstrapTable('prepend', data);
    });
    //删除
    $('#delData').click(function(){
        var row = $("#table").bootstrapTable("getSelections");//获取所有选中的行
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
                $("#table").bootstrapTable('removeByUniqueId', row[i].technologyId);
            }
        }
    });
}
//初始化相关证书表格
function initCert(x) {
    $("#certTable").bootstrapTable({
        method: 'get',
        editable:true,//开启编辑模式
        url: '/BasicInfoEntry/getCompanyCertList',
        cache: false,
        pagination: true,
        clickToSelect: true,//是否启用点击选中行
        idField:'certType',
        uniqueId: 'certType', //将companyId列设为唯一索引
        striped: true,
        minimumCountColumns: 2,
        smartDisplay:true,
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
                message: '表格加载失败！',
                size: BootstrapDialog.SIZE_SMALL,
                type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                closable: false, // <-- Default value is false
                draggable: true, // <-- Default value is false
                buttonLabel: '确定' // <-- Default value is 'OK',
            });
        },
        onLoadSuccess:function(){
            //当查看时控制可编辑表格不可编辑
            if(eventFlag=="look"){
                $("#certTable").find(".editable").editable('disable');
            }
        },
        columns: [
            {
                title: '序号',
                field: 'number1',
                halign: 'center',
                align: 'center',
                formatter: function (value, row, index) {
                    var page = $('#certTable').bootstrapTable('getOptions');
                    return (page.pageNumber - 1) * page.pageSize + index + 1;
                }
            },
            {
                field: 'state',
                checkbox: true
            },
            {
                field: 'certType',
                title: '证书类型',
                halign: 'center',
                align:'center',
                editable:{
                    type: 'select',
                    title: '请选择',
                    source: function () {
                        var result = [];
                        $.ajax({
                            url: '/SysDictionary/getDataDictList?typeId=' + certTypeDictId,
                            async: false,
                            type: "get",
                            success: function (companyList) {
                                $.each(companyList, function (i) {
                                    result.push({ value:companyList[i].dictId, text: companyList[i].dictName });
                                });
                            }
                        });
                        return result;
                    }
                },
            },{
                field: 'certNo',
                title: '证书编号',
                halign: 'center',
                editable:{
                    type: 'text',
                    title: '请输入',
                }
            },{
                field: 'startDate',
                title: '开始日期',
                halign: 'center',
                editable:{
                    type: 'date',
                    title: '请选择',
                }
            },{
                field: 'validity',
                title: '有效期',
                halign: 'center',
                editable:{
                    type: 'date',
                    title: '请选择',
                }
            }
        ]
    });
    //新增
    $('#certAdd').click(function(){
        $('#certTable').bootstrapTable('selectPage', 1);
        var data = {certType: '',certNo:'',startDate:'',validity:''};
        $('#certTable').bootstrapTable('prepend', data);
    });
    //删除
    $('#certDel').click(function(){
        var row = $("#certTable").bootstrapTable("getSelections");//获取所有选中的行
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
                $("#certTable").bootstrapTable('removeByUniqueId', row[i].certType);
            }
        }
    });
}
//保存
function savedata() {
//保存
    $('#btn_save').click(function () {
        //获取表单对象
        var bootstrapValidator = $("#companyForm").data('bootstrapValidator');
        //获取BS中的List值
        var processTable = $('#table').bootstrapTable('getData');
        var certTable = $('#certTable').bootstrapTable('getData');
        //手动触发验证
        bootstrapValidator.validate();
        if (bootstrapValidator.isValid()) {
            //获取表单中的值
            var form = {};
            var menuList = $('#companyForm').serializeArray();
            var industryCode="";
            for(var i=0;i<menuList.length;i++){
                if(menuList[i].name=='industryCode'){
                    industryCode+=','+menuList[i].value;
                }}
            $.each(menuList, function () {
                form[this.name] = this.value
            });
            form.industryCode=industryCode.substring(1);
            var cmd = {"form": form, "processTable": processTable, "certTable": certTable};
            $.ajax({
                type: 'post',
                url: '/BasicInfoEntry/saveData',
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
                                $("#enterpriseTable").bootstrapTable("refresh");
                            }
                        });
                    }
                },
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
//删除
function companyDel() {
    var rows = $("#enterpriseTable").bootstrapTable("getSelections");//获取所有选中的行
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
        message: "确定要删除选中的企业信息吗？",
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
                    ids += n.companyId + ",";
                });
                ids = ids.substring(0, ids.length - 1);
                $.ajax({
                    type: 'post',
                    url: '/BasicInfoEntry/delCompanyInfo',
                    data: {companyId: ids},
                    success: function (result) {
                        if (result.code == "00") {
                            BootstrapDialog.alert({
                                title: "提示",
                                size: BootstrapDialog.SIZE_SMALL,
                                message: "删除成功！",
                                type: BootstrapDialog.TYPE_SUCCESS, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                                callback: function () {
                                    $('#myModal').modal('hide');
                                    $("#enterpriseTable").bootstrapTable("refresh");
                                }
                            });
                        }
                    },
                    error: function () {
                        BootstrapDialog.alert({
                            title: '错误',
                            message: '删除失败！',
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
//form验证规则
function formValidator() {
//表单验证
    $("#companyForm").bootstrapValidator({
        excluded: [':disabled', ':hidden', ':not(:visible)'],
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        live: 'enabled',
        message: 'This value is not valid',
        submitButtons: 'button[type="submit"]',
        submitHandler: null,
        trigger: null,
        threshold: null,
        /**
         * 表单域配置
         */
        fields: {
            //多个重复
            companyName: {
                //隐藏或显示 该字段的验证
                enabled: true,
                //错误提示信息
                message: 'This value is not valid',
                /**
                 * 定义错误提示位置  值为CSS选择器设置方式
                 * 例如：'#firstNameMeg' '.lastNameMeg' '[data-stripe="exp-month"]'
                 */
                container: null,
                /**
                 * 定义验证的节点，CSS选择器设置方式，可不必须是name值。
                 * 若是id，class, name属性，<fieldName>为该属性值
                 * 若是其他属性值且有中划线链接，<fieldName>转换为驼峰格式  selector: '[data-stripe="exp-month"]' =>  expMonth
                 */
                selector: null,
                /**
                 * 定义触发验证方式（也可在fields中为每个字段单独定义），默认是live配置的方式，数据改变就改变
                 * 也可以指定一个或多个（多个空格隔开） 'focus blur keyup'
                 */
                trigger: null,
                // 定义每个验证规则
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
   /*         typeCode: {
                validators: {
                    notEmpty: {
                        message: '请选择企业类型'
                    }
                }
            },*/
            uniqueCode: {
                validators: {
                    notEmpty: {
                        message: '唯一编码不能为空'
                    },
                }
            },
          /*  industryCode: {
                validators: {
                    notEmpty: {
                        message: '企业行业不能为空'
                    },
                }
            },
            legalPerson: {
                validators: {
                    notEmpty: {
                        message: '法定代表人不能为空'
                    },
                }
            },
            scaleCode: {
                validators: {
                    notEmpty: {
                        message: '企业规模不能为空'
                    },
                }
            },
            contactWay: {
                validators: {
                    notEmpty: {
                        message: '联系方式不能为空'
                    },
                }
            },
            operatingState: {
                validators: {
                    notEmpty: {
                        message: '经营状态不能为空'
                    },
                }
            },
            longt: {
                validators: {
                    notEmpty: {
                        message: '经度不能为空'
                    },
                }
            },
            standardRank: {
                validators: {
                    notEmpty: {
                        message: '标准化等级不能为空'
                    },
                }
            },
            lat: {
                validators: {
                    notEmpty: {
                        message: '纬度不能为空'
                    },
                }
            },
            safeManageRank: {
                validators: {
                    notEmpty: {
                        message: '安全管理等级不能为空'
                    },
                }
            }
            ,
            area: {
                validators: {
                    notEmpty: {
                        message: '行政区域不能为空'
                    },
                }
            }
            ,
            directArea: {
                validators: {
                    notEmpty: {
                        message: '直属区域不能为空'
                    },
                }
            }*/
        }
    });
}
