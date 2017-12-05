function HazardSearch() {
    var CompanyName="企业名称";
    var SourceName="危险源名称";
    var Rank="危险源等级";
    $.ajax({
        type:'post',
        url:'/MajorHazard/searchHazard',
        async:false,
        data:{CompanyName:CompanyName,SourceName:SourceName,Rank:Rank},
        success:function (result) {
            alert(result);
        }
    });
}

