var companyId = "";
var scanHeight = "";
$(function () {
    //获取浏览器高度
    scanHeight = $(window).height();

    $("#map").height(scanHeight);
    initMap();

    $("#myTabDrop1").on("shown.bs.tab", function (e) {
        $('#riskTable').bootstrapTable("refresh");
    });

    $("#chemicalsTab").on("shown.bs.tab", function (e) {
        $('#chemistryTable').bootstrapTable("refresh");
    });

    $("#companyArt").on("shown.bs.tab", function (e) {
        $('#companyArtTable').bootstrapTable("refresh");
    });

    initTable();
    //模态窗关闭事件
    $('#myModal').on('hidden.bs.modal', function () {
        $('#myTab a[href="#companyInfo"]').tab('show')
    });

    //initEcharts();


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
    mini.get("searchTypeCode").load("/SysDictionary/getDataDictList?typeId=" + TypeCodeDictId);
}

//初始化表格
function initTable() {
    //化学品表格
    $('#chemistryTable').bootstrapTable({
        height: scanHeight * 4 / 7,
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
        height: scanHeight * 4 / 7,
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

    //危险关联工艺
    $('#companyArtTable').bootstrapTable({
        height: scanHeight * 4 / 7,
        striped: true,      //是否显示行间隔色
        cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        method: 'get',//请求方式
        url: '/Inspection/getCompanyArtList',//请求url

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
        var marker = new BMap.Marker(wgs2bd(tempPoint), {
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
    var searchTypeCode = mini.get("searchTypeCode").getValue();

    $.ajax({
        type: 'post',
        async: false,
        data: {
            searchCompanyName: searchCompanyName,
            searchIndustryCode: searchIndustryCode,
            searchScaleCode: searchScaleCode,
            searchTypeCode: searchTypeCode
        },
        url: '/Inspection/getCompanyList',
        success: function (result) {
            loadCompanyList(result);
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
    mini.get("searchIndustryCode").setValue('');
    mini.get("searchScaleCode").setValue('');
    mini.get("searchTypeCode").setValue('');

}

//初始化图表
function initEcharts() {
    $.ajax({
       type:'post',
       url:'/Inspection/getIndustryCompanyInfo',
        success:function(result){
            var data=[];
            var legendData=[];
            $.each(result,function(i,n){
               data.push({name:n.typeName,type:'bar',barMaxWidth:40,stack:n.stack,data:n.numList.split(",")});
                legendData.push(n.typeName);
            });

            var option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                color: ["#ad382c", "#ef8938", "#dfb728", "#204c8f","#00544a", "#6ca748"],
                legend: {
                    data: legendData,
                    textStyle: {
                        color: '#fff',
                        fontSize: 20
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '10%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: ["氯碱工业", "石油和天然气开采", "化学矿山", "合成氨工业"],
                        axisLabel: {
                            textStyle: {
                                color: '#fff',
                                fontSize: 20
                            }
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            textStyle: {
                                color: '#fff',
                                fontSize: 20
                            }
                        }
                    }
                ],
                dataZoom: [
                    {
                        show: "true",
                        start: 0,
                        end: 100,

                        textStyle:{
                            color:'#fff'
                        }
                    }
                ],
                series: data
            };

            var myChart = echarts.init(document.getElementById('industryCompanyInfo'));
            myChart.setOption(option);

        }
    });


}
