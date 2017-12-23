package ax.kl.web.controller;

import ax.kl.entity.ChemicalsInfo;
import ax.kl.entity.DangerSourceInfo;
import ax.kl.service.DangerSourceService;
import com.baomidou.mybatisplus.plugins.Page;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 重大危险源分布图
 *
 * @author wangbiao
 * Date 2017/12/04
 */
@CrossOrigin
@Controller
@RequestMapping("/DangerSource")
@Api(value = "/DangerSource", tags = "重大危险源分布图")
public class DangerSourceController {

    @Autowired
    DangerSourceService dangerSourceService;

    @RequestMapping(value = "/Index", method = RequestMethod.GET)
    @ApiOperation(value = "重大危险源分布图")
    public String doView() {
        return "/DangerSource/DangerSource";
    }

    /**
     * 获取重大危险源
     * @param param key为数据库字段,value为值
     * @return
     */
    @RequestMapping(value = "/getSourceCoordinate", method = RequestMethod.GET)
    @ApiOperation(value = "获取重大危险源坐标")
    @ResponseBody
    public List<DangerSourceInfo> getMajorHazard(@RequestParam Map<String, String> param) {
        return dangerSourceService.getSourceCoordinate(param);
    }


    /**
     * 获取所有危险源
     * @return
     */
    @RequestMapping(value = "/getAllDSource", method = RequestMethod.GET)
    @ApiOperation(value = "获取所有危险源")
    @ResponseBody
    public List<DangerSourceInfo> getAllDSource() {
        return dangerSourceService.getAllDSource();
    }

    /**
     * 获取重大危险源
     * @param sourceId
 * @return
     */
    @RequestMapping(value = "/getDSourceInfo", method = RequestMethod.GET)
    @ApiOperation(value = "获取重大危险源详细信息")
    @ResponseBody
    public DangerSourceInfo getDSourceInfo(@RequestParam String sourceId) {
        return dangerSourceService.getDSourceInfo(sourceId);
    }

    @RequestMapping(value = "/getChemicalsInfoListTable")
    @ApiOperation(value = "获取重大危险源化学品列表信息")
    @ResponseBody
    public List<ChemicalsInfo> getChemicalsInfoListTable(@RequestParam Map<String,String> param) {
        String sourceId =param.get("sourceId");
        List<ChemicalsInfo> list=dangerSourceService.getChemicalsInfoListBySourceId(sourceId);
        return list;
    }

    @RequestMapping(value = "/getSourceRankCount")
    @ApiOperation(value = "获取重大危险源等级数量")
    @ResponseBody
    public List<Map<String,String>> getSourceRankCount(){
        return dangerSourceService.getSourceRankCount();
    }

    @RequestMapping(value = "/getDSAccidenType")
    @ApiOperation(value = "/getDSAccidenType",tags = "可能引发的事故类型数量")
    @ResponseBody
    public List<Map<String,String>> getDSAccidenType(){
        return dangerSourceService.getDSAccidenType();
    }

    @RequestMapping(value = "/getDSDistribution")
    @ApiOperation(value = "/getDSDistribution",tags = "重大危险源分布情况")
    @ResponseBody
    public List<Map<String,String>> getDSDistribution(){
        return dangerSourceService.getDSDistribution();
    }

    @RequestMapping(value = "/getDSIndustry")
    @ApiOperation(value = "/getDSIndustry",tags = "各行业重大危险源分布情况")
    @ResponseBody
    public List<Map<String,String>> getDSIndustry(){
        return dangerSourceService.getDSIndustry();
    };
}
