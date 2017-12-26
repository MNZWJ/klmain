var scanHeight = "";
$(function () {
    //获取浏览器高度
    scanHeight = $(window).height();


    initTable();
    $.ajax({
        type: 'post',
        url: '/RealTimeWarn/getRealTimeWarnData',
        success: function (result) {
            $("#table").bootstrapTable("load", result);
        }
    });

    // connect();
});

//初始化表格
function initTable() {
    $("#table").bootstrapTable("destroy");

    $('#table').bootstrapTable({
        height: scanHeight,
        striped: true,      //是否显示行间隔色
        cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        method: 'get',//请求方式
        //url: '/SysRole/GetRoleList',//请求url
        pagination: false,//显示分页条
        clickToSelect: false,//是否启用点击选中行

        sortStable: true,//设置为 true 将获得稳定的排序，我们会添加_position属性到 row 数据中。
        idField: 'sourceId',
        rowStyle: function () {//自定义行样式
            return "bootTableRow";
        },
        onLoadError: function () {
        },
        onClickRow: function (row, $element) {

            // $("#roleTable").bootstrapTable("uncheckAll");
            // $("#roleTable").bootstrapTable("checkBy", {field: 'roleId', values: [row.roleId]})
        },
        undefinedText:'',
        columns: [
            [{

                title: '序号',
                field: 'number1',
                valign: "middle",
                formatter: function (value, row, index) {
                    return  index + 1;
                },
                colspan: 1,
                rowspan: 3,
                classes:'table',
            }
                ,


                {

                    field: 'companyName',
                    title: '企业',
                    halign: 'center',
                    align: 'center',

                    valign: "middle",
                    colspan: 1,
                    rowspan: 3,
                    cellStyle: function (value, row, index, field) {
                        return {classes: '', css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis','overflow': 'hidden'}};
                    },
                    formatter: function (value, row, index) {
                        return '<span title="'+value+'">'+value+'</span>'

                    }
                },
                {
                    field: 'sourceName',
                    title: '重大危险源',
                    halign: 'center',
                    align: 'center',

                    valign: "middle",
                    colspan: 1,
                    rowspan: 3,
                    cellStyle: function (value, row, index, field) {
                        return {classes: '', css: {'white-space': 'nowrap', "word-wrap":"break-word;",'text-overflow': 'ellipsis','overflow': 'hidden'}};
                    },
                    formatter: function (value, row, index) {
                        return '<span style="width: 100px;" title="'+value+'">'+value+'</span>'

                    }
                },
                {

                    title: '固有风险',
                    valign: "middle",
                    align: "center",
                     width: 'auto',
                    colspan: 5,
                    rowspan: 1,
                    cellStyle: function (value, row, index, field) {
                        return {classes: '', css: {'min-width':'30%'}};
                    }
                }, {
                field: 'sourceName',
                title: '动态风险',
                valign: "middle",
                align: "center",

                colspan: 5,
                rowspan: 1
            }],
            [
                {

                    title: '风险',

                    valign: "middle",
                    align: "center",

                    colspan: 1,
                    rowspan: 2,
                    formatter:function(value,row,index){
                        var str="";
                        var FEI=parseInt(row.fEI);

                        if(FEI>=159 ||row.rank=="一级" ||row.conditionNum>0 ||row.protectionNum>0){
                            str="高";
                        }else if(FEI>=128&&FEI<=158 ||row.rank=="二级" ){
                            str="中";
                        }else if(FEI>=97&&FEI<=127 ||row.rank=="三级"){
                            str="较低";
                        }else if(FEI>=128&&FEI<=158 || row.rank=="四级"){
                            str="低";
                        }
                        return str;
                    },
                    cellStyle:function cellStyle(value, row, index, field) {
                        var color="";
                        var FEI=parseInt(row.fEI);

                        if(FEI>=159 ||row.rank=="一级" ||row.conditionNum>0 ||row.protectionNum>0){
                            color="#e73941";
                        }else if(FEI>=128&&FEI<=158 ||row.rank=="二级" ){
                            color="#ff881f";
                        }else if(FEI>=97&&FEI<=127 ||row.rank=="三级"){
                            color="#ffe01f";
                        }else if(FEI>=128&&FEI<=158 || row.rank=="四级"){
                            color="#0e77ab";
                        }
                        return {classes: '', css: {'background-color': color,'min-width':'20%'}};
                    }
                }, {

                title: '危险源等级',
                field: 'rank',
                valign: "middle",
                align: "center",

                colspan: 1,
                rowspan: 2,

                cellStyle:function cellStyle(value, row, index, field) {
                    var color="";
                    if(value=="一级"){
                        color="#e73941";
                    }else if(value=="二级"){
                        color="#ff881f";
                    }else if(value=="三级"){
                        color="#ffe01f";
                    }else if(value=="四级"){
                        color="#0e77ab";
                    }
                    return {classes: '', css: {'background-color': color,'min-width':'50%'}};
                }
            }, {

                title: 'F&EI级别',
                field: 'fEI',
                valign: "middle",
                align: "center",

                colspan: 1,
                rowspan: 2,
                formatter:function(value,row,index){
                    var str="";
                    value=parseInt(value);
                    if(value>=159){
                        str="非常大";
                    }else if(value>=128&&value<=158){
                        str="很大";
                    }else if(value>=97&&value<=127){
                        str="中等";
                    }else if(value>=128&&value<=158){
                        str="较轻";
                    }else{
                        str="-";
                    }
                    return str;
                },
                cellStyle:function cellStyle(value, row, index, field) {
                    var color="";
                    value=parseInt(value);
                    if(value>=159){
                        color="#e73941";
                    }else if(value>=128&&value<=158){
                        color="#ff881f";
                    }else if(value>=97&&value<=127){
                        color="#ffe01f";
                    }else if(value>=128&&value<=158){
                        color="#0e77ab";
                    }else{
                        color="#8cc320";
                    }
                    return {classes: '', css: {'background-color': color}};
                }
            }, {

                title: '安全距离不符合项',
                valign: "middle",
                align: "center",

                colspan: 2,
                rowspan: 1
            }, {

                title: '风险',
                valign: "middle",
                align: "center",

                colspan: 1,
                rowspan: 2,
                formatter:function(value,row,index){
                    var str="";
                    var majorHidden=parseInt(row.majorHidden);

                    if(majorHidden>0 || parseInt(row.airStatusNum)>0||parseInt(row.processUnitNum)>0){
                        str="高";
                    }else if(parseInt(row.generalHidden)>0){
                        str="中";
                    }else{
                        str="低";
                    }
                    return str;
                },
                cellStyle:function cellStyle(value, row, index, field) {
                    var color="";
                    var majorHidden=parseInt(row.majorHidden);

                    if(majorHidden>0 || parseInt(row.airStatusNum)>0||parseInt(row.processUnitNum)>0){
                        color="#e73941";
                    }else if(parseInt(row.generalHidden)>0){
                        color="#ff881f";
                    }else{
                        color="#8cc320";
                    }


                    return {classes: '', css: {'background-color': color}};
                }

            }, {

                title: '事故隐患',
                valign: "middle",
                align: "center",

                colspan: 2,
                rowspan: 1
            }, {

                title: '有毒气、<br/>可燃气体<br/>报警',
                field:'airStatusNum',
                valign: "middle",
                align: "center",

                colspan: 1,
                rowspan: 2,
                cellStyle:function cellStyle(value, row, index, field) {
                    var color="";
                    value=parseInt(value);
                    if(value>0){
                        color="#e73941";
                    }else{
                        color="#8cc320";
                    }
                    return {classes: '', css: {'background-color': color}};
                }
            }, {

                title: '工艺报警',
                field:'processUnitNum',
                valign: "middle",
                align: "center",

                colspan: 1,
                rowspan: 2,
                cellStyle:function cellStyle(value, row, index, field) {
                    var color="";
                    value=parseInt(value);
                    if(value>0){
                        color="#e73941";
                    }else{
                        color="#8cc320";
                    }
                    return {classes: '', css: {'background-color': color}};
                }
            }
            ], [
                {
                    title: '设施周围',
                    field:'conditionNum',
                    valign: "middle",
                    align: "center",

                    colspan: 1,
                    rowspan: 1,

                    cellStyle:function cellStyle(value, row, index, field) {
                        var color="";
                        value=parseInt(value);
                        if(value>0){
                            color="#e73941";
                        }else{
                            color="#8cc320";
                        }
                        return {classes: '', css: {'background-color': color}};
                    }
                },
                {
                    title: '法律保护区',
                    field:'protectionNum',
                    valign: "middle",
                    align: "center",

                    colspan: 1,
                    rowspan: 1,
                    cellStyle:function cellStyle(value, row, index, field) {
                        var color="";
                        value=parseInt(value);
                        if(value>0){
                            color="#e73941";
                        }else{
                            color="#8cc320";
                        }
                        return {classes: '', css: {'background-color': color}};
                    }
                },
                {
                    title: '一般',
                    field:'generalHidden',
                    valign: "middle",
                    align: "center",

                    colspan: 1,
                    rowspan: 1,
                    cellStyle:function cellStyle(value, row, index, field) {
                        var color="";
                        value=parseInt(value);
                        if(value>0){
                            color="#ff881f";
                        }else{
                            color="#8cc320";
                        }
                        return {classes: '', css: {'background-color': color}};
                    }
                },
                {
                    title: '重大',
                    field:'majorHidden',
                    valign: "middle",
                    align: "center",

                    colspan: 1,
                    rowspan: 1,
                    cellStyle:function cellStyle(value, row, index, field) {
                        var color="";
                        value=parseInt(value);
                        if(value>0){
                            color="#e73941";
                        }else{
                            color="#8cc320";
                        }
                        return {classes: '', css: {'background-color': color}};
                    }
                }

            ]
        ]
    });
}


//适应页面大小
function resizePage() {


    //获取浏览器高度
    scanHeight = $(window).height();


    initTable();
    $.ajax({
        type: 'post',
        url: '/RealTimeWarn/getRealTimeWarnData',
        success: function (result) {
            $("#table").bootstrapTable("load", result);
        }
    });
}


/////////////////////////////////////
// var stompClient = null;
//
// function connect() {
//     var socket = new SockJS('/endpointSang');
//     stompClient = Stomp.over(socket);
//     stompClient.connect({}, function (frame) {
//
//         console.log('Connected:' + frame);
//         stompClient.subscribe('/topic/getResponse', function (response) {
//             showResponse(JSON.parse(response.body).name);
//         })
//     });
// }
// function disconnect() {
//     if (stompClient != null) {
//         stompClient.disconnect();
//     }
//
//     console.log('Disconnected');
// }
//
// function showResponse(message) {
//     alert(message);
// }
// function sendName() {
//
//     var name = '123';
//     console.log('name:' + name);
//     stompClient.send("/welcome", {}, JSON.stringify({'name': name}));
// }