package ax.kl.web.controller;

import ax.f4j.model.JsonResult;
import ax.f4j.model.ResultUtil;
import ax.kl.entity.CompanyInfo;
import ax.kl.service.BasicInfoEntryService;
import com.alibaba.fastjson.JSONObject;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    @ApiOperation("验证编码的唯一性")
    @RequestMapping(value = "/validateTypeCode",method = RequestMethod.POST)
    @ResponseBody
    public JSONObject validateTypeCode(@RequestParam Map<String,String> param){
        String typecode = param.get("uniqueCode");
        Map<String,String> map =new HashMap<>(1);
        boolean result = basicInfoEntryService.validateTypeCode(typecode);
        JSONObject obj=new JSONObject();
        obj.put("valid",result);
        return obj;
    }
}
