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
//查询的化学品名称
var chemName = "";
//查询的cas
var cas = "";
//获取浏览器高度
var scanHeight = $(window).height();
//初始化列表
$(function () {
    initCert();//初始化相关证书表格
    initTable();//初始化危险工艺表格
    initChemiacalAllTable();//初始化化学品全部信息列表
    initChemicalTable();//初始话所引用化学品信息列表


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
        showRefresh: false,//是否显示 刷新按钮
        queryParamsType: '', //默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort
        // 设置为 ''  在这种情况下传给服务器的参数为：pageSize,pageNumber
        sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
        clickToSelect: true,//是否启用点击选中行
        pageNumber: 1,                       //初始化加载第一页，默认第一页
        pageSize: 10,                       //每页的记录行数（*）
        pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
        sortStable: true,//设置为 true 将获得稳定的排序，我们会添加_position属性到 row 数据中。
        selectItemName: 'state',
        idField: 'companyId',
        uniqueId:'companyId',
        rowStyle: function () {//自定义行样式
            return "bootTableRow";
        },
        onLoadError: function () {
        },
        columns: [
            {
            title: '序号',
            field: 'number1',
            halign: 'center',
            align: 'center',
            width:'3%',
            formatter: function (value, row, index) {
                var page = $('#enterpriseTable').bootstrapTable('getOptions');
                return (page.pageNumber - 1) * page.pageSize + index + 1;
            }
        }, {
            field: 'state',
            checkbox: true,
            width:'3%',
            align:'center',
        },
            {
                field: 'companyName',
                title: '企业名称',
                halign: 'center',
                width:'14%',
                cellStyle: function (value, row, index, field) {
                    return {classes: '', css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis','overflow': 'hidden'}};
                },
                formatter: function (value, rowData, rowIndex) {
                    users.push(rowData);
                    return "<a href='javascript:look(\""+rowData.companyId+"\")'>" + value + "</a>";
                }
            },{
                field: 'safeManageRank',
                title: '安全管理分级',
                halign: 'center',
                align:'center',
                width:'7%',
            },   {
                field: 'standardRank',
                title: '标准化等级',
                halign: 'center',
                align:'center',
                width:'7%',
            },   {
                field: 'operatingState',
                title: '经营状态',
                halign: 'center',
                align:'center',
                width:'5%',
            },   {
                field: 'industryCode',
                title: '所属行业',
                halign: 'center',
                width:'15%',
                cellStyle: function (value, row, index, field) {
                    return {classes: '', css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis','overflow': 'hidden'}};
                },
                formatter: function (value, row, index) {
                    if(value!=undefined){
                        return '<span title="'+value+'">'+value+'</span>'
                    }else{
                        return "";
                    }
                }
            },   {
                field: 'scaleCode',
                title: '企业规模',
                halign: 'center',
                align:'center',
                width:'5%',
                cellStyle: function (value, row, index, field) {
                    return {classes: '', css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis','overflow': 'hidden'}};
                },
                formatter: function (value, row, index) {
                    if(value!=undefined){
                        return '<span title="'+value+'">'+value+'</span>'
                    }else{
                        return "";
                    }
                }
            },   {
                field: 'typeCode',
                title: '企业类型',
                halign: 'center',
                align:'center',
                width:'10%',
                cellStyle: function (value, row, index, field) {
                    return {classes: '', css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis','overflow': 'hidden'}};
                },
                formatter: function (value, row, index) {
                    if(value!=undefined){
                        return '<span title="'+value+'">'+value+'</span>'
                    }else{
                        return "";
                    }
                }
            },
            {
                field: 'directArea',
                title: '直属区域',
                halign: 'center',
                align:'center',
                width:'5%',
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
    getDirectAreaList();
    getstandardRankList();
    getoperatingStateList();
    getSafeManageRankList();
    formValidator();
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
            $('#searchCompanyName').selectpicker('refresh');
            $('#searchCompanyName').selectpicker('val','');
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
    companyId = companyId == null ? "" : companyId;
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
    $("#chemicalTable").bootstrapTable('refresh');
    //input赋值
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
            if(result[0].industryCode!=null) {
                $('#industryCode').selectpicker('val', result[0].industryCode.split(','));//多选时
            }
            $('#scaleCode').selectpicker('val', result[0].scaleCode);
            $('#operatingState').selectpicker('val', result[0].operatingState);
            $('#standardRank').selectpicker('val', result[0].standardRank);
            $('#safeManageRank').selectpicker('val', result[0].safeManageRank);
            $('#directArea').selectpicker('val', result[0].directArea);
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
    $("#select").show();
    $("#delChemical").show();
    if(state){
        $("#companyForm").find('input').removeAttr('readonly');
        $("#companyForm").find('select').removeAttr("disabled", "disabled");
        $('#uniqueCode').removeAttr("readonly");
        state = false;
    }
    //清空表格
    $("#table").bootstrapTable('load', []);
    $("#certTable").bootstrapTable('load', []);
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
    $('#typeCode').selectpicker('val', '');
    $('#industryCode').selectpicker('val', '');
    $('#scaleCode').selectpicker('val', '');
    $('#operatingState').selectpicker('val', '');
    $('#standardRank').selectpicker('val', '');
    $('#safeManageRank').selectpicker('val', '');
    $('#directArea').selectpicker('val', '');
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
    $("#select").show();
    $("#delChemical").show();
    company=row[0].companyId;
    //刷新表格
    $("#table").bootstrapTable("refresh");
    $("#certTable").bootstrapTable("refresh");
    $("#chemicalTable").bootstrapTable("refresh");
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
            if(result[0].industryCode!=null) {
                $('#industryCode').selectpicker('val', result[0].industryCode.split(','));//多选时
            }
            $('#scaleCode').selectpicker('val', result[0].scaleCode);
            $('#operatingState').selectpicker('val', result[0].operatingState);
            $('#standardRank').selectpicker('val', result[0].standardRank);
            $('#safeManageRank').selectpicker('val', result[0].safeManageRank);
            $('#directArea').selectpicker('val', result[0].directArea);
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
                    emptytext: '请选择',
                    type: 'select',
                    title: '危险工艺名称',
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
                    title: '重点监控单元',
                    emptytext: '请输入',
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
                    title: '证书类型',
                    emptytext: '请选择',
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
                    title: '证书编号',
                    emptytext: '请输入',
                }
            },{
                field: 'startDate',
                title: '开始日期',
                halign: 'center',
                editable:{
                    type: 'date',
                    title: '开始日期',
                    emptytext: '请选择',
                }
            },{
                field: 'validity',
                title: '有效期',
                halign: 'center',
                editable:{
                    type: 'date',
                    title: '有效期',
                    emptytext: '请选择',
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
        fields: {
            //多个重复
            companyName: {
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
        url: '/BasicInfoEntry/getChemicalInfoList',
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
        url: '/BasicInfoEntry/getChemicalList',
        cache: false,
        pagination: true,
        clickToSelect: true,//是否启用点击选中行
        striped: true,
        minimumCountColumns: 2,
        smartDisplay:true,
        idField: 'chemId',
        uniqueId: 'chemId',
        queryParams: function (pageReqeust) {
            pageReqeust.companyId = company;
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
                    var page = $('#certTable').bootstrapTable('getOptions');
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
                    validate:function(value){
                        debugger;
                        if(isNaN(Number($.trim(value)))){
                            return "请输入数字！";
                        }
                    }
                },
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
        $('#chemicalMadel').modal('show');
        $("#chemicalAllTable").bootstrapTable('refresh');
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
//保存
$('#btn_save').click(function () {
    //获取表单对象
    var bootstrapValidator = $("#companyForm").data('bootstrapValidator');
    //获取BS中的List值
    var processTable = $('#table').bootstrapTable('getData');
    var certTable = $('#certTable').bootstrapTable('getData');
    var chemicalTable = $('#chemicalTable').bootstrapTable('getData');
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
        var cmd = {"form": form, "processTable": processTable, "certTable": certTable,"chemicalTable":chemicalTable};
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
                            getCompanyList();
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


/**
 * 导入
 */
function inputFile() {
    $('#InputMadel').modal('show');
    var oFileInput = new FileInput();
    oFileInput.Init("file", "/BasicInfoEntry/inputCompanyInfo");
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
            $("#InputMadel").modal("hide");
            $("#enterpriseTable").bootstrapTable("refresh", {})
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

//模板下载
function downloadModel() {
    window.location.href= "./../../Temp/企业基本信息导入模板.xlsx";
    BootstrapDialog.alert({
        title: '提示',
        message: '模板中序号一列为必填，如果不填可能会导致数据上传失败！',
        size: BootstrapDialog.SIZE_SMALL,
        type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
        closable: false, // <-- Default value is false
        draggable: true, // <-- Default value is false
        buttonLabel: '确定', // <-- Default value is 'OK',
    });
}
