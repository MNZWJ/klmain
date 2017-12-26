
//模版下载
function downloadModel() {
    window.location.href= "./../../Temp/重大危险源信息导入模版.xlsx";
}

//文件的导入
function inputFile() {
    //导入框显示
    $('#importModal').modal('show');

    //bootstrap上传组件
    var oFileInput = new FileInput();
    //通过调用方法来进行文件导入
    oFileInput.Init("file", "/ProcessUnit/inputFile");

}

//初始化导入Div
function FileInput () {
    var oFile = new Object();

    //初始化fileinput控件（第一次初始化）
    oFile.Init = function(ctrlName, uploadUrl) {
        var control = $('#' + ctrlName);

        //初始化上传控件的样式
        control.fileinput({
            language: 'zh', //设置语言
            uploadUrl: uploadUrl, //上传的地址
            allowedFileExtensions: ['xls', 'xlsx'],//接收的文件后缀
            showUpload: true, //是否显示上传按钮
            showCaption: true,//是否显示被选文件的简介
            showPreview: false,//是否显示预览区域
            autoReplace: true,
            dropZoneEnabled: false,//是否显示拖拽区域
            showRemove: false,//显示移除按钮
            uploadLabel: '导入',
            browseClass: "btn btn-primary", //按钮样式
            maxFileCount: 1, //表示允许同时上传的最大文件个数
            enctype: 'multipart/form-data',
            validateInitialCount:true,
            previewFileIcon: "<i class='glyphicon glyphicon-level-up'></i>",
            fileActionSettings:{
                showRemove: true,
                showUpload: false,
                showZoom: false}
        });

        //导入文件上传完成之后的事件
        $("#file").on("fileuploaded", function (event, data, previewId, index) {
            $("#importModal").modal("hide");
            $("#MajorTable").bootstrapTable("refresh", {})
            clearDiv();
            BootstrapDialog.alert({
                title: '提示',
                size:BootstrapDialog.SIZE_SMALL,
                message: data.response,
                type: BootstrapDialog.TYPE_SUCCESS , // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                closable: false, // <-- Default value is false
                draggable: true, // <-- Default value is false
                buttonLabel: '确定', // <-- Default value is 'OK',
            });
        });
    }
    return oFile;
};

//表单清空导入记录
function clearDiv() {
    $("#fileDiv").html("<input type=\"file\" name=\"file\" id=\"file\" class=\"file-loading\"/>");
}