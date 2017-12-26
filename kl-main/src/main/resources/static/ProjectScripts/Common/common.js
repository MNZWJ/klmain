//企业规模
var ScaleCodeDictId = 'c101f4c7-f8cd-4daa-a9fd-a274c69277a5';
//重大危险源等级
var MajorHazardRank = '8ea8562f-e58b-461c-9485-a967bc5e29ca';
//工业类型
var IndustryCodeDictId='29485cb6-bf2e-4892-ab3a-083ffbb2e6f9';
//企业类型
var TypeCodeDictId='22bd341b-5ea1-4364-a4cf-8496f3132492';
//垦利行政区域
var DirectAreaDictId='8b4524ce-15cf-404a-8182-a7e8a8d68343';
//危险化工工艺
var RiskProcessDictId = '7531554a-38a9-4470-a0d5-ceb18b71ebb8';
//一级重大危险源
var  SourceDangerIdOne="ece6d61a-7294-46ba-b8df-60bc838d9deb";
//二级重大危险源
var  SourceDangerIdTwo="b006c3bd-f7b5-402e-a7c9-74ea4a739d64";
//三级重大危险源
var  SourceDangerIdThree="5fc43c2b-4784-4b55-ac22-e982a2b98bce";
//四级重大危险源
var  SourceDangerIdFour="6d0eb494-6b77-4f97-be3d-0b2e675703d7";
//安管管理分级
var safeManageRankDictId = "05648f13-4f13-4cd9-9b46-8a35b1365f90";
//标准化等级
var standardRankDictId = "3aed6882-2f35-4949-a9ab-e60a9fb6a049";
//经营状态
var operatingStateDictId = "2ce1bda6-72ff-43e8-b5e0-ac846e2cc558";
//证书类型
var certTypeDictId = "5f56e334-4c7f-4ab6-9dea-94e826a2a5d4";
//事故类型
var acccidentTyptDictId = "61c44efb-ec19-4f92-9c47-507dee5b4bbe";
//危险源状态
var sourceStatusDictId = '65584600-2b72-4742-8ea8-d595bf6eca8a';
//组织机构类型
var orgnizeTypeDictId = '53';
//工艺单元危险等级
var processDangerRankDictId = '7959122e-bde5-4aa0-878c-cb0a0c56d154';
//法律保护区与规定符合性
var legalConformanceDictId = 'a437fd3b-4115-4de4-9152-2eea94794eae';
//装置设施与周围环境与标准符合性
var equipConformanceDictId = '236c2fff-0f01-41f3-9b32-d124f45c479b';
//工艺单元补偿后危险等级
var processAfterRankDictId = 'c59d2f8f-6047-41ac-a491-a1ec9b042c3e';
//工艺单元状态
var processStatusDictId = '894d88b3-318b-43a7-a101-c6825c995516';
//设备类型
var equipTypeDictId = '3973bc69-2c93-4505-b03e-bf58fdf3d963';
//设备状态
var processStatusDictId = '1c42a1c0-5701-47e2-894a-0987e70c58bd';



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

