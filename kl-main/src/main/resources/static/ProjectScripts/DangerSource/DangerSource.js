var sourceId = "null";
$(function () {
    //获取浏览器高度
    var scanHeight = $(window).height();
    $("#map").height(scanHeight - 8);
    initMap();

    $("#chemicalsTab").on("shown.bs.tab", function (e) {
        $('#chemistryTable').bootstrapTable("refresh");
    });

    initTable();
    //模态窗关闭事件
    $('#myModal').on('hidden.bs.modal', function () {
        $('#myTab a[href="#sourceInfo"]').tab('show')
    });
});

function initMap() {
    map = new BMap.Map("map");          // 创建地图实例
    var point = new BMap.Point('118.65', '37.7');
    map.centerAndZoom(point, '11');             // 初始化地图，设置中心点坐标和地图级别
    map.enableScrollWheelZoom(); // 允许滚轮缩放

    map.setMapStyle({
        styleJson: [{
            "featureType": "road",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        }]
    });

    getBoundary();
    map.setMinZoom(8);
    map.setMaxZoom(18);


    searchSourcr();
    getCompanyList();
    mini.get("searchRank").load("/SysDictionary/getDataDictList?typeId=" + MajorHazardRank);
}

//获取企业集合
function getCompanyList() {
    var companyList = [];
    $.ajax({
        type: 'post',
        async: false,
        url: '/Inspection/getCompanyList',
        success: function (result) {
            companyList = result;
            mini.get("searchCompanyName").setData(companyList);
        },
        error: function () {
            alert("请求失败");
        }
    });
    return companyList;
}

//加载所有危险源
function loadSourceList(courceList) {
    map.clearOverlays();
    $.each(courceList, function (i, n) {
        var tempPoint = new BMap.Point(n.longt, n.lat);
        var myIcon = new BMap.Icon("../../Images/Common/红点.png", new BMap.Size(50, 50));
        switch (n.rank) {
            case "一级":
                myIcon = new BMap.Icon("../../Images/Common/红点.png", new BMap.Size(50, 50));
                break;
            case "二级":
                myIcon = new BMap.Icon("../../Images/Common/橙点.png", new BMap.Size(50, 50));
                break;
            case "三级":
                myIcon = new BMap.Icon("../../Images/Common/黄点.png", new BMap.Size(50, 50));
                break;
            case "四级":
                myIcon = new BMap.Icon("../../Images/Common/蓝点.png", new BMap.Size(50, 50));
                break;
        }
        var marker = new BMap.Marker(wgs2bd(tempPoint), {
            title: n.sourceName,
            icon: myIcon
        });
        map.addOverlay(marker);
        marker.customData = {sourceId: n.sourceId};
        marker.addEventListener("onclick", onMarkClick);
    });

}

//危险源点击事件
function onMarkClick(e) {
    sourceId = e.target.customData.sourceId;
    chemicalsTableLoda(sourceId);//化学品列表数据
    $("#chemistryTable").bootstrapTable("refresh");
    $.ajax({
        type: 'get',
        url: '/DangerSource/getDSourceInfo',
        data: {sourceId: sourceId},
        contentType : 'application/json;charset=utf-8',
        success: function (result) {
            //清空表单
            $(':input', '#sourceInfo')
                .not(':button, :submit, :reset')
                .val('')
                .removeAttr('checked')
                .removeAttr('selected');
            for (var p in result) {

                $("#sourceInfo").find(":input[name='" + p + "']").val(result[p]);

            };
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
}

//关闭查询框
function openOrclose() {

    $("#tab2").hide();
    var i = 92;
    var interval = setInterval(function () {
        i--;

        $("#tab").css({"width": i + "%"});
        if (i <= 0) {
            clearInterval(interval)
            $("#td1").hide();
            $("#windowdiv1").hide();
            $("#td3").hide();
            $("#open").show();
            $(".windowdiv").hide();
        }
    }, 4);


}

//打开查询框
function openwindow() {
    $(".windowdiv").show();
    $("#open").hide();
    $("#tab").show();
    $("#td3").show();
    $("#windowdiv1").show();
    var i = 0;
    var interval2 = setInterval(function () {
        i++;

        $("#tab").css({"width": i + "%"});
        if (i >= 100) {
            clearInterval(interval2)

            $("#tab2").show();
            $("#td1").show();

        }
    }, 4);

}
//查询
function searchSourcr() {
    loadSourceList(getSource());
}
//清空查询条件
function clearSearch() {
    mini.get("searchCompanyName").setValue('');
    mini.get("searchSourceNmae").setValue('');
    mini.get("searchRank").setValue('');
}

//获取所有危险源
function getSource() {
    var sourceList = [];
    var companyName = mini.get("searchCompanyName").getText();
    var sourceName = mini.get("searchSourceNmae").getValue();
    var rank = mini.get("searchRank").getValue();
    $.ajax({
        type: 'get',
        url: '/DangerSource/getSourceCoordinate',
        async: false,
        data: {companyName: companyName, sourceName: sourceName, rank: rank},
        contentType : 'application/json;charset=utf-8',
        success: function (result) {
            sourceList = result;
        }
    });
    return sourceList;
}

//初始化表格
function initTable() {
    //化学品表格
    $('#chemistryTable').bootstrapTable({
        height: 'auto',
        striped: true,      //是否显示行间隔色
        cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        method: 'get',//请求方式
        pagination: 'false',//显示分页条
        paginationLoop: 'false',//启用分页条无限循环功能
        url: '/DangerSource/getChemicalsInfoListTable',//请求url
        pageNumber: 1,                       //初始化加载第一页，默认第一页
        pageSize: 10,                       //每页的记录行数（*）
        pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
        sidePagination: 'server',//'server'或'client'服务器端分页
        toolbar: '#toolbar',                //工具按钮用哪个容器
        clickToSelect: true,//是否启用点击选中行
        showRefresh: false,//是否显示 刷新按钮
        queryParams: queryParams,
        queryParamsType: '', //默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort
        idField:"chemId",
        rowStyle: function () {//自定义行样式
            return "bootTableRow";
        },
        onLoadSuccess:function(result){
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
            }
            ,

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
}

function queryParams(pageReqeust) {
    pageReqeust.sourceId = sourceId;
    return pageReqeust;
}

/**
 * 获取化学品列表数据
 * @param sourceId
 */
function chemicalsTableLoda(sourceId) {
    $.ajax({
        type: 'get',
        url: '/DangerSource/getChemicalsInfoListBySourceId',
        async: false,
        data:{sourceId:sourceId},
        contentType : 'application/json;charset=utf-8',
        success:function (result) {
            $('#chemistryTable').load(result);
        },
        error:function (e) {

        }
    })
}