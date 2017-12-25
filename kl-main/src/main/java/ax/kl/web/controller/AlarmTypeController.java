package ax.kl.web.controller;

import ax.f4j.model.JsonResult;
import ax.f4j.model.ResultUtil;
import ax.kl.entity.AlarmType;
import ax.kl.service.AlarmTypeService;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.plugins.Page;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * @author Created by mxl
 * @version 创建时间：${date} ${time}
 */
@CrossOrigin
@RequestMapping(value = "/AlarmType")
@Api(value = "/AlarmType",tags = "报警代码维护")
@Controller
public class AlarmTypeController {

    @Autowired
    AlarmTypeService alarmTypeService;

    @ApiOperation(value = "报警代码维护主页面")
    @RequestMapping(value = "/Index", method = RequestMethod.GET)
    public String doView() {
        return "/AlarmType/AlarmType";
    }

    @ApiOperation(value = "保存报警代码")
    @RequestMapping(value = "/saveData", method = RequestMethod.POST)
    @ResponseBody
    public JsonResult saveData(@RequestParam("cmd") String cmd) {
        String unitId=this.alarmTypeService.saveOrUpdateData(cmd);
        //返回主键
        return ResultUtil.success(unitId);
    }

    @ApiOperation(value = "根据searchName查找报警代码")
    @RequestMapping(value = "/getAlarmTypeList", method = RequestMethod.GET)
    @ResponseBody
    public Map<String,Object> getAlarmTypeList(@RequestParam Map<String,String> paraMap, @RequestParam String searchName) {
        int pageSize=Integer.parseInt(paraMap.get("pageSize"));
        int pageNumber=Integer.parseInt(paraMap.get("pageNumber"));
        Page page=new Page();
        page.setCurrent(pageNumber);
        page.setSize(pageSize);

        Page<AlarmType> list = this.alarmTypeService.getAlarmTypeList(page,searchName);
        Map<String,Object> map=new HashMap<>();
        map.put("total",list.getTotal());
        map.put("rows",list.getRecords());
        return map;
    }



    @RequestMapping(value = "/delAlarmType",method= RequestMethod.POST)
    @ApiOperation(value = "删除数据")
    @ResponseBody
    public JsonResult delAlarmType(@RequestParam String ids){
        String[] idLists=ids.split(",");
        //直接删除
        this.alarmTypeService.delAlarmType(idLists);
        return ResultUtil.success(00);
    }

    @ApiOperation("设报警类型唯一编码校验")
    @RequestMapping(value = "/validateTypeCode",method = RequestMethod.POST)
    @ResponseBody
    public JSONObject validateTypeCode(@RequestParam Map<String,String> param){
        String typeCode = param.get("typeCode");
        Map<String,String> map =new HashMap<>(1);
        boolean result = alarmTypeService.validateTypeCode(typeCode);
        JSONObject obj=new JSONObject();
        obj.put("valid",result);
        return obj;
    }
}
