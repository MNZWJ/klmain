var headPoints = [];
var hazardList=[];
$(function () {
    //获取浏览器高度
    scanHeight = $(window).height();

    $("#map").height(scanHeight);
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
                    case n.rank == SourceDangerIdOne:
                        count = 70;
                        break;
                    case n.rank == SourceDangerIdTwo  :
                        count = 60;
                        break;
                    case n.rank == SourceDangerIdThree  :
                        count = 50;
                        break;
                    case n.rank == SourceDangerIdFour :
                        count = 40;
                        break;
                    default:
                        count = 5;
                        break;
                }

                var pointXY=wgs2bd_XY(parseFloat(n.lat) ,parseFloat(n.longt));

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
            hazardList=result;
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
    mini.get("searchRankHidden").setValue('');

}
var heatmapOverlay=null;
//展示热力图
function heatMap() {
    if(heatmapOverlay!=undefined&&heatmapOverlay!=null){
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
        if (n.rank == SourceDangerIdOne) {
            imageUrl = "../../Images/Common/红点.png";
        } else if (n.rank == SourceDangerIdTwo) {
            imageUrl = "../../Images/Common/橙点.png";
        } else if (n.rank == SourceDangerIdThree) {
            imageUrl = "../../Images/Common/黄点.png";
        } else if (n.rank == SourceDangerIdFour) {
            imageUrl = "../../Images/Common/蓝点.png";
        }
        var myIcon = new BMap.Icon(imageUrl, new BMap.Size(39, 30));

        var marker = new BMap.Marker(wgs2bd(tempPoint), {
            title: n.sourceName,
            icon: myIcon,
            offset: new BMap.Size(0, -40)
        });
        map.addOverlay(marker);
        marker.customData = {sourceId: n.sourceId,rank:n.rank};
        // if (hazardList[i].Rank == "1") {
        //
        //     marker.addEventListener("onclick", onRedMarkClick);
        // } else if (hazardList[i].Rank == "2") {
        //
        //     marker.addEventListener("onclick", onOrganMarkClick);
        // } else if (hazardList[i].Rank == "3") {
        //
        //     marker.addEventListener("onclick", onYellowMarkClick);
        // } else if (hazardList[i].Rank == "4") {
        //
        //     marker.addEventListener("onclick", onBlueMarkClick);
        // }


    });
}

//重新加载热力点数据
function loadHeatMapData(hazardList) {
    map.clearOverlays();

    headPoints=[];
    $.each(hazardList, function (i, n) {
        var count = 1;
        switch (true) {
            case n.rank == SourceDangerIdOne:
                count = 70;
                break;
            case n.rank == SourceDangerIdTwo  :
                count = 60;
                break;
            case n.rank == SourceDangerIdThree  :
                count = 50;
                break;
            case n.rank == SourceDangerIdFour :
                count = 40;
                break;
            default:
                count = 5;
                break;
        }
        var pointXY=wgs2bd_XY(parseFloat(n.lat),parseFloat(n.longt));
        headPoints.push({"lng": pointXY[0], "lat": pointXY[1], "count": count});
    });
}






