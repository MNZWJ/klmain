var scanHeight=0;

$(function () {
    //获取浏览器高度
    var year =['2017年','2018年','2019年','2020年','2021年'];
    scanHeight = $(window).height();

    $("#fullDiv").height(scanHeight+'px');
    //近五年重大危险源数量统计
    loadfiveYearCountEchart(year);

    //近五年可能引发的事故类型占比

    loadfiveYearAccitentTypeScale(year);

    //可能引发事故类型占比
    loadDSAccidenTypeScale();

    //安全标准化级别占比
    loadStandardRankScale();

    //重大危险源级别和可能引发事故类型的区域分布
     loadRankAndAccenTypeAreaInfo();

    //重大危险源引发事故死亡人数统计
    loadDeathTollInfo();

});


/**近五年重大危险源数量统计*/
var fiveYearCountInfo=null;
function loadfiveYearCountEchart(year){
    if(fiveYearCountInfo!=null){
        fiveYearCountInfo.dispose();
        fiveYearCountInfo=null;
    }
    $.ajax({
        type:'get',
        url:'/DSourceStatistics/getFiveYearCountbarInfo',
        success:function(result){
            var data=[];
            var dataName=[];
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
                color: ["#ed2d2d","#ff881f","#ffe01f","#0e77ab"],
                legend: {
                    data:dataName,
                    textStyle:{
                        color: '#ffffff'
                    }
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

/**近五年可能引发的事故类型占比*/
var FiveYearAccitentTypeScale=null;
function loadfiveYearAccitentTypeScale(year){
    if(FiveYearAccitentTypeScale!=null){
        FiveYearAccitentTypeScale.dispose();
        FiveYearAccitentTypeScale=null;
    }
    var data=[];
    var dataName=[];

    $.ajax({
        type: 'get',
        async:false,
        url: "/DSourceStatistics/getFiveYearAccitentTypeScale",
        success: function (dataResult) {
            $.each(dataResult,function(i,n){
                dataName.push(n.dictName);

                data.push({name: n.dictName, type: 'line',data:n.num,areaStyle: {normal: {}}});
            });
            var option = {
                tooltip: {
                    trigger: 'axis',
                    formatter:'占比<br/>{a0}:{c0}%<br/>{a1}:{c1}%<br/>{a2}:{c2}%<br/>',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999'
                        }
                    }
                },
                color: [ "#00544a", "#6ca748","#a5a5a5"],
                legend: {
                    data:dataName,
                    textStyle:{
                        color: '#ffffff'
                    }
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
            FiveYearAccitentTypeScale =echarts.init(document.getElementById("FiveYearAccitentTypeScale"));
            FiveYearAccitentTypeScale.setOption(option);
        }
    });
}

/**可能引发事故类型占比*/
var DSAccidenTypeScale=null;
function loadDSAccidenTypeScale() {
    if(DSAccidenTypeScale!=null){
        DSAccidenTypeScale.dispose();
        DSAccidenTypeScale=null;
    }
    var rank=$("#rank").val();
    $.ajax({
        type:'get',
        url:'/DSourceStatistics/getDSAccidenTypeScale',
        data:{rank:'ece6d61a-7294-46ba-b8df-60bc838d9deb'},
        success:function(result){
            var legendData=[];
            var data=[];
            $.each(result,function(i,n){
                legendData.push(n['dictName']);
                data.push({value:n['num'],name:n['dictName']});
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
                    //radius: ['65%', '85%'],
                    avoidLabelOverlap: false,
                    itemStyle: dataStyle,
                    data: data
                }]
            };
            DSAccidenTypeScale =echarts.init(document.getElementById("DSAccidenTypeScale"));
            DSAccidenTypeScale.setOption(option);
        },
        error:function(e){
        }
    });
}

/**安全标准化级别占比*/
var StandardRankScale=null;
function loadStandardRankScale() {
    if(StandardRankScale!=null){
        StandardRankScale.dispose();
        StandardRankScale=null;
    }
    $.ajax({
        type:'get',
        url:'/DSourceStatistics/getStandardRankScale',
        success:function(result){
            var legendData=[];
            var data=[];
            $.each(result,function(i,n){
                legendData.push(n['dictName']);
                data.push({value:n['num'],name:n['dictName']});
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
                    name: '安全标准化级别占比',
                    type: 'pie',
                    //radius: ['65%', '85%'],
                    avoidLabelOverlap: false,
                    itemStyle: dataStyle,
                    data: data
                }]
            };
            StandardRankScale =echarts.init(document.getElementById("StandardRankScale"));
            StandardRankScale.setOption(option);
        },
        error:function(e){
        }
    });
}

/**重大危险源级别和可能引发事故类型的区域分布*/
var RankAndAccenTypeAreaInfo=null;
function loadRankAndAccenTypeAreaInfo() {
    if(RankAndAccenTypeAreaInfo!=null){
        RankAndAccenTypeAreaInfo.dispose();
        RankAndAccenTypeAreaInfo=null;
    }
    $.ajax({
        type: 'get',
        url: '/DSourceStatistics/getRankAndAccenTypeAreaInfo',
        data:{typeId:'07963916-7f6e-40a8-8fd4-337802182a70'},
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
                                color: '#fff'
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
                                        fontSize: 15
                                    }
                                },
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
                                axisLabel: {
                                    textStyle: {
                                        color: '#fff',
                                        fontSize: 15
                                    }
                                },
                                splitLine:{
                                    show:false
                                },
                                axisLine:{
                                    lineStyle:{
                                        color:'#ffffff'
                                    }
                                },
                            }
                        ],
                        dataZoom: [
                            {
                                show: "true",
                                start: 0,
                                end: 60,

                                textStyle: {
                                    color: '#fff'
                                }
                            }
                        ],
                        series: data
                    };

                    RankAndAccenTypeAreaInfo = echarts.init(document.getElementById('RankAndAccenTypeAreaInfo'));
                    RankAndAccenTypeAreaInfo.setOption(option);
                }
            });


        }
    });
}

/**重大危险源引发事故死亡人数统计*/
var DeathTollInfo=null;
function loadDeathTollInfo() {
    if(DeathTollInfo!=null){
        DeathTollInfo.dispose();
        DeathTollInfo=null;
    }
    var tool = {a:"0-9人",b:"10-29人",c:"30-99人",d:"100人以上"};
    $.ajax({
        type: 'get',
        url: '/DSourceStatistics/getDeathTollInfo',
        success: function (result) {
            var data = [];
            var legendData = [];
            $.each(result, function (i, n) {
                data.push({name: tool[n.name], type: 'bar', barMaxWidth: 40, stack: n.stack, data: n.num});
                legendData.push(tool[n.name]);
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
                        color: ["#0e77ab", "#ffe01f", "#ff881f", "#ed2d2d"],
                        legend: {
                            data: legendData,
                            textStyle: {
                                color: '#fff'
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
                                        fontSize: 15
                                    }
                                },
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
                                splitNumber:5,
                                axisLabel: {
                                    textStyle: {
                                        color: '#fff',
                                        fontSize: 15
                                    }
                                },
                                splitLine:{
                                    show:false
                                },
                                axisLine:{
                                    lineStyle:{
                                        color:'#ffffff'
                                    }
                                }
                            }
                        ],
                        dataZoom: [
                            {
                                show: "true",
                                start: 0,
                                end: 60,

                                textStyle: {
                                    color: '#fff'
                                }
                            }
                        ],
                        series: data
                    };

                    DeathTollInfo = echarts.init(document.getElementById('DeathTollInfo'));
                    DeathTollInfo.setOption(option);
                }
            });


        }
    });
}
//适应页面大小
function resizePage(){

    //获取浏览器高度
    scanHeight = $(window).height();

    $("#fullDiv").height(scanHeight+'px');

    if(fiveYearCountInfo!=null){
        fiveYearCountInfo.resize();
    }

    if(FiveYearAccitentTypeScale!=null){
        FiveYearAccitentTypeScale.resize();
    }

    if(DSAccidenTypeScale!=null){
        DSAccidenTypeScale.resize();
    }
    if(StandardRankScale!=null){
        StandardRankScale.resize();
    }

    if(RankAndAccenTypeAreaInfo!=null){
        RankAndAccenTypeAreaInfo.resize();
    }
    if(DeathTollInfo!=null){
        DeathTollInfo.resize();
    }

}