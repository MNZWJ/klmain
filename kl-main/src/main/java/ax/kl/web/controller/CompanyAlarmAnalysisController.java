package ax.kl.web.controller;

import ax.kl.service.CompanyAlarmAnalysisService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

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
}
