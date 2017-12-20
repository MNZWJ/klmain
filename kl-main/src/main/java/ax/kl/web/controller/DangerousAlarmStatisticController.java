package ax.kl.web.controller;

import ax.kl.service.DangerousAlarmStatisticService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Map;

/**
 * @author: ZhenpengSu
 * @description:
 * @date: Created in 15:14 2017/12/18
 * @modified By:
 */
@Controller
@CrossOrigin
@Api(value = "/DangerousAlarmStatistic",tags = {"重大危险源报警统计"})
@RequestMapping("/DangerousAlarmStatistic")
public class DangerousAlarmStatisticController {

    @Autowired
    DangerousAlarmStatisticService dangerousAlarmStatisticService;

    @RequestMapping("/DangerousAlarmStatistic")
    @ApiOperation("获取页面")
    public String doView(Model model){
        return "/DangerousAlarmStatistic/DangerousAlarmStatistic";
    }

    @ApiOperation("获取今日报警类型占比")
    @RequestMapping(value = "/getAlarmTypeDay",method = RequestMethod.POST)
    @ResponseBody
    public List<Map<String,String>> getAlarmTypeDay(){
        return dangerousAlarmStatisticService.getAlarmTypeDay();
    }


    @ApiOperation("获取企业报警次数")
    @RequestMapping(value = "/getCompanyAlarmData",method = RequestMethod.GET)
    @ResponseBody
    public List<Map<String,String>> getCompanyAlarmData(){
        return dangerousAlarmStatisticService.getCompanyAlarmData();
    }



    @ApiOperation("获取今日设备类型报警数据")
    @RequestMapping(value = "/getEquipTypeAlarmToday",method = RequestMethod.POST)
    @ResponseBody
    public List<Map<String,String>> getEquipTypeAlarmToday(){
        return dangerousAlarmStatisticService.getEquipTypeAlarmToday();
    }


    @ApiOperation("获取设备类型数据")
    @RequestMapping(value = "/getEquipTypeList",method = RequestMethod.POST)
    @ResponseBody
    public List<Map<String,String>> getEquipTypeList(){
        return dangerousAlarmStatisticService.getEquipTypeList();
    }



    @ApiOperation("获取月度报警类型信息")
    @RequestMapping(value = "/getAlarmTypeMonth",method = RequestMethod.POST)
    @ResponseBody
    public List<Map<String,String>> getAlarmTypeMonth(){
        return dangerousAlarmStatisticService.getAlarmTypeMonth();
    }



    @ApiOperation("获取报警类型列表")
    @RequestMapping(value = "/getAlarmTypeList",method = RequestMethod.POST)
    @ResponseBody
    public List<Map<String,String>> getAlarmTypeList(){
        return dangerousAlarmStatisticService.getAlarmTypeList();
    }

    @ApiOperation("获取本月行业报警统计")
    @RequestMapping(value = "/getIndustryAlarmMonth",method = RequestMethod.POST)
    @ResponseBody
    public List<Map<String,String>> getIndustryAlarmMonth(){
        return dangerousAlarmStatisticService.getIndustryAlarmMonth();
    }


    @ApiOperation("本月行政区域报警情况统计")
    @RequestMapping(value = "/getAreaAlarmMonth",method = RequestMethod.POST)
    @ResponseBody
    public List<Map<String,String>> getAreaAlarmMonth(){
        return dangerousAlarmStatisticService.getAreaAlarmMonth();
    }


}
