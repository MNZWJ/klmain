var headPoints = [];
var hazardList = [];
var sourceId="";
var scanHeight=0;
$(function () {
    //获取浏览器高度
    scanHeight = $(window).height();

    // $("#map").height(scanHeight);
    initMap();


    //模态窗关闭事件
    $('#myModal').on('hidden.bs.modal', function () {


    });


});

//初始化地图
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
    map.addEventListener("zoomend", onZoomChanged);
    map.setMinZoom(8);
    map.setMaxZoom(18);

    getHazardList();
    mini.get("searchRank").load("/SysDictionary/getDataDictList?typeId=" + MajorHazardRank);
    mini.get("searchCompanyName").load("/Inspection/getCompanyList");
}

//获取危险源集合
function getHazardList() {
    hazardList = [];
    $.ajax({
        type: 'post',
        async: false,
        url: '/RiskCloud/getHazardList',
        success: function (result) {
            hazardList = result;
            $.each(result, function (i, n) {
                var count = 1;
                switch (true) {
                    case n.colorFlag == "1":
                        count = 70;
                        break;
                    case n.colorFlag == "2"  :
                        count = 60;
                        break;
                    case n.colorFlag == "3"  :
                        count = 50;
                        break;
                    case n.colorFlag == "4" :
                        count = 40;
                        break;
                    default:
                        count = 5;
                        break;
                }

                var pointXY = wgs2bd_XY(parseFloat(n.lat), parseFloat(n.longt));

                headPoints.push({"lng": pointXY[0], "lat": pointXY[1], "count": count});
            });
            heatMap();

        },
        error: function () {
            alert("请求失败");
        }
    });
    return hazardList;
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

//查询企业
function searchCompanyList() {
    var searchCompanyName = mini.get("searchCompanyName").getValue();
    var searchSourceName = mini.get("searchSourceName").getValue();
    var searchRank = mini.get("searchRank").getValue();


    $.ajax({
        type: 'post',
        async: false,
        data: {
            searchCompanyName: searchCompanyName,
            searchSourceName: searchSourceName,
            searchRank: searchRank
        },
        url: '/RiskCloud/getHazardList',
        success: function (result) {
            hazardList = result;
            if (map.getZoom() >= 14) {
                loadHazard(result);
            } else {

                loadHeatMapData(result);
                heatMap();
            }


            //定位到查询到的点
            // if(result.length>0){
            //     map.panTo(new BMap.Point(result[0].longt,result[0].lat));
            // }
        },
        error: function () {
            alert("请求失败");
        }
    });

}


//清空查询条件
function clearSearch() {
    mini.get("searchCompanyName").setValue('');
    mini.get("searchSourceName").setValue('');
    mini.get("searchRank").setValue('');


}

var heatmapOverlay = null;

//展示热力图
function heatMap() {
    if (heatmapOverlay != undefined && heatmapOverlay != null) {
        map.removeOverlay(heatmapOverlay);
    }

    map.clearOverlays();
    heatmapOverlay = new BMapLib.HeatmapOverlay({"radius": 26});
    map.addOverlay(heatmapOverlay);
    heatmapOverlay.setDataSet({data: headPoints, max: 100});
}

var curZoomFlag = 7;

//缩放地图后响应事件
function onZoomChanged() {
    var curZoom = map.getZoom();
    switch (true) {
        case curZoom >= 7 && curZoom < 14 && curZoomFlag >= 14:
            loadHeatMapData(hazardList);
            heatMap();
            break;
        case curZoom >= 14 && curZoomFlag < 14:
            heatmapOverlay.hide();

            loadHazard(hazardList);
            break;
        default:

            break;
    }
    curZoomFlag = curZoom;

}

//加载重大危险源点
function loadHazard(hazardList) {
    map.clearOverlays();
    $.each(hazardList, function (i, n) {

        var tempPoint = new BMap.Point(n.longt, n.lat);
        var imageUrl = "";
        if (n.colorFlag == "1") {
            imageUrl = "../../Images/Common/红点.png";
        } else if (n.colorFlag == "2") {
            imageUrl = "../../Images/Common/橙点.png";
        } else if (n.colorFlag == "3") {
            imageUrl = "../../Images/Common/黄点.png";
        } else if (n.colorFlag == "4") {
            imageUrl = "../../Images/Common/蓝点.png";
        }
        var myIcon = new BMap.Icon(imageUrl, new BMap.Size(39, 30));

        var marker = new BMap.Marker(wgs2bd(tempPoint), {
            title: n.sourceName,
            icon: myIcon,
            offset: new BMap.Size(0, -40)
        });
        map.addOverlay(marker);
        marker.customData = {sourceId: n.sourceId, rank: n.rank, colorFlag: n.colorFlag, title: n.sourceName,conditionFlag:n.conditionFlag,protectionFlag:n.protectionFlag};

        marker.addEventListener("onclick", onMarkClick);


    });
}

//重大危险源点击事件
function onMarkClick(e) {
    sourceId = e.target.customData.sourceId;
    var rank = e.target.customData.rank;
    var colorFlag = e.target.customData.colorFlag;
    var conditionFlag=e.target.customData.conditionFlag;
    var protectionFlag=e.target.customData.protectionFlag;

    if(conditionFlag>0){
        $("#condition").attr("src","../../Images/Common/距离红.png");
    }else{
        $("#condition").attr("src","../../Images/Common/距离灰.png");
    }
    if(protectionFlag>0){
        $("#protection").attr("src","../../Images/Common/法律规定距离红.png");
    }else{
        $("#protection").attr("src","../../Images/Common/法律规定距离灰.png");
    }


    var titleColor = "";
    var sourceLevel = "";
    var sourceColor = "";
    if (colorFlag == "1") {
        titleColor = "#ed2d2d";
    } else if (colorFlag == "2") {
        titleColor = "#ff881f";
    } else if (colorFlag == "3") {
        titleColor = "#ffe01f";
    } else if (colorFlag == "4") {
        titleColor = "#0e77ab";
    }

    if (rank == SourceDangerIdOne) {
        sourceLevel = "一";
        sourceColor = "#ed2d2d";
    } else if (rank == SourceDangerIdTwo) {
        sourceLevel = "二";
        sourceColor = "#ff881f";
    } else if (rank == SourceDangerIdThree) {
        sourceLevel = "三";
        sourceColor = "#ffe01f";
    } else if (rank == SourceDangerIdFour) {
        sourceLevel = "四";
        sourceColor = "#0e77ab";
    }

    $(".myModalHeader").css("background-color", titleColor);

    $("#sourceLevel").html(sourceLevel);
    $("#sourceColor").css("background-color", sourceColor);
    $("#myModalLabel").html(e.target.customData.title);

    $.ajax({
        type: 'post',
        url: '/RiskCloud/getProcessUnitData',
        data: {sourceId: sourceId},
        success: function (result) {
            var strDiv="";
            $.each(result,function(i,n){
                var FeiLevel="";
                var FeiColor="";
                if(n.realFEI>=159){
                    FeiLevel="非常大";
                    FeiColor="#ed2d2d";
                }else if(n.realFEI>=128&&n.realFEI<=158){
                    FeiLevel="很大";
                    FeiColor="#ff881f";
                }else if(n.realFEI>=97&&n.realFEI<=127){
                    FeiLevel="中等";
                    FeiColor="#ffe01f";
                }else if(n.realFEI>=61&&n.realFEI<=96){
                    FeiLevel="较轻";
                    FeiColor="#0e77ab";
                }else if(n.realFEI<=60){
                    FeiLevel="最轻";
                    FeiColor="#fff";
                }


                strDiv+="<tr><td style='padding-left:10px;width: 49.5%;height: 100px;border: solid 1px #000;'>"+"<span>名称："+n.unitName+"</span><br/>"+"<span >火灾爆炸指数："+n.realFEI+"</span><br/>"+"<span style='background-color: "+FeiColor+"'>级别："+FeiLevel+"</span>"+"</td>"+"<td  style='width: 50%;height: 100px;border: solid 1px #000;font-size:0;'></td ></tr>"
            });
            $("#unitDiv").html(strDiv);
        },
        error:function(){
            alert("获取失败！");
        }
    });


    $('#myModal').modal('show');


}


//重新加载热力点数据
function loadHeatMapData(hazardList) {
    map.clearOverlays();

    headPoints = [];
    $.each(hazardList, function (i, n) {
        var count = 1;
        switch (true) {
            case n.colorFlag == "1":
                count = 70;
                break;
            case n.colorFlag == "2"  :
                count = 60;
                break;
            case n.colorFlag == "3"  :
                count = 50;
                break;
            case n.colorFlag == "4" :
                count = 40;
                break;
            default:
                count = 5;
                break;
        }
        var pointXY = wgs2bd_XY(parseFloat(n.lat), parseFloat(n.longt));
        headPoints.push({"lng": pointXY[0], "lat": pointXY[1], "count": count});
    });
}

//打开周边环境信息
function openCondition(){
    $("#conditionModalLabel").html("周边环境信息");
    $('#table').bootstrapTable('destroy');
    //化学品表格
    $('#table').bootstrapTable({
        height: scanHeight * 4 / 7,
        striped: true,      //是否显示行间隔色
        cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        method: 'get',//请求方式
        url: '/RiskCloud/getConditionList',//请求url

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
                },

            }
            ,

            {

                field: 'facilities',
                title: '装置设施名称',
                halign: 'center',

                cellStyle: function (value, row, index, field) {
                    return {classes: '', css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis'}};
                }
            }, {
                field: 'environment',
                title: '周边环境名称',
                halign: 'center',

                cellStyle: function (value, row, index, field) {
                    return {classes: '', css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis'}};
                }
            }, {
                field: 'realDistance',
                title: '实际距离',
                halign: 'center'

            }, {
                field: 'standardDistance',
                title: '标准要求',
                halign: 'center'

            }, {
                field: 'conformance',
                title: '与标准符合性',
                halign: 'center'

            }]
    });

    $("#conditionModal").modal('show');
}

//打开法律保护区域相关信息
function openProtection(){
    $("#conditionModalLabel").html("法律保护区与信息");
    $('#table').bootstrapTable('destroy');
    //化学品表格
    $('#table').bootstrapTable({
        height: scanHeight * 4 / 7,
        striped: true,      //是否显示行间隔色
        cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        method: 'get',//请求方式
        url: '/RiskCloud/getProtectionList',//请求url

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
                },

            }
            ,

            {

                field: 'protectArea',
                title: '法律保护区',
                halign: 'center',

                cellStyle: function (value, row, index, field) {
                    return {classes: '', css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis'}};
                }
            }, {
                field: 'environment',
                title: '周边环境说明',
                halign: 'center',

                cellStyle: function (value, row, index, field) {
                    return {classes: '', css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis'}};
                }
            }, {
                field: 'conformance',
                title: '与规定复合型',
                halign: 'center',

            }]
    });

    $("#conditionModal").modal('show');
}



