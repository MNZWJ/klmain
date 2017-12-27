var companyId = "";
var scanHeight = "";
var flagTable=0;
//判断模态窗是否有数据：0 未加载,1 有数据,2 无数据
var cerdiv = 0;
var equipdiv= 0;
$(function () {
    //获取浏览器高度
    scanHeight = $(window).height();

    // $("#map").height(scanHeight);
    initMap();

    initSocket();
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

    searchCompanyList();
    mini.get("searchCompanyName").load("/Inspection/getCompanyList");
    mini.get("searchScaleCode").load("/SysDictionary/getDataDictList?typeId=" + ScaleCodeDictId);
    mini.get("searchTypeCode").load("/SysDictionary/getDataDictList?typeId=" + TypeCodeDictId);
    var jsonData = [{ 'id': '0', 'text': '预警'}, { 'id': '1', 'text': '未预警' }];
    mini.get("alarm").load(jsonData);
}

//初始化表格
function initTable() {
    //证书表格
    $('#cerTable').bootstrapTable({
        height: scanHeight * 4 / 7,
        striped: true,      //是否显示行间隔色
        cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        method: 'get',//请求方式
        url: '/OverdueAlarm/getCertificateAlarm',//请求url
        undefinedText: '-',
        clickToSelect: false,//是否启用点击选中行
        showRefresh: false,//是否显示刷新按钮
        queryParams: function (pageReqeust) {
            pageReqeust.companyId = companyId;
            return pageReqeust;
        },
        rowStyle: function () {//自定义行样式
            return "bootTableRow";
        },
        onLoadSuccess:function(date){
            if (date.length == 0){
                cerdiv=2;
            }else {
                cerdiv=1;
            }
            showDiv();
        },
        onLoadError: function () {
        },

        columns: [
            {

                title: '序号',
                halign: 'center',
                align: 'center',
                width: '5%',
                formatter: function (value, row, index) {
                    return index + 1;
                }
            }
            ,
            {
                field: 'cerType',
                title: '证书类型',
                halign: 'center',
                width: '20%',
                cellStyle: function (value, row, index, field) {
                    return {classes: '', css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis','overflow': 'hidden'}};
                },
                formatter: function (value, row, index) {
                    value = value ==undefined?'-':value;
                    return '<span title="'+value+'">'+value+'</span>'
                }
            }, {
                field: 'certNo',
                title: '证书编号',
                halign: 'center',
                width: '20%',
                cellStyle: function (value, row, index, field) {
                    return {classes: '', css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis','overflow': 'hidden'}};
                },
                formatter: function (value, row, index) {
                    value = value ==undefined?'-':value;
                    return '<span title="'+value+'">'+value+'</span>'
                }
            },{
                field: 'startDate',
                title: '开始日期',
                halign: 'center',
                align: 'center',
                width: '20%',
                cellStyle: function (value, row, index, field) {
                    value = value ==undefined?'-':value;
                    return {classes: '', css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis','overflow': 'hidden'}};
                },
                formatter: function (value, row, index) {
                    value = value ==undefined?'-':value;
                    return '<span title="'+value+'">'+value+'</span>'
                }
            },{
                field: 'validity',
                title: '有效期',
                halign: 'center',
                align: 'center',
                width: '20%',
                cellStyle: function (value, row, index, field) {
                    return {classes: '', css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis','overflow': 'hidden'}};
                },
                formatter: function (value, row, index) {
                    value = value ==undefined?'-':value;
                    return '<span title="'+value+'">'+value+'</span>'
                }
            },{
                field: 'companyId',
                title: '所属企业',
                halign: 'center',
                cellStyle: function (value, row, index, field) {
                    return {classes: '', css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis','overflow': 'hidden'}};
                },
                formatter: function (value, row, index) {
                    value = value ==undefined?'-':value;
                    return '<span title="'+value+'">'+value+'</span>'
                }
            }]
    });

    $('#equipTable').bootstrapTable({
        height: scanHeight * 4 / 7,
        striped: true,      //是否显示行间隔色
        cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        method: 'get',//请求方式
        url: '/OverdueAlarm/getRealtimeAlarm',//请求url
        undefinedText: '-',
        clickToSelect: false,//是否启用点击选中行
        showRefresh: false,//是否显示 刷新按钮
        queryParams: function (pageReqeust) {
            pageReqeust.companyId = companyId;
            return pageReqeust;
        },
        rowStyle: function () {//自定义行样式
            return "bootTableRow";
        },
        onLoadSuccess:function (date) {
            if (date.length == 0){
                equipdiv=2;
            }else {
                equipdiv=1;
            }
            showDiv();
        },
        onLoadError: function () {
        },

        columns: [
            {

                title: '序号',
                width: '5%',
                formatter: function (value, row, index) {
                    return index + 1;
                }
            }
            ,
            {
                field: 'equipType',
                title: '设备类型',
                halign: 'center',
                width: '20%',
                cellStyle: function (value, row, index, field) {
                    return {classes: '', css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis','overflow': 'hidden'}};
                },
                formatter: function (value, row, index) {
                    value = value ==undefined?'-':value;
                    return '<span title="'+value+'">'+value+'</span>'
                }
            }, {
                field: 'alarmDate',
                title: '报警日期',
                halign: 'center',
                width: '20%',
                cellStyle: function (value, row, index, field) {
                    return {classes: '', css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis','overflow': 'hidden'}};
                },
                formatter: function (value, row, index) {
                    value = value ==undefined?'-':value;
                    return '<span title="'+value+'">'+value+'</span>'
                }
            },{
                field: 'realValue',
                title: '实时值',
                halign: 'center',
                width: '20%',
                cellStyle: function (value, row, index, field) {
                    return {classes: '', css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis','overflow': 'hidden'}};
                },
                formatter: function (value, row, index) {
                    value = value ==undefined?'-':value;
                    return '<span title="'+value+'">'+value+'</span>'
                }
            },{
                field: 'threshold',
                title: '阈值',
                halign: 'center',
                width: '20%',
                cellStyle: function (value, row, index, field) {
                    return {classes: '', css: {'white-space': 'nowrap', 'text-overflow': 'ellipsis','overflow': 'hidden'}};
                },
                formatter: function (value, row, index) {
                    value = value ==undefined?'-':value;
                    return '<span title="'+value+'">'+value+'</span>'
                }
            }]
    });
}

//加载所有企业集合
function loadCompanyList(companyList) {
    map.clearOverlays();
    $.each(companyList, function (i, n) {
        var tempPoint = new BMap.Point(n.longt, n.lat);
        var myIcon = new BMap.Icon("../../Images/Common/红点.png", new BMap.Size(50, 50));
        if (n.certificateAlarm>0&&n.realtimeAlarm==0){
            myIcon = new BMap.Icon("../../Images/Common/蓝点.png", new BMap.Size(50, 50));
        }
        var marker = new BMap.Marker(wgs2bd(tempPoint), {
            title: n.companyName,
            icon: myIcon
        });
        map.addOverlay(marker);
        marker.customData = {companyId: n.companyId};
        marker.addEventListener("onclick", onMarkClick);
    });

}

//企业点击事件
function onMarkClick(e) {
    companyId = e.target.customData.companyId;
    $("#equipDiv").hide();
    $("#cerDiv").hide();
    if(flagTable==0){
        initTable();
        flagTable=1;
    }else {
        $("#cerTable").bootstrapTable("refresh",{query:{companyId:companyId}});
        $("#equipTable").bootstrapTable("refresh",{query:{companyId:companyId}});
    }
}

/**
 * 列表加载后初始化模态窗
 */
function showDiv() {
    if (cerdiv==0||equipdiv==0){
        return;
    }
    if (cerdiv==1&&equipdiv==1){
        $("#equipDiv").show();
        $("#cerDiv").show();
        $('#cerInfo').collapse('show');
        $('#equipInfo').collapse('hide');
        //折叠框显示事件
        $('#cerInfo').on('shown.bs.collapse', function () {
            $('#equipInfo').collapse('hide');
        });
        //折叠框显示事件
        $('#equipInfo').on('shown.bs.collapse', function () {
            $('#cerInfo').collapse('hide');
        });
    } else if (cerdiv==1&&equipdiv==2){
        $("#cerDiv").show();
        $('#cerInfo').collapse('show');
    } else if (cerdiv==2&&equipdiv==1){
        $("#equipDiv").show();
        $('#equipInfo').collapse('show');
    } else if (cerdiv==2&&equipdiv==2){
        BootstrapDialog.alert({
            title: '提示',
            size: BootstrapDialog.SIZE_SMALL,
            message: '当前企业无预警！',
            type: BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
            closable: false, // <-- Default value is false
            draggable: true, // <-- Default value is false
            buttonLabel: '确定', // <-- Default value is 'OK',

        });
        cerdiv = 0;
        equipdiv =0;
        return;
    }
    cerdiv = 0;
    equipdiv =0;
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
function searchCompanyList(real) {
    var searchCompanyName = mini.get("searchCompanyName").getText();
    var searchScaleCode = mini.get("searchScaleCode").getValue();
    var searchTypeCode = mini.get("searchTypeCode").getValue();
    var searchAlarm = mini.get("alarm").getValue();
    var c=[];
    $.ajax({
        type: 'get',
        async: false,
        data: {
            searchCompanyName: searchCompanyName,
            searchScaleCode: searchScaleCode,
            searchTypeCode: searchTypeCode,
            searchAlarm: searchAlarm
        },
        url: '/OverdueAlarm/getAlarmCompanyList',
        success: function (result) {
            if (real){
                c=result;
            }else {
                loadCompanyList(result);
            }
        },
        error: function () {
        }
    });
    return c;
}


//清空查询条件
function clearSearch() {
    mini.get("searchCompanyName").setValue('');
    mini.get("searchScaleCode").setValue('');
    mini.get("searchTypeCode").setValue('');
}

//初始化socket连接
function initSocket(){
    // 建立连接对象（还未发起连接）
    var socket = new SockJS("http://"+window.location.hostname+":"+window.location.port+"/webSocketServer?a=b&c=d");

    // 获取 STOMP 子协议的客户端对象
    var stompClient = Stomp.over(socket);

    // 向服务器发起websocket连接并发送CONNECT帧
    stompClient.connect(
        {},
        function connectCallback(frame) {
            // 连接成功时（服务器响应 CONNECTED 帧）的回调方法
            // alert("连接成功");
            stompClient.subscribe('/topic/RealAlarmCompanyList', function (response) {
                var data = JSON.parse(response.body);
                var comlist = searchCompanyList(true);
                var c = [];
                $.each(comlist,function (i,n) {
                    $.each(data,function (a,b) {
                        if(n.companyId==b.companyId){
                            c.push(b);
                        }
                    })
                })
                loadCompanyList(c);

            });
        },
        function errorCallBack(error) {
            // 连接失败时（服务器响应 ERROR 帧）的回调方法
            alert("连接失败");
        }
    );
}

