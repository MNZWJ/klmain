var ply=null;
//加载遮罩区域
function getBoundary() {
    if (ply != null) {
        map.removeOverlay(ply);
    }
    var bdary = new BMap.Boundary();
    bdary.get("垦利区", function (rs) {       //获取行政区域
                                           //map.clearOverlays();        //清除地图覆盖物
                                           //添加遮罩层
                                           //思路：利用行政区划点的集合与外围自定义东南西北形成一个环形遮罩层
                                           //1.获取选中行政区划边框点的集合  rs.boundaries[0]
                                           //var strs = new Array();
                                           //strs = rs.boundaries[0].split(";");
                                           //var EN = "";    //行政区划东北段点的集合
                                           //var NW = ""; //行政区划西北段点的集合
                                           //var WS = ""; //行政区划西南段点的集合
                                           //var SE = ""; //行政区划东南段点的集合
                                           //var pt_e = strs[0]; //行政区划最东边点的经纬度
                                           //var pt_n = strs[0]; //行政区划最北边点的经纬度
                                           //var pt_w = strs[0]; //行政区划最西边点的经纬度
                                           //var pt_s = strs[0]; //行政区划最南边点的经纬度
                                           //var n1 = 0; //行政区划最东边点在点集合中的索引位置
                                           //var n2 = 0; //行政区划最北边点在点集合中的索引位置
                                           //var n3 = 0; //行政区划最西边点在点集合中的索引位置
                                           //var n4 = 0; //行政区划最南边点在点集合中的索引位置
                                           ////2.循环行政区划边框点集合找出最东南西北四个点的经纬度以及索引位置
                                           //for (var n = 0; n < strs.length; n++) {
                                           //    var pt_e_f = parseFloat(pt_e.split(",")[0]);
                                           //    var pt_n_f = parseFloat(pt_n.split(",")[1]);
                                           //    var pt_w_f = parseFloat(pt_w.split(",")[0]);
                                           //    var pt_s_f = parseFloat(pt_s.split(",")[1]);
                                           //    var sPt = new Array();
                                           //    try {
                                           //        sPt = strs[n].split(",");
                                           //        var spt_j = parseFloat(sPt[0]);
                                           //        var spt_w = parseFloat(sPt[1]);
                                           //        if (pt_e_f < spt_j) {   //东
                                           //            pt_e = strs[n];
                                           //            pt_e_f = spt_j;
                                           //            n1 = n;
                                           //        }
                                           //        if (pt_n_f < spt_w) {  //北
                                           //            pt_n_f = spt_w;
                                           //            pt_n = strs[n];
                                           //            n2 = n;
                                           //        }
                                           //        if (pt_w_f > spt_j) {   //西
                                           //            pt_w_f = spt_j;
                                           //            pt_w = strs[n];
                                           //            n3 = n;
                                           //        }
                                           //        if (pt_s_f > spt_w) {   //南
                                           //            pt_s_f = spt_w;
                                           //            pt_s = strs[n];
                                           //            n4 = n;
                                           //        }
                                           //    }
                                           //    catch (err) {
                                           //        alert(err);
                                           //    }
                                           //}
                                           ////3.得出东北、西北、西南、东南四段行政区划的边框点的集合
                                           //if (n1 < n2) {     //第一种情况 最东边点在索引前面
                                           //    for (var o = n1; o <= n2; o++) {
                                           //        EN += strs[o] + ";"
                                           //    }
                                           //    //判断西北
                                           //    if (n2 < n3) {
                                           //        for (var o = n2; o <= n3; o++) {
                                           //            NW += strs[o] + ";"
                                           //        }
                                           //    } else {
                                           //        for (var o = n2; o < strs.length; o++) {
                                           //            NW += strs[o] + ";"
                                           //        }
                                           //        for (var o = 0; o <= n3; o++) {
                                           //            NW += strs[o] + ";"
                                           //        }
                                           //    }
                                           //    for (var o = n3; o <= n4; o++) {
                                           //        WS += strs[o] + ";"
                                           //    }
                                           //    //判断东南
                                           //    if (n4 < n1) {
                                           //        for (var o = n4; o <= n1; o++) {
                                           //            SE += strs[o] + ";"
                                           //        }
                                           //    } else {
                                           //        for (var o = n4; o < strs.length; o++) {
                                           //            SE += strs[o] + ";"
                                           //        }
                                           //        for (var o = 0; o <= n1; o++) {
                                           //            SE += strs[o] + ";"
                                           //        }
                                           //    }
                                           //}
                                           //else {   //第二种情况 最东边点在索引后面
                                           //    for (var o = n1; o < strs.length; o++) {
                                           //        EN += strs[o] + ";"
                                           //    }
                                           //    for (var o = 0; o <= n2; o++) {
                                           //        EN += strs[o] + ";"
                                           //    }
                                           //    for (var o = n2; o <= n3; o++) {
                                           //        NW += strs[o] + ";"
                                           //    }
                                           //    for (var o = n3; o <= n4; o++) {
                                           //        WS += strs[o] + ";"
                                           //    }
                                           //    for (var o = n4; o <= n1; o++) {
                                           //        SE += strs[o] + ";"
                                           //    }
                                           //}
                                           //4.自定义外围边框点的集合
        var E_JW = "170.672126, 36.623555;";            //东
        var EN_JW = "170.672126, 81.291804;";       //东北角
        var N_JW = "105.913641, 81.291804;";        //北
        var NW_JW = "-169.604276,  81.291804;";     //西北角
        var W_JW = "-169.604276, 38.244136;";       //西
        var WS_JW = "-169.604276, -68.045308;";     //西南角
        var S_JW = "114.15563, -68.045308;";            //南
        var SE_JW = "170.672126, -68.045308 ;";         //东南角
        //4.添加环形遮罩层
        var ply1 = new BMap.Polygon(rs.boundaries[0] +";"+ E_JW + SE_JW + S_JW + WS_JW + W_JW + NW_JW + EN_JW + E_JW,
            { strokeColor: "none", fillColor: "#727272", strokeOpacity: 1, fillOpacity: 0.8, enableMassClear: false }); //建立多边形覆盖物
        map.addOverlay(ply1);  //遮罩物是半透明的，如果需要纯色可以多添加几层
        //5. 给目标行政区划添加边框，其实就是给目标行政区划添加一个没有填充物的遮罩层
        var ply = new BMap.Polygon(rs.boundaries[0], { strokeColor: "#ff8000", strokeWeight: 4, fillColor: "", enableMassClear: false });
        map.addOverlay(ply);
        //addXQ(bdary);
        //map.setViewport(ply.getPath());    //调整视野
    });
}
function addXQ(bdary) {
    var citys = new Array();
    citys = ["垦利区"];
    for (var i = 0; i < citys.length; i++) {
        bdary.get(citys[i], function (rs) {       //获取行政区域
            //map.clearOverlays();        //清除地图覆盖物
            var count = rs.boundaries.length; //行政区域的点有多少个
            for (var i = 0; i < count; i++) {
                var ply = new BMap.Polygon(rs.boundaries[i], { strokeWeight: 1, strokeColor: "#313131", fillColor: "" }); //建立多边形覆盖物
                map.addOverlay(ply);  //添加覆盖物
                //map.setViewport(ply.getPath());    //调整视野
            }
        });
    }
}