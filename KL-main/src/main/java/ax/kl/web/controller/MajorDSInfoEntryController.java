package ax.kl.web.controller;

import ax.f4j.model.JsonResult;
import ax.f4j.model.ResultUtil;
import ax.kl.entity.*;
import ax.kl.service.MajorDSInfoEntryService;
import com.baomidou.mybatisplus.plugins.Page;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author Created by mxl
 * @version 创建时间：${date} ${time}
 */
@CrossOrigin
@RequestMapping(value = "/MajorDSInfoEntry")
@Api(value = "/MajorDSInfoEntry",tags = "重大危险源信息录入")
@Controller
public class MajorDSInfoEntryController {
    @Autowired
    MajorDSInfoEntryService majorDSInfoEntryService;

    @RequestMapping(value = "/MajorDSInfoEntry", method = RequestMethod.GET)
    @ApiOperation(value = "重大危险源信息录入")
    public String doView() {
        return "/MajorDSInfoEntry/MajorDSInfoEntry";
    }

    @RequestMapping("/getSourceInfo")
    @ApiOperation(value = "通过id获取危险源信息")
    @ResponseBody
    public List<DangerSourceInfo> getSourceInfo(@RequestParam String sourceId) {
        return majorDSInfoEntryService.getSourceInfo(sourceId);
    }
    @RequestMapping("/getSourceEquipList")
    @ApiOperation(value = "通过id获取装置设施周围环境")
    @ResponseBody
    public List<FacilitiesCondition> getSourceEquipList(@RequestParam String sourceId) {
        return majorDSInfoEntryService.getSourceEquipList(sourceId);
    }

    @RequestMapping("/getSourceLegalList")
    @ApiOperation(value = "通过id获取法律保护区信息")
    @ResponseBody
    public List<LegalProtection> getSourceLegalList(@RequestParam String sourceId) {
        return majorDSInfoEntryService.getSourceLegalList(sourceId);
    }

    @RequestMapping(value = "/delSourceInfo",method= RequestMethod.POST)
    @ApiOperation(value = "删除数据")
    @ResponseBody
    public JsonResult delSourceInfo(@RequestParam String sourceId){
        String[] idLists=sourceId.split(",");
        //直接删除
        this.majorDSInfoEntryService.delSourceInfo(idLists);
        return ResultUtil.success(00);
    }

    @ApiOperation(value = "保存信息")
    @RequestMapping(value = "/saveData", method = RequestMethod.POST)
    @ResponseBody
    public JsonResult saveData(@RequestParam("cmd") String cmd) {
        String SourceId=this.majorDSInfoEntryService.saveOrUpdateData(cmd);
        return ResultUtil.success(SourceId);
    }

    @RequestMapping("/getChemicalList")
    @ApiOperation(value = "通过ID获取危险源化学品信息")
    @ResponseBody
    public List<CompanyChemical> getChemicalList(@RequestParam String sourceId) {
        return majorDSInfoEntryService.getChemicalList(sourceId);
    }


    /**
     *获取所属企业下的化学品信息列表
     * @param param
     * @return
     */
    @RequestMapping(value = "/getChemicalInfoByCompany", method = RequestMethod.GET)
    @ApiOperation(value = "获取所属企业下的化学品信息列表")
    @ResponseBody
    public Map<String,Object> getChemicalInfoByCompany(@RequestParam Map<String, String> param) {
        int pageSize=Integer.parseInt(param.get("pageSize"));
        int pageNumber=Integer.parseInt(param.get("pageNumber"));
        Page page=new Page();
        page.setCurrent(pageNumber);
        page.setSize(pageSize);

        Page<ChemicalCataLog> list1 = majorDSInfoEntryService.getChemicalInfoByCompany(page,param);
        Map<String,Object> map=new HashMap<>();
        map.put("total",list1.getTotal());
        map.put("rows",list1.getRecords());
        return map ;
    }

    @ApiOperation(value = "导入事故隐患")
    @RequestMapping(value = "/inputFile",method = RequestMethod.POST)
    @ResponseBody
    public String inputHAccident(@RequestParam("file") MultipartFile file){
        String result ="";
        try {
            result = this.majorDSInfoEntryService.inputFile(file);
        }catch (Exception e){
            System.out.printf(e.getMessage());
            result = e.getMessage();
        }
        return result;
    }
}
