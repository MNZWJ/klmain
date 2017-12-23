var scanHeight=0;

$(function () {
    setInterval(function(){
        $("#showTime").html(convert(new Date()));
    },1000);
    //获取浏览器高度
    scanHeight = $(window).height();

    $("#fullDiv").height(scanHeight+'px');
    //加载今日报警类型占比图
    loadTodayAlarmTypeEchart();
    //今日企业报警次数表格
    initLoadCompanyAlarmTable();

    //今日设备类型报警统计
    loadTodayEquipTypeCountEchart();
    //月度报警类型统计
    loadAlarmTypeMonthEchart();
    //本月行业报警统计
    loadIndustryAlarmEchart();

    //本月行政区域报警情况统计
    loadAreaAlarmEchart();

    //月度报警次数统计
    loadMonthAlarmCount();
});


var areaAlarmEchart=null;
//本月行政区域报警情况统计
function loadAreaAlarmEchart(){
    $.ajax({
       type:'post',
       url:'/DangerousAlarmStatistic/getAreaAlarmMonth' ,
        success:function(result){

           var area=[];
           var monthData=result[0].alarmNum.split(',').map(function(data){
               return +data;
           });
           var lastMonthData=result[1].alarmNum.split(',').map(function(data){
               return +data;
           });;
            $.ajax({
                type: 'get',
                async:false,
                url: "/SysDictionary/getDataDictList?typeId=" + DirectAreaDictId,
                success: function (dataResult) {
                    $.each(dataResult, function (i, n) {
                        area.push(n.dictName);
                    });
                }
            });

            for(var i=0;i<monthData.length-1;i++){
                for(var j=i;j<monthData.length-1;j++){
                    if (monthData[j] > monthData[j + 1])
                    {
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
                color:['#67b1b0','#277ace'],
                legend: {
                    top:'5%',
                    data: ['本月报警次数', '上月报警次数'],
                    textStyle:{
                        color:'#fff'
                    }

                },
                grid: {
                    top:'20%',
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
                    axisLine:{
                        lineStyle:{
                            color:'#fff'
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
                },
                dataZoom: [
                    {
                        type:'inside',

                    },
                    {
                        show: "true",
                        start: 40,
                        end: 100,

                        textStyle: {
                            color: '#fff'
                        },
                        yAxisIndex:0
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
                                color:'#fff'
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
                                color:'#fff'
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




var industryAlarmEchart=null;
//本月行业报警统计
function loadIndustryAlarmEchart(){
    $.ajax({
       type:'post',
       url:'/DangerousAlarmStatistic/getIndustryAlarmMonth',
        success:function(result){
           var data=[];
            var xData = [];
            $.each(result,function(i,n){
                var dataNum=n.DataNum.split(",");
                var dataItem=[];
                dataItem.push(n.DictName);
                xData.push(n.DictName);
                var sumNum=0;
                $.each(dataNum,function(i,n){
                    sumNum+=parseInt(n);
                    dataItem.push(n);
                });
                dataItem.push(sumNum);
                data.push(dataItem);
            });
            $.ajax({
                type:'post',
                url:'/DangerousAlarmStatistic/getAlarmTypeList' ,
                success:function (alarmList) {


                    // $.ajax({
                    //     type: 'get',
                    //     async:false,
                    //     url: "/SysDictionary/getDataDictList?typeId=" + IndustryCodeDictId,
                    //     success: function (dataResult) {
                    //
                    //         $.each(dataResult, function (i, n) {
                    //             xData.push(n.dictName);
                    //         });
                    //     }});


                    var legend = [];
                    legend.push({dim: 0, name: '行业',type: 'category', data: xData, inverse: true, nameLocation: 'start'})
                    $.each(alarmList, function (i, n) {

                        legend.push({dim: i+1, name: n.TypeName});

                    });
                    legend.push({dim: alarmList.length+1, name: '合计'})
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
                        color:['#ffff00'],
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


                }});






        }
    });
}


var alarmTypeMonthEchart="";
//月度报警类型统计
function loadAlarmTypeMonthEchart(){
    $.ajax({
        type:'post',
        url:'/DangerousAlarmStatistic/getAlarmTypeMonth',
        success:function(result){
            var data=[];
            $.each(result,function(i,n){
                data.push([n.AlarmDate,n.AlarmCount,n.TargetName]);
            });

            $.ajax({
               type:'post',
               url:'/DangerousAlarmStatistic/getAlarmTypeList' ,
                success:function (alarmList) {
                   var legend=[];
                   $.each(alarmList,function(i,n){
                       legend.push(n.TypeName);
                   });
                    var option = {

                        color:['#2377ad', '#97b356', '#23a290', '#547b98', '#e7971e', '#b5382d'],
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'line',
                                position: function(point, params, dom) {
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
                            type:'scroll',
                            data: legend,
                            textStyle: {
                                color: '#fff',
                                // fontSize:20
                            },
                            pageIconColor:'#fff',
                            pageTextStyle:'fff'
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
                                    color:'#000'
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


var todayEquipTypeCountEchart="";
//今日设备类型报警统计
function loadTodayEquipTypeCountEchart(){
    $.ajax({
       type:'post',
        url:'/DangerousAlarmStatistic/getEquipTypeAlarmToday',
        success:function(result){

            var data = [];
            var legendData = [];
            $.each(result, function (i, n) {
                data.push({name: n.TargetName, type: 'bar', barMaxWidth: 40, stack: '报警', data: n.numList.split(",")});
                legendData.push(n.TargetName);
            });

            $.ajax({
                type: 'post',
                url: "/DangerousAlarmStatistic/getEquipTypeList",
                success: function (dataResult) {
                    var xData = [];
                    $.each(dataResult, function (i, n) {
                        xData.push(n.TypeName);
                    });

                    var option = {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        color:['#2377ad', '#97b356', '#23a290', '#547b98', '#e7971e', '#b5382d'],
                        legend: {
                            type:'scroll',
                            data: legendData,
                            textStyle: {
                                color: '#fff',
                                // fontSize: 20
                            },
                            pageIconColor:'#fff',
                            pageTextStyle:'fff',
                            pageIconSize:12

                        },
                        grid: {
                            top:'20%',
                            left: '3%',
                            right: '4%',
                            bottom: '5%',
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
                                        // fontSize: 20
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

                    todayEquipTypeCountEchart = echarts.init(document.getElementById('todayEquipTypeCountEchart'));
                    todayEquipTypeCountEchart.setOption(option);
                }
            });



        }
    });
}

//月度报警次数统计
function loadMonthAlarmCount(){
    $('#monthAlarmCount').bootstrapTable({
        height: '100%',
        // striped: true,      //是否显示行间隔色
        cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        method: 'get',//请求方式
        url: '/DangerousAlarmStatistic/getMonthAllAlarmCount',//请求url
        pagination:false,
        clickToSelect: true,//是否启用点击选中行
        showRefresh: false,//是否显示 刷新按钮
        queryParams: function (pageReqeust) {
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

                // title: '序号',
                formatter: function (value, row, index) {


                    return "<div style='background-color: #44d3e4;border-radius: 8px;height: 14px;text-align: center;line-height: 14px;'>"+(index + 1)+"</div>";
                },
                cellStyle: function (value, row, index, field) {
                    return {classes: '', css: {'white-space': 'nowrap', "word-wrap":"break-word;",'text-overflow': 'ellipsis','overflow': 'hidden','color':'#fff','background-color':'#0a2732','vertical-align':'middle'}};
                },
                width: '5%',
            }
            ,

            {

                field: 'MonthDay',
                title: '月份',
                halign: 'left',
                align:'center',
                width: '55%',
                cellStyle: function (value, row, index, field) {
                    return {classes: '', css: {'white-space': 'nowrap', "word-wrap":"break-word;",'text-overflow': 'ellipsis','overflow': 'hidden','color':'#37afbf','background-color':'#0a2732'}};
                },
                formatter: function (value, row, index) {
                    return '<span  title="'+value+'">'+value+'</span>'

                }
            }, {
                field: 'alarmCount',
                title: '报警次数',
                halign: 'left',
                align:'center',
                width: '40%',
                cellStyle: function (value, row, index, field) {
                    return {classes: '', css: {'white-space': 'nowrap', "word-wrap":"break-word;",'text-overflow': 'ellipsis','overflow': 'hidden','color':'#37afbf','background-color':'#0a2732'}};
                },
                formatter: function (value, row, index) {
                    return '<span >'+value+'次</span>'

                }
            },{
                field: 'alarmUp',
                title: '环比增长',
                halign: 'left',
                align:'center',
                width: '40%',
                cellStyle: function (value, row, index, field) {
                    return {classes: '', css: {'white-space': 'nowrap', "word-wrap":"break-word;",'text-overflow': 'ellipsis','overflow': 'hidden','color':'#37afbf','background-color':'#0a2732'}};
                },
                formatter: function (value, row, index) {
                    var str="";
                    if(value!=undefined&&value!= null&&value!=""){
                        value=parseFloat(value);
                        if(value>0){
                            str+="<span style='color: #f00;'><span class='glyphicon glyphicon-triangle-top'></span> "+(value*100).toFixed(2)+"%</span>";
                        }else if(value<0){
                            str+="<span style='color: #0f0;'><span class='glyphicon glyphicon-triangle-bottom'></span> "+(Math.abs(value).toFixed(2)*100).toFixed(2)+"%</span>";
                        }else{
                            str+="<span style='color: #0080c0;'><span class='glyphicon glyphicon-minus'></span> 0%</span>";
                        }
                    }else{
                        str="-";
                    }
                    return '<span >'+str+'</span>'

                }
            }]
    });
}


//今日企业报警次数表格
function initLoadCompanyAlarmTable(){

    $('#todayCompanyAlarm').bootstrapTable({
        height: '100%',
        // striped: true,      //是否显示行间隔色
        cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        method: 'get',//请求方式
        url: '/DangerousAlarmStatistic/getCompanyAlarmData',//请求url
        pagination:false,
        clickToSelect: true,//是否启用点击选中行
        showRefresh: false,//是否显示 刷新按钮
        queryParams: function (pageReqeust) {
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

                // title: '序号',
                formatter: function (value, row, index) {


                    return "<div style='background-color: #44d3e4;border-radius: 8px;height: 14px;text-align: center;line-height: 14px;'>"+(index + 1)+"</div>";
                },
                cellStyle: function (value, row, index, field) {
                    return {classes: '', css: {'white-space': 'nowrap', "word-wrap":"break-word;",'text-overflow': 'ellipsis','overflow': 'hidden','color':'#fff','background-color':'#0a2732','vertical-align':'middle'}};
                },
                width: '5%',
            }
            ,

            {

                field: 'CompanyName',
                title: '企业',
                halign: 'center',
                width: '55%',
                cellStyle: function (value, row, index, field) {
                    return {classes: '', css: {'white-space': 'nowrap', "word-wrap":"break-word;",'text-overflow': 'ellipsis','overflow': 'hidden','color':'#37afbf','background-color':'#0a2732'}};
                },
                formatter: function (value, row, index) {
                    return '<span  title="'+value+'">'+value+'</span>'

                }
            }, {
                field: 'AlarmNum',
                title: '报警次数',
                halign: 'left',
                align:'center',
                width: '40%',
                cellStyle: function (value, row, index, field) {
                    return {classes: '', css: {'white-space': 'nowrap', "word-wrap":"break-word;",'text-overflow': 'ellipsis','overflow': 'hidden','color':'#37afbf','background-color':'#0a2732'}};
                },
                formatter: function (value, row, index) {
                    return '<span >'+value+'次</span>'

                }
            }]
    });
}


var todayAlarmTypeEchart=null;
//加载今日报警类型占比图
function loadTodayAlarmTypeEchart(){
    $.ajax({
       type:'post',
       url:'/DangerousAlarmStatistic/getAlarmTypeDay',
        success:function(result){
            var legendData=[];
            var data=[];
            $.each(result,function(i,n){
                legendData.push(n['TypeName']);
                data.push({value:n['TypeNum'],name:n['TypeName']});
            });
            var dataStyle = {
                normal: {
                    label: {
                        show: false
                    }
                }
            };

            var option ={

                color: ['#2377ad', '#97b356', '#23a290', '#547b98', '#e7971e', '#b5382d'],

                legend:{
                    type:'scroll',
                    left:10,
                    orient:'vertical',
                    data:legendData,
                    textStyle:{
                        color:'#fff'
                    },
                    itemWidth:20,
                    pageIconSize:10
                },

                tooltip: {
                    trigger: 'item',
                    formatter: "{b}: {c} ({d}%)"
                },
                series: [{
                    name: '今日报警类型占比',
                    type: 'pie',
                    center: ['60%','50%'],
                    avoidLabelOverlap: false,
                    itemStyle: dataStyle,
                    data: data
                }]
            };
            todayAlarmTypeEchart =echarts.init(document.getElementById("todayAlarmType"));
            todayAlarmTypeEchart.setOption(option);
        },
        error:function(){

        }
    });
}




//适应页面大小
function resizePage(){


    //获取浏览器高度
    scanHeight = $(window).height();

    $("#fullDiv").height(scanHeight+'px');

    if(todayAlarmTypeEchart!=null){
        todayAlarmTypeEchart.resize();
    }

    if(todayEquipTypeCountEchart!=null){
        todayEquipTypeCountEchart.resize();
    }

    if(industryAlarmEchart!=null){
        industryAlarmEchart.resize();
    }
    if(areaAlarmEchart!=null){
        areaAlarmEchart.resize();
    }

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