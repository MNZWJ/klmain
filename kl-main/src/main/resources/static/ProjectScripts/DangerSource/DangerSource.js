var sourceId = "";
var flagTable = 0;
var scanHeight="";
$(function () {
    //获取浏览器高度
    scanHeight = $(window).height();
    $("#map").height(scanHeight);
    initMap();

    $("#chemicalsTab").on("shown.bs.tab", function (e) {
        $('#chemistryTable').bootstrapTable("refresh");
    });

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
    if(flagTable==0){
        initTable();
        flagTable=1;
    }else {
        $("#chemistryTable").bootstrapTable("refresh",{query:{sourceId:sourceId}});
    }

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
        height: scanHeight * 4 / 7,
        striped: true,      //是否显示行间隔色
        cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        method: 'get',//请求方式
        url: '/DangerSource/getChemicalsInfoListTable',//请求url
        clickToSelect: true,//是否启用点击选中行
        showRefresh: false,//是否显示 刷新按钮
        queryParams: function (pageReqeust) {
            pageReqeust.sourceId = sourceId;

            return pageReqeust;
        },
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
                    return {classes: '', css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis','overflow': 'hidden'}};
                },
                formatter: function (value, row, index) {
                    return '<span title="'+value+'">'+value+'</span>'

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
    page = pageReqeust;
    return pageReqeust;
}

//初始化图表
function initEcharts() {

    //各行业危险源分布情况
    loadIndustryCompany();
    //加载事故等级占比
    loadSourceRank();
    //加载占比
    loadDSAccidenType();
    //加载重大危险源行政区划分布情况
    loadDSDistribution();
    //危险源数量
    getSourceCount();

}

//获取危险源数量
function getSourceCount() {
    $.ajax({
        type: 'get',
        url: '/DangerSource/getSourceCoordinate',
        async: false,
        data: {companyName: "", sourceName: "", rank: ""},
        contentType : 'application/json;charset=utf-8',
        success: function (result) {
            var countNum=result.length+'';
            while(countNum.length<6){
                countNum='0'+countNum;
            }
            $("#numOne").html(countNum[0]);
            $("#numTwo").html(countNum[1]);
            $("#numThree").html(countNum[2]);
            $("#numFour").html(countNum[3]);
            $("#numFive").html(countNum[4]);
            $("#numSix").html(countNum[5]);
        },
        error: function () {
            alert("请求失败");
        }
    });
}

var DSAccidenTypeEchart =null;
//加载可能引发的事故类型
function loadDSAccidenType(){

    $.ajax({
        type:'get',
        url:'/DangerSource/getDSAccidenType',
        contentType:'application/json;charset=utf-8',
        success:function(result){
            var legendData=[];
            var data=[];
            $.each(result,function(i,n){
                legendData.push(n['DictName']);
                data.push({value:n['num'],name:n['DictName']});
            });
            var dataStyle = {
                normal: {
                    label: {
                        show: false


                    },
                    labelLine: {
                        show: false
                    },
                    shadowBlur: 40,
                    shadowColor: 'rgba(40, 40, 40,0.5)',
                }
            };

            var option = {

                color: [ "#00544a", "#6ca748","a5a5a5"],



                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: '2%',
                    top: '30%',
                    data: legendData,
                    textStyle:{
                        color:'#fff'
                    }
                },
                series: [{
                    name: '可能引发的事故类型',
                    type: 'pie',
                    radius: ['65%', '85%'],
                    avoidLabelOverlap: false,
                    itemStyle: dataStyle,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            formatter: function(param) {
                                return param.percent.toFixed(0) + '%';
                            },
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold',
                                color:'#fff'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: true
                        }
                    },
                    data: data
                }]
            };
            DSAccidenTypeEchart =echarts.init(document.getElementById("DSAccidenTypeEchart"));
            DSAccidenTypeEchart.setOption(option);
        },
        error:function(e){
        }
    });

}


var sourceRankEchart = null;
//加载重大危险源等级占比
function loadSourceRank(){

    if(sourceRankEchart!=null){
        sourceRankEchart.dispose();
        sourceRankEchart=null;
    }
    $.ajax({
        type:'get',
        url:'/DangerSource/getSourceRankCount',
        contentType:'application/json;charset=utf-8',
        success:function(result){
            var legendData=[];
            var data=[];
            $.each(result,function(i,n){
                legendData.push(n['DictName']);
                data.push({value:n['num'],name:n['DictName']});
            });
            var dataStyle = {
                normal: {
                    label: {
                        show: false
                    },
                    labelLine: {
                        show: false
                    },
                    shadowBlur: 40,
                    shadowColor: 'rgba(40, 40, 40,0.5)',
                }
            };

            var option = {

                color: ["#ed2d2d", "#ff881f", "#ffe01f", "#0e77ab"],



                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: '2%',
                    top: '30%',
                    data: legendData,
                    textStyle:{
                        color:'#fff'
                    }
                },
                series: [{
                    name: '重大危险源等级',
                    type: 'pie',
                    radius: ['65%', '85%'],
                    avoidLabelOverlap: false,
                    itemStyle: dataStyle,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            formatter: function(param) {
                                return param.percent.toFixed(0) + '%';
                            },
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold',
                                color:'#fff'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: true
                        }
                    },
                    data: data
                }]
            };
            sourceRankEchart =echarts.init(document.getElementById("sourceRankEchart"));
            sourceRankEchart.setOption(option);
        }
    });

}

var industrySource =null;
//加载各行业重大危险源分布情况
function loadIndustryCompany(){

    if(industrySource!=null){
        industrySource.dispose();
        industrySource=null;
    }
    $.ajax({
        type: 'get',
        url: '/DangerSource/getDSIndustry',
        success: function (result) {
            var data = [];
            var legendData = [];
            $.each(result, function (i, n) {
                data.push({name: n.typeName, type: 'bar', barMaxWidth: 40, stack: n.stack, data: n.numList.split(",")});
                legendData.push(n.typeName);
            });

            $.ajax({
                type: 'get',
                url: "/SysDictionary/getDataDictList?typeId=" + IndustryCodeDictId,
                success: function (dataResult) {
                    var xData = [];
                    $.each(dataResult, function (i, n) {
                        xData.push(n.dictName);
                    });

                    var option = {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        color: ["#ed2d2d", "#ff881f", "#ffe01f", "#0e77ab", "#00544a", "#6ca748","a5a5a5"],
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
                                data: xData,
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

                                textStyle: {
                                    color: '#fff'
                                }
                            }
                        ],
                        series: data
                    };

                    industrySource = echarts.init(document.getElementById('industrySourceInfo'));
                    industrySource.setOption(option);
                }
            });


        }
    });
}


var directAreaSource =null;
//加载重大危险源行政分布情况
function loadDSDistribution(){
    if(directAreaSource!=null){
        directAreaSource.dispose();
        directAreaSource=null;
    }
    $.ajax({
        type: 'get',
        url: '/DangerSource/getDSDistribution',
        contentType:'application/json;charset=utf-8',
        success: function (result) {
            var data = [];
            var legendData = [];
            $.each(result, function (i, n) {
                data.push({name: n.typeName, type: 'bar', barMaxWidth: 40, stack: n.stack, data: n.numList.split(",")});
                legendData.push(n.typeName);
            });

            $.ajax({
                type: 'get',
                url: "/SysDictionary/getDataDictList?typeId=" + DirectAreaDictId,
                contentType:'application/json;charset=utf-8',
                success: function (dataResult) {
                    var xData = [];
                    $.each(dataResult, function (i, n) {
                        xData.push(n.dictName);
                    });

                    var option = {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        color: ["#ed2d2d", "#ff881f", "#ffe01f", "#0e77ab", "#00544a", "#6ca748","a5a5a5"],
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
                                data: xData,
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

                                textStyle: {
                                    color: '#fff'
                                }
                            }
                        ],
                        series: data
                    };

                    directAreaSource = echarts.init(document.getElementById('directAreaSourceInfo'));
                    directAreaSource.setOption(option);
                }
            });


        }
    });
}
var timeMethod="";
//打开统计图页面
function openwindows() {
    $('#echartsPage').show();
    timeMethod=setInterval(function(){
        $("#showTime").html(convert(new Date()));
    },1000);

    initEcharts();
}

//关闭统计图页面
function closePage(){
    if(timeMethod!=""){
        clearInterval(timeMethod);
    }
    $('#echartsPage').hide();
}


//转换日期格式
function convert(date) {
    var today = new Date(date);
    var month = today.getMonth() + 1 > 9 ? (today.getMonth() + 1) : "0" + (today.getMonth() + 1);
    var day = today.getDate() > 9 ? today.getDate() : "0" + today.getDate();
    var hours = today.getHours() > 9 ? today.getHours() : "0" + today.getHours();
    var minutes = today.getMinutes() > 9 ? today.getMinutes() : "0" + today.getMinutes();
    var seconds = today.getSeconds() > 9 ? today.getSeconds() : "0" + today.getSeconds();

    return today.getFullYear() + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
}

//适应页面大小
function resizePage(){
    if(DSAccidenTypeEchart!=null){
        DSAccidenTypeEchart.resize();
    }
    if(sourceRankEchart!=null){
        sourceRankEchart.resize();
    }
    if(industrySource!=null){
        industrySource.resize();
    }
    if(directAreaSource!=null){
        directAreaSource.resize();
    }

    //获取浏览器高度
    scanHeight = $(window).height();
    flagTable=0;
}