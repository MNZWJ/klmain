package ax.kl.web.controller;

import ax.f4j.model.JsonResult;
import ax.f4j.model.ResultUtil;
import ax.kl.entity.CompanyInfo;
import ax.kl.service.BasicInfoEntryService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author Created by mxl
 * @version 创建时间：${date} ${time}
 */
@CrossOrigin
@RequestMapping(value = "/BasicInfoEntry")
@Api(value = "/BasicInfoEntry",tags = "企业信息录入")
@Controller
public class BasicInfoEntryController {

    @Autowired
    BasicInfoEntryService basicInfoEntryService;

    @ApiOperation(value = "企业信息录入")
    @RequestMapping(value = "/BasicInfoEntry", method = RequestMethod.GET)
    public String doView() {
        return "/BasicInfoEntry/BasicInfoEntry";
    }

    @ApiOperation(value = "保存企业信息")
    @RequestMapping(value = "/saveData", method = RequestMethod.POST)
    @ResponseBody
    public JsonResult saveData(@RequestParam("cmd") String cmd) {
        System.out.println("cmd:"+cmd);
        String CompanyId=this.basicInfoEntryService.saveOrUpdateData(cmd);
        return ResultUtil.success(CompanyId);
    }

    @RequestMapping("/getCompanyInfo")
    @ApiOperation(value = "通过id获取企业信息")
    @ResponseBody
    public List<CompanyInfo> getCompanyInfo(@RequestParam String companyId) {
        return basicInfoEntryService.getCompanyInfo(companyId);
    }

    @RequestMapping(value = "/delCompanyInfo",method= RequestMethod.POST)
    @ApiOperation(value = "删除数据")
    @ResponseBody
    public JsonResult delCompanyInfo(@RequestParam String companyId){
        String[] idLists=companyId.split(",");
        //直接删除
        this.basicInfoEntryService.delCompanyInfo(idLists);
        return ResultUtil.success(00);
    }

    @RequestMapping("/getCompanyCertList")
    @ApiOperation(value = "通过id获取企业证书信息")
    @ResponseBody
    public List<CompanyInfo> getCompanyCertList(@RequestParam String companyId) {
        return basicInfoEntryService.getCompanyCertList(companyId);
    }
}
