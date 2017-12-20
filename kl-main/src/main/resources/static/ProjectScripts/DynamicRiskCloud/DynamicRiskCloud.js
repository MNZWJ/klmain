var headPoints = [];
var hazardList = [];
var sourceId = "";
var scanHeight = 0;
//判断是否初始化表格
var tableFlag=0;
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
    map.setMinZoom(11);
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
        url: '/DynamicRiskCloud/getHazardList',
        success: function (result) {
            hazardList = result;
            $.each(result, function (i, n) {
                var count = 1;
                switch (true) {
                    case n.colorFlag == "1":
                        count = 100;
                        break;
                    case n.colorFlag == "2"  :
                        count = 60;
                        break;
                    case n.colorFlag == "3"  :
                        count = 40;
                        break;
                    case n.colorFlag == "4" :
                        count = 30;
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

function openOrclose() {


//关闭查询框
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
        url: '/DynamicRiskCloud/getHazardList',
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
            title: n.companyName+"\n"+n.sourceName,
            icon: myIcon,
            offset: new BMap.Size(0, -40)
        });
        map.addOverlay(marker);
        marker.customData = {
            sourceId: n.sourceId,
            riskWarn: n.riskWarn,
            colorFlag: n.colorFlag,
            title: n.sourceName,
            generalHidden: n.generalHidden,
            majorHidden: n.majorHidden
        };

        marker.addEventListener("onclick", onMarkClick);


    });
}

//重大危险源点击事件
function onMarkClick(e) {
    sourceId = e.target.customData.sourceId;
    var riskWarn = e.target.customData.riskWarn;
    var colorFlag = e.target.customData.colorFlag;
    var generalHidden = e.target.customData.generalHidden;
    var majorHidden = e.target.customData.majorHidden;


    var titleColor = "";
    var riskLevel = "";
    var riskColor = "";
    if (colorFlag == "1") {
        titleColor = "#ed2d2d";
    } else if (colorFlag == "2") {
        titleColor = "#ff881f";
    } else if (colorFlag == "3") {
        titleColor = "#ffe01f";
    } else if (colorFlag == "4") {
        titleColor = "#0e77ab";
    }

    if (parseInt(majorHidden) > 0) {
        riskLevel = "重大";
        riskColor = "#ed2d2d";
    } else if (parseInt(generalHidden) > 0) {
        riskLevel = "一般";
        riskColor = "#ff881f";
    } else {
        riskLevel = "无未";
        riskColor = "#ffe01f";
    }

    $(".myModalHeader").css("background-color", titleColor);

    $("#sourceLevel").html(riskLevel);
    $("#sourceColor").css("background-color", riskColor);
    $("#myModalLabel").html(e.target.customData.title);

    $.ajax({
        type: 'post',
        url: '/DynamicRiskCloud/getProcessUnitData',
        data: {sourceId: sourceId},
        success: function (result) {
            var strDiv = "";
            $.each(result, function (i, n) {
                var riskType = "无报警";
                var imgUrl = "../../Images/Common/气体检测.png";
                if (parseInt(n.qiti) > 0) {
                    riskType = "有毒气、可燃气体报警";
                    imgUrl = "../../Images/Common/气体检测报警.png";
                }


                strDiv += "<tr><td style='padding-left:10px;width: 49.5%;height: 100px;border: solid 1px #000;'>" + "<span>名称：" + n.UnitName + "</span><br/>" + "<span >有毒气、可燃气体报警<img style='width: 40px;height: 40px;margin-left: 10px;' src='" + imgUrl + "'></span>" + "</td>" + "<td  style='width: 50%;height: 100px;border: solid 1px #000;font-size:0;'></td ></tr>"
            });
            $("#unitDiv").html(strDiv);
        },
        error: function () {
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
                count = 100;
                break;
            case n.colorFlag == "2"  :
                count = 60;
                break;
            case n.colorFlag == "3"  :
                count = 40;
                break;
            case n.colorFlag == "4" :
                count = 30;
                break;
            default:
                count = 5;
                break;
        }
        var pointXY = wgs2bd_XY(parseFloat(n.lat), parseFloat(n.longt));
        headPoints.push({"lng": pointXY[0], "lat": pointXY[1], "count": count});
    });
}

//初始化表格
function initTable() {

    $("#hiddenRiskTable").bootstrapTable("destroy");
    //化学品表格
    $('#hiddenRiskTable').bootstrapTable({
        height: scanHeight * 4 / 7,
        striped: true,      //是否显示行间隔色
        cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        method: 'get',//请求方式
        url: '/HiddenAccident/getHiddenInfo',//请求url
        pagination: 'true',//显示分页条
        paginationLoop: 'true',//启用分页条无限循环功能
        pageNumber: 1,                       //初始化加载第一页，默认第一页
        pageSize: 5,                       //每页的记录行数（*）
        pageList: [5, 10, 15, 20],        //可供选择的每页的行数（*）
        sidePagination: 'server',//'server'或'client'服务器端分页
        queryParamsType: '', //默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort
        // 设置为 ''  在这种情况下传给服务器的参数为：pageSize,pageNumber
        clickToSelect: true,//是否启用点击选中行
        showRefresh: false,//是否显示 刷新按钮
        queryParams: function (pageReqeust) {
            pageReqeust.sourceId = sourceId;
            pageReqeust.searchName = "";
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
                    var page = $('#hiddenRiskTable').bootstrapTable('getOptions');
                    return (page.pageNumber - 1) * page.pageSize + index + 1;

                },
                width: '80px'
            }
            ,

            {

                field: 'companyName',
                title: '公司名称',
                halign: 'center',
                width: '180px',
                cellStyle: function (value, row, index, field) {
                    return {
                        classes: '',
                        css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis', 'overflow': 'hidden'}
                    };
                },
                formatter: function (value, row, index) {
                    return '<span title="' + value + '">' + value + '</span>'

                }
            }, {
                field: 'hiddenDanager',
                title: '隐患描述',
                halign: 'center',
                width: '200px',
                cellStyle: function (value, row, index, field) {
                    return {
                        classes: '',
                        css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis', 'overflow': 'hidden'}
                    };
                },
                formatter: function (value, row, index) {
                    return '<span title="' + value + '">' + value + '</span>'

                }
            }, {
                field: 'area',
                title: '行政区划',
                halign: 'center',
                width: '120px',
                cellStyle: function (value, row, index, field) {
                    return {
                        classes: '',
                        css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis', 'overflow': 'hidden'}
                    };
                },
                formatter: function (value, row, index) {
                    return '<span title="' + value + '">' + value + '</span>'

                }
            }, {
                field: 'industry',
                title: '行业分类',
                halign: 'center',
                width: '120px',
                cellStyle: function (value, row, index, field) {
                    return {
                        classes: '',
                        css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis', 'overflow': 'hidden'}
                    };
                },
                formatter: function (value, row, index) {
                    return '<span title="' + value + '">' + value + '</span>'

                }
            }, {
                field: 'superviseDept',
                title: '隐患监管部门',
                halign: 'center',
                width: '140px',
                cellStyle: function (value, row, index, field) {
                    return {
                        classes: '',
                        css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis', 'overflow': 'hidden'}
                    };
                },
                formatter: function (value, row, index) {
                    return '<span title="' + value + '">' + value + '</span>'

                }
            }, {
                field: 'source',
                title: '隐患类别',
                halign: 'center',
                width: '100px',
                cellStyle: function (value, row, index, field) {
                    return {
                        classes: '',
                        css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis', 'overflow': 'hidden'}
                    };
                },
                formatter: function (value, row, index) {
                    return '<span title="' + value + '">' + value + '</span>'

                }
            }, {
                field: 'rank',
                title: '隐患级别',
                halign: 'center',
                width: '100px',
                cellStyle: function (value, row, index, field) {
                    return {
                        classes: '',
                        css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis', 'overflow': 'hidden'}
                    };
                },
                formatter: function (value, row, index) {
                    return '<span title="' + value + '">' + value + '</span>'

                }
            }, {
                field: 'upReportDate',
                title: '上报日期',
                halign: 'center',
                width: '100px',
                cellStyle: function (value, row, index, field) {
                    return {
                        classes: '',
                        css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis', 'overflow': 'hidden'}
                    };
                },
                formatter: function (value, row, index) {
                    return '<span title="' + value + '">' + value + '</span>'

                }
            }, {
                field: 'reformTerm',
                title: '整改期限',
                halign: 'center',
                width: '100px',
                cellStyle: function (value, row, index, field) {
                    return {
                        classes: '',
                        css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis', 'overflow': 'hidden'}
                    };
                },
                formatter: function (value, row, index) {
                    return '<span title="' + value + '">' + value + '</span>'

                }
            }, {
                field: 'rectification',
                title: '整改情况',
                halign: 'center',
                width: '100px',
                cellStyle: function (value, row, index, field) {
                    return {
                        classes: '',
                        css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis', 'overflow': 'hidden'}
                    };
                },
                formatter: function (value, row, index) {
                    return '<span title="' + value + '">' + value + '</span>'

                }
            }
        ]
    });

}

//查看事故隐患
function showTable() {
    $("#hiddenAccidentModal").modal("show");
    if(tableFlag==0){
        initTable();
        tableFlag=1;
    }else if(tableFlag==1){
        $("#hiddenRiskTable").bootstrapTable("refresh");
    }

}


//适应页面大小
function resizePage(){


    //获取浏览器高度
    scanHeight = $(window).height();

    tableFlag=0;

}




