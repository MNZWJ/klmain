var scanHeight = 0;
var staticIndustryStr = "";
$(function () {

    //获取浏览器高度
    scanHeight = $(window).height();
    $("#fullDiv").height(scanHeight + 'px');
    loadEcharts();
});

//加载echarts图
function loadEcharts(){
    loadCompanyType();
    //加载各行业企业分布情况
    loadIndustryCompany();
    //月度报警类型统计
    loadAlarmTypeMonthEchart();
    //本月行政区域报警情况统计
    loadAreaAlarmEchart();
    //本月行业报警统计
    loadIndustryAlarmEchart();

    //加载重大危险源等级占比
    loadSourceRank();
    /**近五年重大危险源数量统计*/
    loadfiveYearCountEchart();
    //加载占比
    rankMenu();

    //加载企业和重大危险源数量
    loadCompanyNum();

}

//加载企业和重大危险源数量
function loadCompanyNum(){
    $.ajax({
       type:'post',
       url:'/Inspection/getCompanyNum' ,
        success:function(result){
            $("#companyNum").html(result[0]["companyNum"]+"家");
            $("#DangerousNum").html(result[0]["dangerSourceNum"]+"个");
        }
    });
}


var DSAccidenTypeEchart =null;
//加载可能引发的事故类型
function loadDSAccidenType(rank){
    $("#defaultRank").html(rank.innerHTML);
    $.ajax({
        type:'get',
        url:'/DangerSource/getDSAccidenType',
        data:{typeId:rank.id},
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
                        show: true


                    },
                    labelLine: {
                        show: true
                    },
                    shadowBlur: 40,
                    shadowColor: 'rgba(40, 40, 40,0.5)',
                }
            };

            var option = {

                color: [ "#00544a", "#6ca748","#a5a5a5"],



                tooltip: {
                    trigger: 'item',
                    formatter: "{b}: {c} ({d}%)"
                },
                series: [{
                    name: '可能引发的事故类型占比',
                    type: 'pie',
                    avoidLabelOverlap: true,
                    radius: ['0%', '65%'],

                    itemStyle: dataStyle,
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
//可能发生的事故类型菜单
function rankMenu() {
    //事故等级菜单
    var rankMenu =document.getElementById("rankMenu");
    if ($("#rankMenu li").length!=0){
        return
    }
    $.ajax({
        type:'get',
        url: "/SysDictionary/getDataDictList?typeId=" + MajorHazardRank,
        success:function (result) {
            $.each(result, function (i, n) {
                rankMenu.innerHTML+="<li><a id=\""+n.dictId+ "\" style=\"color: #fff\" onclick=loadDSAccidenType(this);>"+n.dictName+"</a></li>";
                if (i==0){
                    var rank={id:n.dictId,innerHTML:n.dictName};
                    loadDSAccidenType(rank);
                }
            });
        }
    });

}


/**近五年重大危险源数量统计*/
var fiveYearCountInfo=null;
function loadfiveYearCountEchart(){

    $.ajax({
        type:'get',
        url:'/DSourceStatistics/getFiveYearCountbarInfo',
        success:function(result){
            var data=[];
            var dataName=[];
            var year=[];
            /**柱状图*/
            $.each(result,function(i,n){
                dataName.push(n.dictName);
                data.push({name: n.dictName, type: 'bar',stack: '数量', barMaxWidth: 40,data: n.num.split(",")});
            });
            /**折线图*/
            $.ajax({
                type: 'get',
                async:false,
                url: "/DSourceStatistics/getFiveYearCountInfo",
                success: function (dataResult) {
                    $.each(dataResult,function(i,n){
                        data.push({name: n.dictName, type: 'line',yAxisIndex: 1,data:n.num});
                        if (i==0){
                            $.each(n.year,function (i,n) {
                                year.push(n.replace("y","")+"年");
                            })
                        }
                    });
                }
            });
            var option = {
                tooltip: {
                    trigger: 'axis',
                    formatter:'数量 占比<br/>{a0}:{c0}个 {c4}%<br/>{a1}:{c1}个 {c5}%<br/>' +
                    '{a2}:{c2}个 {c6}%<br/>{a3}:{c3}个 {c7}%',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999'
                        }
                    }
                },
                color: ["#ab382c","#ef8938","#dfd728","#0e59cb"],
                legend: {
                    data:dataName,
                    textStyle:{
                        color: '#ffffff'
                    }
                },
                grid: {
                    top:'20%',
                    left: '3%',
                    right: '4%',
                    bottom: '10%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: year,
                        axisPointer: {
                            type:'shadow',
                            show:true,
                            label:{
                                show:false
                            }
                        },
                        //坐标轴白色
                        axisLine:{
                            lineStyle:{
                                color:'#ffffff'
                            }
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '数量',
                        min: 0,
                        axisLabel: {
                            formatter: '{value} 个'
                        },
                        axisPointer: {
                            show:false
                        },
                        axisLine:{
                            lineStyle:{
                                color:'#ffffff'
                            }
                        },
                        splitLine:{
                            show:false
                        },
                    },
                    {
                        type: 'value',
                        name: '占比',
                        min: 0,
                        max: 100,
                        interval: 20,
                        axisPointer: {
                            show:false
                        },
                        splitLine:{
                            show:false
                        },
                        axisLabel: {
                            formatter: '{value} %'
                        },
                        axisLine:{
                            lineStyle:{
                                color:'#ffffff'
                            }
                        }
                    }
                ],
                series: data
            };
            fiveYearCountInfo =echarts.init(document.getElementById("fiveYearCountInfo"));
            fiveYearCountInfo.setOption(option);
        },
        error:function(){

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
                        show: true
                    },
                    labelLine: {
                        show: true
                    },
                    shadowBlur: 40,
                    shadowColor: 'rgba(40, 40, 40,0.5)',
                }
            };

            var option = {

                color: ["#ed2d2d", "#ff881f", "#ffe01f", "#0e77ab"],



                tooltip: {
                    trigger: 'item',
                    formatter: "{b}: {c} ({d}%)"
                },
                series: [{
                    name: '重大危险源等级占比',
                    type: 'pie',
                    radius: ['0%', '65%'],
                    avoidLabelOverlap: false,
                    itemStyle: dataStyle,
                    data: data
                }]
            };
            sourceRankEchart =echarts.init(document.getElementById("sourceRankEchart"));
            sourceRankEchart.setOption(option);
        }
    });

}


//打开模态窗
function openModel() {
    $("#myModal").modal("show");

    $('input[type="checkbox"]').iCheck('uncheck');
    var checkId = $("#selectIndustry").val();
    if (checkId != "") {
        $.each(checkId.split(','), function (i, n) {
            $("#" + n).iCheck('check');
        });
    }


}

//重新加载行业echart
function loadIndustryAlarm() {
    var industryStr = "";
    var industryList = $('#hangYe')[0];
    for (var i = 0; i < industryList.length; i++) {
        if (industryList[i].checked) {
            industryStr += industryList[i].attributes.name.nodeValue + ",";
        }
    }
    staticIndustryStr = industryStr;
    loadIndustryAlarmEchart();
    $("#myModal").modal("hide");
}
var industryAlarmEchart = null;

//本月行业报警统计
function loadIndustryAlarmEchart() {
    $.ajax({
        type: 'post',
        url: '/DangerousAlarmStatistic/getIndustryAlarmMonth',
        data: {staticIndustryStr: staticIndustryStr},
        success: function (result) {
            var data = [];
            var xData = [];
            $.each(result, function (i, n) {
                var dataNum = n.DataNum.split(",");
                var dataItem = [];
                dataItem.push(n.DictName);
                xData.push(n.DictName);
                var sumNum = 0;
                $.each(dataNum, function (i, n) {
                    sumNum += parseInt(n);
                    dataItem.push(n);
                });
                dataItem.push(sumNum);
                data.push(dataItem);
            });
            $.ajax({
                type: 'post',
                url: '/DangerousAlarmStatistic/getAlarmTypeList',
                success: function (alarmList) {

                    var legend = [];
                    legend.push({
                        dim: 0,
                        name: '行业',
                        type: 'category',
                        data: xData,
                        inverse: true,
                        nameLocation: 'start'
                    })
                    $.each(alarmList, function (i, n) {

                        legend.push({dim: i + 1, name: n.TypeName});

                    });

                    $.ajax({
                        type: 'get',
                        async: false,
                        url: "/SysDictionary/getDataDictList?typeId=" + IndustryCodeDictId,
                        success: function (dataResult) {
                            var str = "";
                            var checkId = "";
                            $.each(dataResult, function (i, n) {
                                var checkFlag = "";

                                $.each(xData, function (j, m) {
                                    if (m == n.dictName) {
                                        checkFlag = "checked"
                                        checkId += n.dictId + ',';

                                    }
                                });

                                str += "<div class='col-xs-4' style='text-align: left'  >";
                                str += "<nobr ><input id='" + n.dictId + "' name='" + n.dictId + "' type='checkbox' " + checkFlag + ">  <label for='" + n.dictId + "'>" + n.dictName + "</label></nobr>";
                                str += "</div>";

                            });
                            $("#hangYeUl").html('');
                            $("#hangYeUl").append(str);
                            $("#selectIndustry").val(checkId.substring(0, checkId.length - 1));

                            $('input').iCheck({
                                checkboxClass: 'icheckbox_flat-blue',
                                radioClass: 'iradio_square',
                                increaseArea: '20%' // optional
                            });
                        }
                    });


                    legend.push({dim: alarmList.length + 1, name: '合计'})
                    var lineStyle = {
                        normal: {
                            width: 1,
                            opacity: 0.5
                        }
                    };

                    var option = {
                        // backgroundColor: '#333',
                        // legend: {
                        //     top: 0,
                        //     data: ['垦利'],
                        //     itemGap: 20,
                        //     textStyle: {
                        //         color: '#fff',
                        //         fontSize: 14
                        //     }
                        // },
                        color: ['#ffff00'],
                        tooltip: {
                            padding: 10,
                            backgroundColor: '#222',
                            borderColor: '#777',
                            borderWidth: 1,
                            // formatter: function (obj) {
                            //     var value = obj[0].value;
                            //     return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">'
                            //         + obj[0].seriesName + ' ' + value[0] + '日期：'
                            //         + value[7]
                            //         + '</div>'
                            //         + schema[1].text + '：' + value[1] + '<br>'
                            //         + schema[2].text + '：' + value[2] + '<br>'
                            //         + schema[3].text + '：' + value[3] + '<br>'
                            //         + schema[4].text + '：' + value[4] + '<br>'
                            //         + schema[5].text + '：' + value[5] + '<br>'
                            //         + schema[6].text + '：' + value[6] + '<br>';
                            // }
                        },
                        // dataZoom: {
                        //     show: true,
                        //     orient: 'vertical',
                        //     parallelAxisIndex: [0]
                        // },

                        parallelAxis: legend,

                        parallel: {
                            left: '5%',
                            right: '18%',
                            bottom: '8%',

                            parallelAxisDefault: {
                                type: 'value',
                                name: 'AQI指数',
                                nameLocation: 'end',
                                nameGap: 20,
                                nameTextStyle: {
                                    color: '#fff',
                                    fontSize: 12
                                },
                                axisLine: {
                                    lineStyle: {
                                        color: '#aaa'
                                    }
                                },
                                axisTick: {
                                    lineStyle: {
                                        color: '#777'
                                    }
                                },
                                splitLine: {
                                    show: false
                                },
                                axisLabel: {
                                    textStyle: {
                                        color: '#fff'
                                    }
                                }
                            }
                        },
                        series: [
                            {
                                name: '垦利',
                                type: 'parallel',
                                lineStyle: lineStyle,
                                data: data
                            }
                        ]
                    };

                    industryAlarmEchart = echarts.init(document.getElementById('industryAlarmEchart'));
                    industryAlarmEchart.setOption(option);


                }
            });


        }
    });
}



var areaAlarmEchart = null;

//本月行政区域报警情况统计
function loadAreaAlarmEchart() {
    $.ajax({
        type: 'post',
        url: '/DangerousAlarmStatistic/getAreaAlarmMonth',
        success: function (result) {

            var area = [];
            var monthData = result[0].alarmNum.split(',').map(function (data) {
                return +data;
            });
            var lastMonthData = result[1].alarmNum.split(',').map(function (data) {
                return +data;
            });
            ;
            $.ajax({
                type: 'get',
                async: false,
                url: "/SysDictionary/getDataDictList?typeId=" + DirectAreaDictId,
                success: function (dataResult) {
                    $.each(dataResult, function (i, n) {
                        area.push(n.dictName);
                    });
                }
            });

            for (var i = 0; i < monthData.length - 1; i++) {
                for (var j = i; j < monthData.length - 1; j++) {
                    if (monthData[j] > monthData[j + 1]) {
                        var temp = monthData[j + 1];
                        monthData[j + 1] = monthData[j];
                        monthData[j] = temp;

                        temp = lastMonthData[j + 1];
                        lastMonthData[j + 1] = lastMonthData[j];
                        lastMonthData[j] = temp;

                        temp = area[j + 1];
                        area[j + 1] = area[j];
                        area[j] = temp;
                    }
                }
            }


            var option = {

                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                color: ['#67b1b0', '#277ace'],
                legend: {
                    top: '5%',
                    data: ['本月报警次数', '上月报警次数'],
                    textStyle: {
                        color: '#fff'
                    }

                },
                grid: {
                    top: '20%',
                    left: '3%',
                    right: '4%',
                    bottom: '1%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01],
                    axisLabel: {
                        textStyle: {
                            color: '#fff',
                            // fontSize: 20
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#fff'
                        }
                    },
                    minInterval: 1
                },
                yAxis: {
                    type: 'category',
                    data: area,
                    axisLabel: {
                        textStyle: {
                            color: '#fff',
                            fontSize: 10
                        },
                        interval: 0,
                        formatter: function (params) {
                            params = xAxisNameType(params);
                            return params;
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#fff'
                        }
                    }
                },
                dataZoom: [
                    {
                        type: 'inside',

                    },
                    {
                        show: "true",
                        start: 40,
                        end: 100,

                        textStyle: {
                            color: '#fff'
                        },
                        yAxisIndex: 0
                    }
                ],
                series: [
                    {
                        name: '本月报警次数',
                        type: 'bar',
                        data: monthData,
                        label: {
                            normal: {
                                show: true,
                                position: 'right',
                                color: '#fff'
                            }
                        }
                    },
                    {
                        name: '上月报警次数',
                        type: 'bar',
                        data: lastMonthData,
                        label: {
                            normal: {
                                show: true,
                                position: 'right',
                                color: '#fff'
                            }
                        }
                    }
                ]
            };
            areaAlarmEchart = echarts.init(document.getElementById('areaAlarmEchart'));
            areaAlarmEchart.setOption(option);


        }
    });
}




var alarmTypeMonthEchart = "";

//月度报警类型统计
function loadAlarmTypeMonthEchart() {
    $.ajax({
        type: 'post',
        url: '/DangerousAlarmStatistic/getAlarmTypeMonth',
        success: function (result) {
            var data = [];
            $.each(result, function (i, n) {
                data.push([n.AlarmDate, n.AlarmCount, n.TargetName]);
            });

            $.ajax({
                type: 'post',
                url: '/DangerousAlarmStatistic/getAlarmTypeList',
                success: function (alarmList) {
                    var legend = [];
                    $.each(alarmList, function (i, n) {
                        legend.push(n.TypeName);
                    });
                    var option = {

                        color: ['#2377ad', '#97b356', '#23a290', '#547b98', '#e7971e', '#b5382d'],
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'line',
                                position: function (point, params, dom) {
                                    // 固定在顶部
                                    return [point[0], '50%'];
                                },
                                lineStyle: {
                                    color: 'rgba(0,0,0,0.2)',
                                    width: 1,
                                    type: 'solid'
                                }
                            }
                        },

                        legend: {
                            type: 'scroll',
                            data: legend,
                            textStyle: {
                                color: '#fff',
                                // fontSize:20
                            },
                            pageIconColor: '#fff',
                            pageTextStyle: {
                                color: '#fff'
                            }
                        },

                        singleAxis: {
                            top: 50,
                            bottom: 50,
                            axisTick: {},
                            axisLabel: {},
                            type: 'time',
                            minInterval: 3600 * 24 * 1000,
                            axisPointer: {
                                animation: true,
                                label: {
                                    show: true,
                                    color: '#000'
                                }
                            },
                            splitLine: {
                                show: true,
                                lineStyle: {
                                    type: 'dashed',
                                    opacity: 0.2
                                }
                            }
                            ,
                            axisLine: {
                                lineStyle: {
                                    color: '#fff'
                                }
                            }
                        },

                        series: [
                            {
                                type: 'themeRiver',
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 20,
                                        shadowColor: 'rgba(0, 0, 0, 0.8)'
                                    }
                                },
                                label: {
                                    normal: {
                                        show: false,
                                        textStyle: {
                                            color: '#fff'
                                        }
                                    }
                                },
                                radius: ['0%', '65%'],
                                data: data
                            }
                        ]
                    };

                    alarmTypeMonthEchart = echarts.init(document.getElementById('alarmTypeMonthEchart'));
                    alarmTypeMonthEchart.setOption(option);
                }
            });


        }
    })
}





var industryCompanyCharts=null;

var industryCompanyOption=null;
//加载各行业企业分布情况
function loadIndustryCompany(){

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
                                fontSize: 12
                            }
                        },
                        grid: {
                            top:'20%',
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
                                        fontSize: 10
                                    },
                                    interval:0,
                                    formatter:function (params) {
                                        params =xAxisNameType(params);
                                        return params;
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
                                        fontSize: 12
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
                                start: 0,
                                end: 40,
                            },
                            {
                                show: "true",
                                start: 0,
                                end: 40,

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


var companyTypeChart=null;
var companyTypeOption=null;
//加载企业类型占比
function loadCompanyType(){


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

                    position:'inside',
                    shadowBlur: 40,
                    shadowColor: 'rgba(40, 40, 40,0.5)',
                    formatter: function(params){
                        var name=params.name;
                        if(name.length>4){
                            return name.substring(0,4)+"\n"+name.substring(5);
                        }
                        return name;
                    }

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
                    radius: ['0%', '65%'],
                    avoidLabelOverlap: true,
                    itemStyle: dataStyle,
                    label: {
                        normal: {
                            show: true,
                            position: 'outside',
                            formatter: function(params){
                                var name=params.name;
                                if(name.length>4){
                                    return name.substring(0,4)+"\n"+name.substring(4);
                                }
                                return name;
                            },
                        },

                    },
                    labelLine: {
                        normal: {
                            show: true
                        }
                    },
                    data: data
                }]
            };


            companyTypeChart =echarts.init(document.getElementById("companyTypeEchart"));
            companyTypeChart.setOption(companyTypeOption);
        }
    });

}

//适应页面大小
function resizePage(){

    //获取浏览器高度
    scanHeight = $(window).height();

    $("#fullDiv").height(scanHeight + 'px');


    if(companyTypeChart!=null){
        companyTypeChart.resize();
    }

    if(industryCompanyCharts!=null){
        industryCompanyCharts.resize();
    }

    if(alarmTypeMonthEchart!=null){
        alarmTypeMonthEchart.resize();
    }

    if(industryAlarmEchart!=null){
        industryAlarmEchart.resize();
    }

    if(areaAlarmEchart!=null){
        areaAlarmEchart.resize();
    }

    if(sourceRankEchart!=null){
        sourceRankEchart.resize();
    }
    if(fiveYearCountInfo!=null){
        fiveYearCountInfo.resize();
    }

    if( DSAccidenTypeEchart!=null){
        DSAccidenTypeEchart.resize();
    }


    //获取浏览器高度
    scanHeight = $(window).height();
    flagTable=0;
}