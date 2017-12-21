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
    public Map<String,Object> getDataList(@RequestParam Map<String,String> paraMap) {
        int pageSize=Integer.parseInt(paraMap.get("pageSize"));
        int pageNumber=Integer.parseInt(paraMap.get("pageNumber"));
        Map<String,Object> map = this.MHistoryDataService.loadMonitorDataList(pageNumber,pageSize);
        return map ;
    }


}
