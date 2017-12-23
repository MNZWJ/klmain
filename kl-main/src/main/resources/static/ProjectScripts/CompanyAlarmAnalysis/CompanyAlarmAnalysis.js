var scanHeight="";
var startDate="";
var endDate="";
var companyName="";
$(function () {
    //获取浏览器高度
    scanHeight = $(window).height();

    initTable();


});
//初始化表格
function initTable(){
    var columns;
    var alarmType=[];
    $.ajax({
       type:'post',
        async:false,
       url:'/CompanyAlarmAnalysis/getAlarmTypeList',
        success:function(result){
            alarmType=result;
            columns=[
                [{

                    title: '序号',
                    field: 'number1',
                    formatter: function (value, row, index) {

                        return index + 1;
                    },
                    valign: "middle",
                    halign: 'center',
                    align: 'center',
                    colspan: 1,
                    rowspan: 2,
                    width:'8%'
                },
                {

                    title: '企业名称',
                    field: 'CompanyName',
                    valign: "middle",
                    halign: 'center',
                    align: 'center',
                    colspan: 1,
                    rowspan: 2,
                    width:'24%'
                },{

                    title: '报警统计',

                    halign: 'center',
                    align: 'center',
                    colspan: (result.length+1),
                    rowspan: 1,
                    width:'68%'
                }],[]

            ];
            columns[1].push({title: "合计",field:'totalNum',sortable : true,halign: 'center',align: 'center',colspan: 1,rowspan: 1,width:'140px'});
            $.each(result,function(i,n){
                columns[1].push({title: n.TypeName,field:n.TypeCode,sortable : true,halign: 'center',align: 'center',colspan: 1,rowspan: 1,width:'140px'});
            });

        }
    });

    $("#table").bootstrapTable("destroy");
    $('#table').bootstrapTable({
        height: scanHeight,
        striped: true,      //是否显示行间隔色
        cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        method: 'get',//请求方式
        url: '',//请求url
        pagination: false,//显示分页条
        paginationLoop: 'true',//启用分页条无限循环功能
        pageNumber: 1,                       //初始化加载第一页，默认第一页
        pageSize: 10,                       //每页的记录行数（*）
        pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
        toolbar: '#toolbar',                //工具按钮用哪个容器
        clickToSelect: false,//是否启用点击选中行
        // sidePagination: 'server',//'server'或'client'服务器端分页
        showRefresh: 'true',//是否显示 刷新按钮
        // queryParams: queryParams,
        // queryParamsType: '', //默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort
        // // 设置为 ''  在这种情况下传给服务器的参数为：pageSize,pageNumber
        sortStable: true,//设置为 true 将获得稳定的排序，我们会添加_position属性到 row 数据中。
        sortOrder: 'desc',
        rowStyle: function () {//自定义行样式
            return "bootTableRow";
        },
        onLoadError: function () {
            BootstrapDialog.alert({
                title: '错误',
                message: '表格加载失败！',
                size: BootstrapDialog.SIZE_SMALL,
                type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                closable: false, // <-- Default value is false
                draggable: true, // <-- Default value is false
                buttonLabel: '确定', // <-- Default value is 'OK',

            });
        },
        onClickRow: function (row, $element) {


        },
        columns:columns
    });
    $.ajax({
       type:'post',
       url:'/CompanyAlarmAnalysis/getAlarmNum',
        data:{startDate:startDate,endDate:endDate,companyName:companyName},
        success:function(result){
           $.each(result,function(i,n){
               var alarmData=n.num.split(',');
               //var totalNum = 0;
               $.each(alarmData,function (i,m) {
                   n[alarmType[i].TypeCode]=m;
                   //totalNum+=parseInt(m);
               })
               n.totalNum = n.totalNum;
           });

            $("#table").bootstrapTable("load", result);
        }
    });

    initTime();

    //初始化公司查询选择框
    $.ajax({
        type:'get',
        url:'/Inspection/getCompanyList',
        success:function (result) {
            var optionString = "<option value=''></option>";
            $.each(result,function(i,n){
                optionString += "<option value=\'"+ n.companyName +"\'>" + n.companyName + "</option>";
            });

            var myobj = document.getElementById('searchName');
            if (myobj.options.length == 0)
            {
                $("#searchName").html(optionString);
                $("#searchName").selectpicker('refresh');
            }

            $('.dropdown-menu, .inner').css('max-height','280px')

        }
    });

}

//初始化时间窗
function initTime(){
    $('#startDateDiv').datetimepicker({

        language: 'zh-CN',//显示中文
        format: 'yyyy-mm-dd',//显示格式
        minView: "month",//设置只显示到月份
        initialDate: new Date(),
        autoclose: true,//选中自动关闭
        todayBtn: true//显示今日按钮
    }).datetimepicker('setEndDate', new Date());

    $('#endDateDiv').datetimepicker({

        language: 'zh-CN',//显示中文
        format: 'yyyy-mm-dd',//显示格式
        minView: "month",//设置只显示到月份
        initialDate: new Date(),
        autoclose: true,//选中自动关闭
        todayBtn: true//显示今日按钮
    }).datetimepicker('setEndDate', new Date());;
    $('#startDateDiv').datetimepicker().on('changeDate',function(ev){
        $('#endDateDiv').datetimepicker('setStartDate', ev.date);
    });

    $('#endDateDiv').datetimepicker().on('changeDate',function(ev){
        $('#startDateDiv').datetimepicker('setEndDate', ev.date);
    });
}


//查询
function searchMenus(){
    startDate=$("#startDate").val();
    endDate=$("#endDate").val();
    companyName=$('#searchName').val();

    initTable();
}

//清空查询条件
function searchClear(){
    $('#searchName').selectpicker('val','');


    $('#startDate').val('');
    $('#startDateDiv').datetimepicker('update');
    $("#startDateDiv").datetimepicker('setEndDate', new Date());
    $('#endDate').val('');
    $('#endDateDiv').datetimepicker('update');
    $('#endDateDiv').datetimepicker('setStartDate','1979-12-12');

}
//适应页面大小
function resizePage(){


    //获取浏览器高度
    scanHeight = $(window).height();


    searchMenus();
}

