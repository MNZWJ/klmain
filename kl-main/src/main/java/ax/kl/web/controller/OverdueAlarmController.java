package ax.kl.web.controller;

import ax.kl.entity.CompanyCertificate;
import ax.kl.entity.CompanyInfo;
import ax.kl.entity.RealtimeAlarmData;
import ax.kl.service.OverdueAlarmService;
import com.baomidou.mybatisplus.plugins.Page;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.xmlbeans.impl.xb.xsdschema.Public;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 超期运行预警
 * @author wangbiao
 * Date 2017/12/18
 */
@Controller
@CrossOrigin
@Api(value = "/OverdueAlarm",tags = "超期运行预警")
@RequestMapping("/OverdueAlarm")
public class OverdueAlarmController {
    @Autowired
    OverdueAlarmService overdueAlarmService;

    @ApiOperation(value = "/IndexView",tags = "超期运行预警主页面")
    @RequestMapping("/IndexView")
    public String doView(){
        return "/OverdueAlarm/OverdueAlarm";
    }

    @ApiOperation(value = "/getAlarmCompanyList",tags = "获取企业预警集合")
    @RequestMapping(value = "/getAlarmCompanyList",method = RequestMethod.GET)
    @ResponseBody
    public List<CompanyInfo> getAlarmCompanyList(@RequestParam Map<String,String> map){
        return overdueAlarmService.getAlarmCompanyList(map);
    }

    @ApiOperation(value = "/getCertificateAlarm",tags = "获取企业超期证书")
    @RequestMapping(value = "/getCertificateAlarm",method = RequestMethod.GET)
    @ResponseBody
    public List<CompanyCertificate> getCertificateAlarm(@RequestParam Map<String,String> param){
        List<CompanyCertificate> list = overdueAlarmService.getCertificateAlarm(param.get("companyId"));
        return list;
    }

    @ApiOperation(value = "/getRealtimeAlarm",tags = "获取实时报警列表")
    @RequestMapping(value = "/getRealtimeAlarm",method = RequestMethod.GET)
    @ResponseBody
    public List<RealtimeAlarmData> getRealtimeAlarm(@RequestParam Map<String,String> param){
        return overdueAlarmService.getRealtimeAlarm(param.get("companyId"));
    }
}
