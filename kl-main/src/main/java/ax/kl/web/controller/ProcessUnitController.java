package ax.kl.web.controller;

import ax.f4j.model.JsonResult;
import ax.f4j.model.ResultUtil;
import ax.kl.entity.CompanyInfo;
import ax.kl.entity.EquipInfo;
import ax.kl.entity.ProcessUnit;
import ax.kl.service.BasicInfoEntryService;
import ax.kl.service.ProcessUnitService;
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
 * @author Created by mxl
 * @version 创建时间：${date} ${time}
 */
@CrossOrigin
@RequestMapping(value = "/ProcessUnit")
@Api(value = "/ProcessUnit",tags = "工艺单元")
@Controller
public class ProcessUnitController {

    @Autowired
    ProcessUnitService processUnitService;
    @Autowired
    BasicInfoEntryService basicInfoEntryService;

    @ApiOperation(value = "工艺单元主页面")
    @RequestMapping(value = "/Index", method = RequestMethod.GET)
    public String doView() {
        return "/ProcessUnit/ProcessUnit";
    }

    @ApiOperation(value = "保存工艺单元")
    @RequestMapping(value = "/saveData", method = RequestMethod.POST)
    @ResponseBody
    public JsonResult saveData(@RequestParam("cmd") String cmd) {
        String unitId=this.processUnitService.saveOrUpdateData(cmd);
        //返回主键
        return ResultUtil.success(unitId);
    }

    @ApiOperation(value = "根据searchName查找工艺单元")
    @RequestMapping(value = "/getProcessUnitList", method = RequestMethod.GET)
    @ResponseBody
    public Map<String,Object> getProcessUnitList(@RequestParam Map<String,String> paraMap, @RequestParam String searchName) {
        int pageSize=Integer.parseInt(paraMap.get("pageSize"));
        int pageNumber=Integer.parseInt(paraMap.get("pageNumber"));
        Page page=new Page();
        page.setCurrent(pageNumber);
        page.setSize(pageSize);

        Page<ProcessUnit> list = this.processUnitService.getProcessUnitList(page,searchName);
        Map<String,Object> map=new HashMap<>();
        map.put("total",list.getTotal());
        map.put("rows",list.getRecords());
        return map;
    }



    @RequestMapping(value = "/delProcessUnit",method= RequestMethod.POST)
    @ApiOperation(value = "删除数据")
    @ResponseBody
    public JsonResult delCompanyInfo(@RequestParam String ids){
        String[] idLists=ids.split(",");
        //直接删除
        this.processUnitService.delProcessUnit(idLists);
        return ResultUtil.success(00);
    }

    @ApiOperation("设工艺单元唯一编码校验")
    @RequestMapping(value = "/validateUniqueCode",method = RequestMethod.POST)
    @ResponseBody
    public JSONObject validateUniqueCode(@RequestParam Map<String,String> param){
        String uniqueCode = param.get("UniqueCodeU");
        Map<String,String> map =new HashMap<>(1);
        boolean result = processUnitService.validateUniqueCode(uniqueCode);
        JSONObject obj=new JSONObject();
        obj.put("valid",result);
        return obj;
    }
}
