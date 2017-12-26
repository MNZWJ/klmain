package ax.kl.web.controller;

import ax.kl.service.DangerSourceStatisticsService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 重大危险源统计
 * @author wangbiao
 */

@Controller
@CrossOrigin
@Api(value = "/DSourceStatistics",tags = "重大危险源统计")
@RequestMapping("/DSourceStatistics")
public class DangerSourceStatisticsController {

    @Autowired
    DangerSourceStatisticsService dSSService;

    @ApiOperation(value = "/Index",tags = "重大危险源统计")
    @RequestMapping("/Index")
    public String doView(){
        return "/DangerSourceStatistics/DangerSourceStatistics";
    }

    @ApiOperation(value = "/getFiveYearCountInfo",tags = "近五年重大危险源数量统计折线")
    @RequestMapping(value = "/getFiveYearCountInfo",method = RequestMethod.GET)
    @ResponseBody
    public List<Map<String,Object>> getFiveYearCountInfo(){
        return dSSService.getFiveYearCountInfo();
    }

    @ApiOperation(value = "/getFiveYearCountbarInfo",tags = "近五年重大危险源数量统计柱状图")
    @RequestMapping(value = "/getFiveYearCountbarInfo",method = RequestMethod.GET)
    @ResponseBody
    public List<Map<String,String>> getFiveYearCountbarInfo(){
        return dSSService.getFiveYearCountbarInfo();
    }

    @ApiOperation(value = "/getFiveYearAccitentTypeScale",tags = "近五年重大危险源可能引发事故类型统计折线")
    @RequestMapping(value = "/getFiveYearAccitentTypeScale",method = RequestMethod.GET)
    @ResponseBody
    public List<Map<String,Object>> getFiveYearAccitentTypeScale(){
        return dSSService.getFiveYearAccitentTypeScale();
    }

    @ApiOperation(value = "/getDSAccidenEquip",tags = "危险源涉及的存储设备类型占比")
    @RequestMapping(value = "/getDSAccidenEquip",method = RequestMethod.GET)
    @ResponseBody
    public List<Map<String,String>> getDSAccidenEquip(@RequestParam String typeId){
        return dSSService.getDSAccidenEquip(typeId);
    };

    @ApiOperation(value = "/getStandardRankScale",tags = "安全标准化级别占比")
    @RequestMapping(value = "/getStandardRankScale",method = RequestMethod.GET)
    @ResponseBody
    public List<Map<String,String>> getStandardRankScale(){
        return dSSService.getStandardRankScale();
    };

    @ApiOperation(value = "/getRankAndAccenTypeAreaInfo",tags = "安全标准化级别占比")
    @RequestMapping(value = "/getRankAndAccenTypeAreaInfo",method = RequestMethod.GET)
    @ResponseBody
    public List<Map<String,String>> getRankAndAccenTypeAreaInfo(@RequestParam String typeId){
        return dSSService.getRankAndAccenTypeAreaInfo(typeId);
    };

    @ApiOperation(value = "/getDeathTollInfo",tags = "重大危险源引发事故死亡人数统计")
    @RequestMapping(value = "/getDeathTollInfo",method = RequestMethod.GET)
    @ResponseBody
    public List<Map<String,Object>> getDeathTollInfo(){
        return dSSService.getDeathTollInfo();
    };
}
