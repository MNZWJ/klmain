package ax.kl.web.controller;

import ax.kl.entity.MonitorTarget;
import ax.kl.entity.TreeModel;
import ax.kl.service.MonitorTargetService;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.plugins.Page;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 检测指标维护
 * @author wangbiao
 * Date 2017/12/19
 */
@Controller
@CrossOrigin
@Api(value = "/MonitorTarget",tags = "检测指标维护")
@RequestMapping("/MonitorTarget")
public class MonitorTargetController {

    @Autowired
    MonitorTargetService monitorTargetService;

    @ApiOperation(value = "/Index",tags = "展示指标维护页面")
    @RequestMapping("/Index")
    public String doView(){
        return "/MonitorTarget/Monitortarget";
    }

    @ApiOperation(value = "/getTargetTree",tags = "获取指标树")
    @RequestMapping(value = "/getTargetTree",method = RequestMethod.GET)
    @ResponseBody
    public List<TreeModel> getTargetTree(){
        return monitorTargetService.getTargetTree();
    }

    @ApiOperation(value = "/getTargetTable",tags = "获取指标列表")
    @RequestMapping(value = "/getTargetTable")
    @ResponseBody
    public Map<String,Object> getTargetTable(@RequestParam Map<String,String> param){
        int pageSize = Integer.parseInt(param.get("pageSize"));
        int pageNumber = Integer.parseInt(param.get("pageNumber"));
        Page  page =new Page();
        page.setSize(pageSize);
        page.setCurrent(pageNumber);
        Page<MonitorTarget> list = monitorTargetService.getTargetTable(page,param.get("pCode"));
        Map<String,Object> map =new HashMap<>();
        map.put("rows",list.getRecords());
        map.put("total",list.getTotal());
        return map;
    }

    @ApiOperation(value = "/validateCode",tags = "验证编码是否存在")
    @RequestMapping(value = "/validateCode",method = RequestMethod.POST)
    @ResponseBody
    public JSONObject validateCode(@RequestParam Map<String,String> param){
        Boolean result = monitorTargetService.validateCode(param.get("targetCode"));
        JSONObject obj=new JSONObject();
        obj.put("valid",result);
        return obj;
    }

    @ApiOperation("新增监测指标")
    @RequestMapping(value = "/saveTarget",method = RequestMethod.POST)
    @ResponseBody
    public void saveTarget(@RequestBody MonitorTarget monitorTarget){
         monitorTargetService.saveTarget(monitorTarget);
    }

    @ApiOperation("删除监测指标")
    @RequestMapping(value = "/deleteTarget",method = RequestMethod.POST)
    @ResponseBody
    public void deleteTarget(@RequestParam String ids){
        if (ids==null||"".equals(ids)){
            return;
        }
        String[] monitorTarget = ids.split(",");
        monitorTargetService.deleteTarget(monitorTarget);
    }
}
