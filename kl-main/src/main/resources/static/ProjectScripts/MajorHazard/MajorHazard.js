var sourceId = "";
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


    loadSourceList(hazardSearch());
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
    $.ajax({
        type: 'post',
        url: '/MajorHazard/getMajorHazard',
        data: {sourceId: sourceId},
        success: function (result) {
            //清空表单
            $(':input', '#sourceInfo')
                .not(':button, :submit, :reset')
                .val('')
                .removeAttr('checked')
                .removeAttr('selected');
            for (var p in result[0]) {

                $("#sourceInfo").find(":input[name='" + p + "']").val(result[0][p]);

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

//查询企业type=true 查询;type=false 复位
function searchSourceList(type) {
    if (!type)
        clearSearch();
    loadSourceList(hazardSearch());
}


//清空查询条件
function clearSearch() {
    mini.get("searchCompanyName").setValue('');
    mini.get("searchSourceNmae").setValue('');
    mini.get("searchRank").setValue('');
}


function hazardSearch() {
    var sourceList = [];
    var companyName = mini.get("searchCompanyName").getText();
    var courceName = mini.get("searchSourceNmae").getValue();
    var rank = mini.get("searchRank").getValue();
//    var area = mini.get("qx").getValue();
    $.ajax({
        type: 'post',
        url: '/MajorHazard/getMajorHazard',
        async: false,
        data: {companyName: companyName, sourceName: courceName, rank: rank},
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
        url: '/MajorHazard/getChemicalsInfoListBySourceId',//请求url

        clickToSelect: true,//是否启用点击选中行
        showRefresh: false,//是否显示 刷新按钮
        queryParams: function (pageReqeust) {
            pageReqeust.sourceId = sourceId;
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
