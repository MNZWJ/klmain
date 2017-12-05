package ax.kl.web.controller;


import ax.kl.entity.CompanyInfo;
import ax.kl.service.InspectionService;
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
 * @date: Created in 10:22 2017/12/4
 * @modified By:
 */
@CrossOrigin
@Controller
@RequestMapping("/Inspection")
@Api(value = "/Inspection",tags = {"企业分布"})
public class InspectionController {

    @Autowired
    InspectionService inspectionService;

    @ApiOperation(value = "获取主页面")
    @RequestMapping(value="/Inspection",method= RequestMethod.GET)
    public String doView (Model model) {
        return "/Inspection/Inspection";
    }

    @RequestMapping("/getCompanyList")
    @ApiOperation(value="获取企业")
    @ResponseBody
    public List<CompanyInfo> getCompanyList(@RequestParam Map<String,String> param){
        return inspectionService.getCompanyList(param);
    }

    @RequestMapping("/getCompanyInfo")
    @ApiOperation(value="通过id获取企业信息")
    @ResponseBody
    public List<CompanyInfo> getCompanyInfo(@RequestParam String companyId){
        return inspectionService.getCompanyInfo(companyId);
    }

}
