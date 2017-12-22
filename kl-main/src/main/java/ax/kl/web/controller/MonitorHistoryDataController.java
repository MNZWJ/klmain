package ax.kl.web.controller;

import ax.kl.entity.ChemicalsInfo;
import ax.kl.entity.SysDataDict;
import ax.kl.service.ChemicalsInfoService;
import ax.kl.service.MHistoryDataService;
import ax.kl.service.SysDictionaryService;
import com.baomidou.mybatisplus.plugins.Page;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 化学品列表展示
 * @author wangbiao
 * Date 2017/12/07
 */
@CrossOrigin
@Controller
@RequestMapping("/MHistoryData")
@Api(value = "/MHistoryData",tags = "监测数据")
public class MonitorHistoryDataController {

    @Autowired
    MHistoryDataService MHistoryDataService;

    @ApiOperation(value = "监测数据页面")
    @RequestMapping(value = "/index", method = RequestMethod.GET)
    public String doView() {
        return "/MonitorHistoryData/index";
    }

    @ApiOperation(value = "获取监测数据列表")
    @RequestMapping(value = "/getDataList", method = RequestMethod.GET)
    @ResponseBody
    public Map<String,Object> getDataList(@RequestParam Map<String,String> paraMap,@RequestParam String companyCode,
                                          @RequestParam String resourceCode,@RequestParam String unitCode,@RequestParam String equipCode,
                                          @RequestParam String targetCode,@RequestParam String startdate,@RequestParam String enddate) {
        int pageSize=Integer.parseInt(paraMap.get("pageSize"));
        int pageNumber=Integer.parseInt(paraMap.get("pageNumber"));
        Map<String,Object> map = this.MHistoryDataService.loadMonitorDataList(pageNumber,pageSize,companyCode,resourceCode,unitCode,
                equipCode,targetCode,startdate,enddate);
        return map ;
    }

    @ApiOperation(value = "获取企业下拉框")
    @RequestMapping(value = "/getCompanyDict", method = RequestMethod.POST)
    @ResponseBody
    public Map<String,Map<String,String>> getCompanyDict() {
        Map<String,Map<String,String>> map = this.MHistoryDataService.getCompanyDict();
        return map ;
    }

    @ApiOperation(value = "获取重大危险源下拉框")
    @RequestMapping(value = "/getDresourceDict", method = RequestMethod.POST)
    @ResponseBody
    public Map<String,Map<String,String>> getDresourceDict(@RequestParam(required = false) String companyCode) {
        Map<String,Map<String,String>> map = this.MHistoryDataService.getDresourceDict(companyCode);
        return map ;
    }

    @ApiOperation(value = "获取工艺单元下拉框")
    @RequestMapping(value = "/getUnitDict", method = RequestMethod.POST)
    @ResponseBody
    public Map<String,Map<String,String>> getUnitDict(@RequestParam(required = false) String dresourceCode) {
        Map<String,Map<String,String>> map = this.MHistoryDataService.getUnitDict(dresourceCode);
        return map ;
    }

    @ApiOperation(value = "获取设备下拉框")
    @RequestMapping(value = "/getEquipDict", method = RequestMethod.POST)
    @ResponseBody
    public Map<String,Map<String,String>> getEquipDict(@RequestParam(required = false) String unitCode) {
        Map<String,Map<String,String>> map = this.MHistoryDataService.getEquipDict(unitCode);
        return map ;
    }

    @ApiOperation(value = "获取指标下拉框")
    @RequestMapping(value = "/getTargetDict", method = RequestMethod.GET)
    @ResponseBody
    public Map<String,Map<String,String>> getTargetDict() {
        Map<String,Map<String,String>> map = this.MHistoryDataService.getTargetDict();
        return map ;
    }

}
