package ax.kl.web.controller;

import ax.kl.service.CompanyAlarmAnalysisService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * @author: ZhenpengSu
 * @description:
 * @date: Created in 13:34 2017/12/20
 * @modified By:
 */
@CrossOrigin
@Api(value = "/CompanyAlarmAnalysis",tags = {"企业报警对比分析"})
@RequestMapping("/CompanyAlarmAnalysis")
@Controller
public class CompanyAlarmAnalysisController {

    @Autowired
    CompanyAlarmAnalysisService companyAlarmAnalysisService;

    @ApiOperation("获取页面")
    @RequestMapping(value = "/CompanyAlarmAnalysis",method = RequestMethod.GET )
    public String doView(Model model){
        return "/CompanyAlarmAnalysis/CompanyAlarmAnalysis";
    }


    @ApiOperation("获取监测点类型")
    @RequestMapping(value = "/getAlarmTypeList",method = RequestMethod.POST )
    @ResponseBody
    public List<Map<String,String>> getAlarmTypeList(){
        return companyAlarmAnalysisService.getAlarmTypeList();
    }

    @ApiOperation("获取监测点类型")
    @RequestMapping(value = "/getAlarmNum",method = RequestMethod.POST )
    @ResponseBody
    public List<Map<String,String>> getAlarmNum(@RequestParam Map<String,String> param){

        String startDate="";
        String endDate="";
        String companyName="";
        if(param.containsKey("startDate")){
            startDate=param.get("startDate");
        }
        if(param.containsKey("endDate")){
            endDate=param.get("endDate");
        }
        if(param.containsKey("companyName")){
            companyName=param.get("companyName");
        }

        return companyAlarmAnalysisService.getAlarmNum(startDate,endDate,companyName);
    }

    @ApiOperation(value = "报警详细信息列表")
    @RequestMapping(value = "/getAlarmDataList", method = RequestMethod.GET)
    @ResponseBody
    public Map<String,Object> getDataList(@RequestParam Map<String,String> paraMap,@RequestParam String companyCode,
                                          @RequestParam String targetCode,@RequestParam String startDate,@RequestParam String endDate) {
        int pageSize=Integer.parseInt(paraMap.get("pageSize"));
        int pageNumber=Integer.parseInt(paraMap.get("pageNumber"));
        Map<String,Object> map = this.companyAlarmAnalysisService.loadAlarmDataList(pageNumber,pageSize,companyCode,
                targetCode,startDate,endDate);
        return map ;
    }

}
