var companyId = "";
var scanHeight = "";
var flagTable=0;
$(function () {
    //获取浏览器高度
    scanHeight = $(window).height();

    // $("#map").height(scanHeight);
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
    map.setMinZoom(11);
    map.setMaxZoom(18);


    loadCompanyList(getCompanyList());
    mini.get("searchIndustryCode").load("/SysDictionary/getDataDictList?typeId=" + IndustryCodeDictId);
    mini.get("searchScaleCode").load("/SysDictionary/getDataDictList?typeId=" + ScaleCodeDictId);
    mini.get("searchTypeCode").load("/SysDictionary/getDataDictList?typeId=" + TypeCodeDictId);
}

//初始化表格
function initTable() {
    $("#chemistryTable").bootstrapTable("destroy");
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
                },
                width: '14%'
            }
            ,

            {

                field: 'chemName',
                title: '化学品名称',
                halign: 'center',
                width: '28%',
                cellStyle: function (value, row, index, field) {
                    return {classes: '', css:  {'white-space': 'nowrap', 'text-overflow': 'ellipsis','overflow': 'hidden'}};
                }
            }, {
                field: 'cAS',
                title: 'CAS',
                halign: 'center',
                width: '21%',
                cellStyle: function (value, row, index, field) {
                    return {classes: '', css:  {'white-space': 'nowrap', 'text-overflow': 'ellipsis','overflow': 'hidden'}};
                },
                formatter: function (value, row, index) {
                    if(value==undefined){
                        value="";
                    }
                    return '<span title="'+value+'">'+value+'</span>'

                }
            }, {
                field: 'dreserves',
                title: '设计储量',
                halign: 'center',
                width: '21%',
                cellStyle: function (value, row, index, field) {
                    return {classes: '', css:  {'white-space': 'nowrap', 'text-overflow': 'ellipsis','overflow': 'hidden'}};
                },
                formatter: function (value, row, index) {
                    if(value==undefined){
                        value="";
                    }
                    return '<span title="'+value+'">'+value+'</span>'

                }
            }, {
                field: 'unit',
                title: '计量单位',
                halign: 'center',
                width: '16%',
                cellStyle: function (value, row, index, field) {
                    return {classes: '', css:  {'white-space': 'nowrap', 'text-overflow': 'ellipsis','overflow': 'hidden'}};
                },
                formatter: function (value, row, index) {
                    if(value==undefined){
                        value="";
                    }
                    return '<span title="'+value+'">'+value+'</span>'

                }
            }
]
    });
    $("#riskTable").bootstrapTable("destroy");
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
                },
                width: '10%',
            }
            ,

            {

                field: 'sourceName',
                title: '危险源名称',
                halign: 'center',
                width: '30%',
                cellStyle: function (value, row, index, field) {
                    return {classes: '', css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis','overflow': 'hidden'}};
                },
                formatter: function (value, row, index) {
                    if(value==undefined){
                        value="";
                    }
                    return '<span title="'+value+'">'+value+'</span>'

                }
            }, {
                field: 'rank',
                title: '危险源等级',
                halign: 'center',
                width: '20%',
                align: 'center',
                cellStyle: function (value, row, index, field) {
                    return {classes: '', css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis','overflow': 'hidden'}};
                },
                formatter: function (value, row, index) {
                    if(value==undefined){
                        value="";
                    }
                    return '<span title="'+value+'">'+value+'</span>'

                }
            }, {
                field: 'OutPersonCount',
                title: '500米范围内人数估值',
                halign: 'center',
                width: '25%',
                cellStyle: function (value, row, index, field) {
                    return {classes: '', css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis','overflow': 'hidden'}};
                },
                formatter: function (value, row, index) {
                    if(value==undefined){
                        value="";
                    }
                    return '<span title="'+value+'">'+value+'</span>'

                }

            }, {
                field: 'recordDate',
                title: '投用时间',
                halign: 'center',
                width: '15%',
                cellStyle: function (value, row, index, field) {
                    return {classes: '', css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis','overflow': 'hidden'}};
                },
                formatter: function (value, row, index) {
                    if(value==undefined){
                        value="";
                    }
                    return '<span title="'+value+'">'+value+'</span>'

                }

            }]
    });
    $("#companyArtTable").bootstrapTable("destroy");
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
                },
                width: '10%',
            }
            ,

            {

                field: 'technologyName',
                title: '工艺名称',
                halign: 'center',
                width: '40%',
                cellStyle: function (value, row, index, field) {
                    return {classes: '', css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis'}};
                },
                formatter: function (value, row, index) {
                    if(value==undefined){
                        value="";
                    }
                    return '<span title="'+value+'">'+value+'</span>'

                }
            }, {
                field: 'monitorUnit',
                title: '重点监控单元',
                halign: 'center',
                width: '50%',
                cellStyle: function (value, row, index, field) {
                    return {classes: '', css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis'}};
                },
                formatter: function (value, row, index) {
                    if(value==undefined){
                        value="";
                    }
                    return '<span title="'+value+'">'+value+'</span>'

                }
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
            var countNum=companyList.length+'';
            while(countNum.length<6){
                countNum='0'+countNum;
            }
            $("#numOne").html(countNum[0]);
            $("#numTwo").html(countNum[1]);
            $("#numThree").html(countNum[2]);
            $("#numFour").html(countNum[3]);
            $("#numFive").html(countNum[4]);
            $("#numSix").html(countNum[5]);

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
    if(flagTable==0){
        initTable();
        flagTable=1;
    }

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

    //各行业企业分布情况
    loadIndustryCompany();
    //加载企业类型占比
    loadCompanyType();
    //加载企业规模占比
    loadScaleCode();
    //加载企业行政区划分布情况
    loadDirectAreaCompany();

}

var scaleCodeChart=null;
var scaleCodeOption=null;
//加载企业规模占比
function loadScaleCode(){

    if(scaleCodeChart!=null){
        scaleCodeChart.dispose();
        scaleCodeChart=null;
    }
    $.ajax({
        type:'post',
        url:'/Inspection/getScaleCodeData',
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
                        show: true,
                        postion:'innner'
                    },
                    labelLine: {
                        show: true
                    },
                    shadowBlur: 40,
                    shadowColor: 'rgba(40, 40, 40,0.5)',
                }
            };

            scaleCodeOption = {

                color: ['#fbf31f', '#ef8938','#ffe01f','#22529b'],



                tooltip: {
                    trigger: 'item',
                    formatter: "{b}: {c} ({d}%)"
                },
                // legend: {
                //     orient: 'vertical',
                //     x: '2%',
                //     top: '20%',
                //     data: legendData,
                //     textStyle:{
                //         color:'#fff'
                //     }
                // },
                series: [{
                    name: '企业类型占比',
                    type: 'pie',
                    //radius: ['65%', '85%'],
                    avoidLabelOverlap: false,
                    itemStyle: dataStyle,
                    // label: {
                    //     normal: {
                    //         show: false,
                    //         position: 'center'
                    //     },
                    //     emphasis: {
                    //         show: true,
                    //         formatter: function(param) {
                    //             return param.percent.toFixed(0) + '%';
                    //         },
                    //         textStyle: {
                    //             fontSize: '30',
                    //             fontWeight: 'bold',
                    //             color:'#fff'
                    //         }
                    //     }
                    // },
                    // labelLine: {
                    //     normal: {
                    //         show: true
                    //     }
                    // },
                    data: data
                }]
            }

            // scaleCodeOption = {
            //
            //     color: ['#fbf31f', '#ef8938','#24ffb5','#22529b'],
            //
            //
            //
            //     tooltip: {
            //         trigger: 'item',
            //         formatter: "{a} <br/>{b}: {c} ({d}%)"
            //     },
            //     legend: {
            //         orient: 'vertical',
            //         x: '2%',
            //         top: '30%',
            //         data: legendData,
            //         textStyle:{
            //             color:'#fff'
            //         }
            //     },
            //     series: [{
            //         name: '企业规模占比',
            //         type: 'pie',
            //         radius: ['65%', '85%'],
            //         avoidLabelOverlap: false,
            //         itemStyle: dataStyle,
            //         label: {
            //             normal: {
            //                 show: false,
            //                 position: 'center'
            //             },
            //             emphasis: {
            //                 show: true,
            //                 formatter: function(param) {
            //                     return param.percent.toFixed(0) + '%';
            //                 },
            //                 textStyle: {
            //                     fontSize: '30',
            //                     fontWeight: 'bold',
            //                     color:'#fff'
            //                 }
            //             }
            //         },
            //         labelLine: {
            //             normal: {
            //                 show: true
            //             }
            //         },
            //         data: data
            //     }]
            // };
            scaleCodeChart =echarts.init(document.getElementById("scaleCodeEchart"));
            scaleCodeChart.setOption(scaleCodeOption);
        }
    });

}


var companyTypeChart=null;
var companyTypeOption=null;
//加载企业类型占比
function loadCompanyType(){

    if(companyTypeChart!=null){
        companyTypeChart.dispose();
        companyTypeChart=null;
    }

    $.ajax({
        type:'post',
        url:'/Inspection/getCompanyTypeData',
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
                        show: true
                    },
                    labelLine: {
                        show: true
                    },
                    shadowBlur: 40,
                    shadowColor: 'rgba(40, 40, 40,0.5)',
                }
            };

            companyTypeOption = {

                color: ["#ed2d2d", "#ff881f", "#ffe01f", "#0e77ab"],



                tooltip: {
                    trigger: 'item',
                    formatter: "{b}: {c} ({d}%)"
                },
                // legend: {
                //     orient: 'vertical',
                //     x: '2%',
                //     top: '20%',
                //     data: legendData,
                //     textStyle:{
                //         color:'#fff'
                //     }
                // },
                series: [{
                    name: '企业类型占比',
                    type: 'pie',
                    //radius: ['65%', '85%'],
                    avoidLabelOverlap: false,
                    itemStyle: dataStyle,
                    // label: {
                    //     normal: {
                    //         show: false,
                    //         position: 'center'
                    //     },
                    //     emphasis: {
                    //         show: true,
                    //         formatter: function(param) {
                    //             return param.percent.toFixed(0) + '%';
                    //         },
                    //         textStyle: {
                    //             fontSize: '30',
                    //             fontWeight: 'bold',
                    //             color:'#fff'
                    //         }
                    //     }
                    // },
                    // labelLine: {
                    //     normal: {
                    //         show: true
                    //     }
                    // },
                    data: data
                }]
            };


            companyTypeChart =echarts.init(document.getElementById("companyTypeEchart"));
            companyTypeChart.setOption(companyTypeOption);
        }
    });

}

var industryCompanyCharts=null;

var industryCompanyOption=null;
//加载各行业企业分布情况
function loadIndustryCompany(){
    if(industryCompanyCharts!=null){
        industryCompanyCharts.dispose();
        industryCompanyCharts=null;
    }
    $.ajax({
        type: 'post',
        url: '/Inspection/getIndustryCompanyInfo',
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

                    industryCompanyOption = {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        color: ["#ad382c", "#ef8938", "#dfb728", "#204c8f", "#00544a", "#6ca748"],
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
                                        fontSize: 18
                                    }
                                },

                                axisLine:{
                                    lineStyle:{
                                        color:'#fff'
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
                                        fontSize: 18
                                    }
                                },
                                minInterval: 1,
                                axisLine:{
                                    lineStyle:{
                                        color:'#fff'
                                    }
                                }
                            }
                        ],
                        dataZoom: [
                            {
                                type:'inside',

                            },
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

                    industryCompanyCharts = echarts.init(document.getElementById('industryCompanyInfo'));
                    industryCompanyCharts.setOption(industryCompanyOption);
                }
            });


        }
    });
}

var directAreaCompanyChart=null;
var directAreaCompanyOption=null;
//加载各行业行政分布情况
function loadDirectAreaCompany(){
    if(directAreaCompanyChart!=null){
        directAreaCompanyChart.dispose();
        directAreaCompanyChart=null;
    }

    $.ajax({
        type: 'post',
        url: '/Inspection/getCompanyDirectAirData',
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
                success: function (dataResult) {
                    var xData = [];
                    $.each(dataResult, function (i, n) {
                        xData.push(n.dictName);
                    });

                    directAreaCompanyOption = {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        color: ["#ad382c", "#ef8938", "#dfb728", "#204c8f", "#00544a", "#6ca748"],
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
                                },
                                axisLine:{
                                    lineStyle:{
                                        color:'#fff'
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
                                },
                                axisLine:{
                                    lineStyle:{
                                        color:'#fff'
                                    }
                                }
                            }
                        ],
                        dataZoom: [
                            {
                                type:'inside',

                            },
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

                    directAreaCompanyChart = echarts.init(document.getElementById('directAreaCompanyInfo'));
                    directAreaCompanyChart.setOption(directAreaCompanyOption);
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
    if(scaleCodeChart!=null){
        scaleCodeChart.resize();
    }
    if(companyTypeChart!=null){
        companyTypeChart.resize();
    }
    if(industryCompanyCharts!=null){
        industryCompanyCharts.resize();
    }
    if(directAreaCompanyChart!=null){
        directAreaCompanyChart.resize();
    }

    //获取浏览器高度
    scanHeight = $(window).height();
    flagTable=0;
}

