package ax.kl.web.controller;

import ax.kl.entity.DangerSourceInfo;
import ax.kl.entity.EquipInfo;
import ax.kl.service.DynamicRiskCloudService;
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
 * @date: Created in 9:16 2017/12/18
 * @modified By:
 */
@Controller
@Api(value = "/DynamicRiskCloud",tags = {"动态风险云图"})
@CrossOrigin
@RequestMapping("/DynamicRiskCloud")
public class DynamicRiskCloudController {

    @Autowired
    DynamicRiskCloudService dynamicRiskCloudService;

    @ApiOperation(value = "获取页面")
    @RequestMapping(value = "/DynamicRiskCloud", method = RequestMethod.GET)
    public String doView(Model model) {

        return "/DynamicRiskCloud/DynamicRiskCloud";
    }

    @ApiOperation(value="加载危险源集合")
    @RequestMapping(value = "/getHazardList",method = RequestMethod.POST)
    @ResponseBody
    public List<DangerSourceInfo> getHazardList(@RequestParam Map<String,String> param){
        return dynamicRiskCloudService.getHazardList(param);
    }

    @ApiOperation("获取工艺单元信息")
    @RequestMapping(value = "/getProcessUnitData",method = RequestMethod.POST)
    @ResponseBody
    public List<Map<String,String>> getProcessUnitData(@RequestParam("sourceId")String sourceId){
        return dynamicRiskCloudService.getProcessUnitData(sourceId);
    }



    @ApiOperation("获取设备报警信息")
    @RequestMapping(value = "/getEquipAlarmInfo",method = RequestMethod.POST)
    @ResponseBody
    public Map<String,List<EquipInfo>> getEquipAlarmInfo(@RequestParam("sourceId") String sourceId){
        return dynamicRiskCloudService.getEquipAlarmInfo(sourceId);
    }

}
