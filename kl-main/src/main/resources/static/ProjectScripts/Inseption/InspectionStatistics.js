var scanHeight = "";

//打开统计图页面
$(function() {
    timeMethod=setInterval(function(){
        $("#showTime").html(convert(new Date()));
    },1000);

    initEcharts();
})
//初始化图表
function initEcharts() {
    //企业总数
    getCompanyList();
    //各行业企业分布情况
    loadIndustryCompany();
    //加载企业类型占比
    loadCompanyType();
    //加载企业规模占比
    loadScaleCode();
    //加载企业行政区划分布情况
    loadDirectAreaCompany();

}

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

                color: ['#ed2d2d', '#ef8938','#ffe01f','#22529b'],



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
                    avoidLabelOverlap: true,
                    itemStyle: dataStyle,
                    label: {
                        normal: {
                            show: true,
                            position: 'outside'
                        }

                    },
                    labelLine: {
                        normal: {
                            show: true
                        }
                    },
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
                    //radius: ['65%', '85%'],
                    avoidLabelOverlap: true,
                    itemStyle: dataStyle,
                    label: {
                        normal: {
                            show: true,
                            position: 'outside',
                            formatter: function(params){
                                var name=params.name;
                                if(name.length>4){
                                    return name.substring(0,4)+"\n"+name.substring(5);
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
                                start: 0,
                                end: 60,
                            },
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
                                start: 0,
                                end: 60,
                            },
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

                    directAreaCompanyChart = echarts.init(document.getElementById('directAreaCompanyInfo'));
                    directAreaCompanyChart.setOption(directAreaCompanyOption);
                }
            });


        }
    });
}
var timeMethod="";


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

//横坐标换行
function xAxisNameType(params){
    var newParamsName = "";// 最终拼接成的字符串
    var paramsNameNumber = params.length;// 实际标签的个数
    var provideNumber = 4;// 每行能显示的字的个数
    var rowNumber = Math.ceil(paramsNameNumber / provideNumber);// 换行的话，需要显示几行，向上取整
    /**
     * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
     */
    // 条件等同于rowNumber>1
    if (paramsNameNumber > provideNumber) {
        /** 循环每一行,p表示行 */
        for (var p = 0; p < rowNumber; p++) {
            var tempStr = "";// 表示每一次截取的字符串
            var start = p * provideNumber;// 开始截取的位置
            var end = start + provideNumber;// 结束截取的位置
            // 此处特殊处理最后一行的索引值
            if (p == rowNumber - 1) {
                // 最后一次不换行
                tempStr = params.substring(start, paramsNameNumber);
            } else {
                // 每一次拼接字符串并换行
                tempStr = params.substring(start, end) + "\n";
            }
            newParamsName += tempStr;// 最终拼成的字符串
        }

    } else {
        // 将旧标签的值赋给新标签
        newParamsName = params;
    }
    //将最终的字符串返回
    return newParamsName
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
}

