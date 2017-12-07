var sourceId = "";
$(function () {
    //获取浏览器高度
    var scanHeight = $(window).height();

    $("#map").height(scanHeight - 8);
    initMap();


    //化学品表格
    $('#hiddenRiskTable').bootstrapTable({
        // height: scanHeight *4/7,
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
                    return {classes: '', css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis','overflow': 'hidden'}};
                }
            }, {
                field: 'hiddenDanager',
                title: '隐患描述',
                halign: 'center',
                width: '200px',
                cellStyle: function (value, row, index, field) {
                    return {classes: '', css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis','overflow': 'hidden'}};
                },
                formatter: function (value, row, index) {
                   return '<span title="'+value+'">'+value+'</span>'

                }
            }, {
                field: 'area',
                title: '行政区划',
                halign: 'center',
                width: '120px',
                cellStyle: function (value, row, index, field) {
                    return {classes: '', css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis','overflow': 'hidden'}};
                }
            }, {
                field: 'industry',
                title: '行业分类',
                halign: 'center',
                width: '120px',
                cellStyle: function (value, row, index, field) {
                    return {classes: '', css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis','overflow': 'hidden'}};
                }
            }, {
                field: 'superviseDept',
                title: '隐患监管部门',
                halign: 'center',
                width: '140px',
                cellStyle: function (value, row, index, field) {
                    return {classes: '', css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis','overflow': 'hidden'}};
                }
            }, {
                field: 'source',
                title: '隐患类别',
                halign: 'center',
                width: '100px',
                cellStyle: function (value, row, index, field) {
                    return {classes: '', css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis','overflow': 'hidden'}};
                }
            }, {
                field: 'rank',
                title: '隐患级别',
                halign: 'center',
                width: '100px',
                cellStyle: function (value, row, index, field) {
                    return {classes: '', css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis','overflow': 'hidden'}};
                }
            }, {
                field: 'upReportDate',
                title: '上报日期',
                halign: 'center',
                width: '100px',
                cellStyle: function (value, row, index, field) {
                    return {classes: '', css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis','overflow': 'hidden'}};
                }
            }, {
                field: 'reformTerm',
                title: '整改期限',
                halign: 'center',
                width: '100px',
                cellStyle: function (value, row, index, field) {
                    return {classes: '', css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis','overflow': 'hidden'}};
                }
            }, {
                field: 'rectification',
                title: '整改情况',
                halign: 'center',
                width: '100px',
                cellStyle: function (value, row, index, field) {
                    return {classes: '', css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis','overflow': 'hidden'}};
                }
            }
            ]
    });



    //模态窗关闭事件
    $('#myModal').on('hidden.bs.modal', function () {
        $('#myTab a[href="#companyInfo"]').tab('show')
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
    map.setMinZoom(8);
    map.setMaxZoom(18);


    loadHazardList(getHazardList());
    mini.get("searchRank").load("/SysDictionary/getDataDictList?typeId=" + MajorHazardRank);
    mini.get("searchCompanyName").load("/Inspection/getCompanyList");
}


//获取危险源集合
function getHazardList() {
    var hazardList = [];
    $.ajax({
        type: 'post',
        async: false,
        url: '/HiddenAccident/getHazardList',
        success: function (result) {
            hazardList = result;

        },
        error: function () {
            alert("请求失败");
        }
    });
    return hazardList;
}

//加载所有危险源集合
function loadHazardList(hazardList) {
    map.clearOverlays();
    $.each(hazardList, function (i, n) {
        var tempPoint = new BMap.Point(n.longt, n.lat);
        var marker = new BMap.Marker(wgs2bd(tempPoint), {
            title: n.sourceName

        });

        map.addOverlay(marker);
        marker.customData = {sourceId: n.sourceId};
        marker.addEventListener("onclick", onMarkClick);
    });

}

//危险源点击事件
function onMarkClick(e) {
    sourceId = e.target.customData.sourceId;
    $('#myModal').modal('show');
    $('#hiddenRiskTable').bootstrapTable("refresh");


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
    var searchRankHidden = mini.get("searchRankHidden").getValue('');

    $.ajax({
        type: 'post',
        async: false,
        data: {
            searchCompanyName: searchCompanyName,
            searchSourceName: searchSourceName,
            searchRank: searchRank,
            searchRankHidden:searchRankHidden
        },
        url: '/HiddenAccident/getHazardList',
        success: function (result) {
            loadHazardList(result);
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