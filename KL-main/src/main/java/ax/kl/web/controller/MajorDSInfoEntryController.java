package ax.kl.web.controller;

import ax.f4j.model.JsonResult;
import ax.f4j.model.ResultUtil;
import ax.kl.entity.CompanyInfo;
import ax.kl.entity.DangerSourceInfo;
import ax.kl.entity.FacilitiesCondition;
import ax.kl.entity.LegalProtection;
import ax.kl.service.MajorDSInfoEntryService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}
