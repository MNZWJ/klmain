package ax.kl.web.controller;

import ax.f4j.model.JsonResult;
import ax.f4j.model.ResultUtil;
import ax.kl.entity.ChemicalCataLog;
import ax.kl.entity.CompanyChemical;
import ax.kl.entity.CompanyInfo;
import ax.kl.service.BasicInfoEntryService;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.plugins.Page;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 企业信息录入
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

    /**
     * 获取化学品信息列表
     * @param
     * @author
     * @return
     */
    @RequestMapping(value = "/getChemicalInfoList", method = RequestMethod.GET)
    @ApiOperation(value = "获取化学品信息列表")
    @ResponseBody
    public Map<String,Object> getChemicalInfoList(@RequestParam Map<String, String> param) {
        int pageSize=Integer.parseInt(param.get("pageSize"));
        int pageNumber=Integer.parseInt(param.get("pageNumber"));
        Page page=new Page();
        page.setCurrent(pageNumber);
        page.setSize(pageSize);

        Page<ChemicalCataLog> list = basicInfoEntryService.getChemicalInfoList(page,param);
        Map<String,Object> map=new HashMap<>();
        map.put("total",list.getTotal());
        map.put("rows",list.getRecords());
        return map ;
    }

    @RequestMapping("/getChemicalList")
    @ApiOperation(value = "通过ID获取公司化学品信息")
    @ResponseBody
    public List<CompanyChemical> getChemicalList(@RequestParam String companyId) {
        return basicInfoEntryService.getChemicalList(companyId);
    }

    @ApiOperation(value = "导入企业信息")
    @RequestMapping(value = "/inputCompanyInfo",method = RequestMethod.POST)
    @ResponseBody
    public String inputCompanyInfo(@RequestParam("file") MultipartFile file){
        String result ="";
        try {
            result = basicInfoEntryService.inputCompanyInfo(file);
        }catch (Exception e){
            System.out.printf(e.getMessage());
            result = e.getMessage();
        }
        return result;
    }
}
