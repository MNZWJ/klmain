var companyId = "";
$(function () {
    //获取浏览器高度
    var scanHeight = $(window).height();

    $("#map").height(scanHeight - 8);
    initMap();

    $("#myTabDrop1").on("shown.bs.tab", function (e) {
        $('#riskTable').bootstrapTable("refresh");
    });

    $("#chemicalsTab").on("shown.bs.tab", function (e) {
        $('#chemistryTable').bootstrapTable("refresh");
    });

    initTable();
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


    loadCompanyList(getCompanyList());
    mini.get("searchIndustryCode").load("/SysDictionary/getDataDictList?typeId=" + IndustryCodeDictId);
    mini.get("searchScaleCode").load("/SysDictionary/getDataDictList?typeId=" + ScaleCodeDictId);

}

//初始化表格
function initTable(){
    //化学品表格
    $('#chemistryTable').bootstrapTable({
        height: 'auto',
        striped: true,      //是否显示行间隔色
        cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        method: 'get',//请求方式
        url: '/Inspection/getChemicalsInfoList',//请求url

        clickToSelect: true,//是否启用点击选中行
        showRefresh: false,//是否显示 刷新按钮
        queryParams: function (pageReqeust) {
            pageReqeust.companyId = companyId;

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

    //危险源表格
    $('#riskTable').bootstrapTable({
        height: 'auto',
        striped: true,      //是否显示行间隔色
        cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        method: 'get',//请求方式
        url: '/Inspection/getDangerSourceList',//请求url

        clickToSelect: true,//是否启用点击选中行
        showRefresh: false,//是否显示 刷新按钮
        queryParams: function (pageReqeust) {
            pageReqeust.companyId = companyId;

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

//加载所有企业集合
function loadCompanyList(companyList) {
    map.clearOverlays();
    $.each(companyList, function (i, n) {
        var tempPoint = new BMap.Point(n.longt, n.lat);
        var marker = new BMap.Marker(tempPoint, {
            title: n.companyName

        });

        map.addOverlay(marker);
        marker.customData = {companyId: n.companyId};
        marker.addEventListener("onclick", onMarkClick);
    });

}

//企业点击事件
function onMarkClick(e) {
    companyId = e.target.customData.companyId;

    $.ajax({
        type: 'post',
        url: '/Inspection/getCompanyInfo',
        data: {companyId: companyId},
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
    var searchIndustryCode = mini.get("searchIndustryCode").getValue();
    var searchScaleCode = mini.get("searchScaleCode").getValue();


    $.ajax({
        type: 'post',
        async: false,
        data: {
            searchCompanyName: searchCompanyName,
            searchIndustryCode: searchIndustryCode,
            searchScaleCode: searchScaleCode
        },
        url: '/Inspection/getCompanyList',
        success: function (result) {
            loadCompanyList(result);
        },
        error: function () {
            alert("请求失败");
        }
    });

}


//清空查询条件
function clearSearch() {
    mini.get("searchCompanyName").setValue('');
    mini.get("searchIndustryCode").setValue('');
    mini.get("searchScaleCode").setValue('');
    mini.get("startDate").setValue('');
    mini.get("endDate").setValue('');
}
