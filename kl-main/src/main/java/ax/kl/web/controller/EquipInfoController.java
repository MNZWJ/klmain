package ax.kl.web.controller;

import ax.f4j.model.JsonResult;
import ax.f4j.model.ResultUtil;
import ax.kl.entity.EquipInfo;
import ax.kl.entity.EquipType;
import ax.kl.entity.TreeModel;
import ax.kl.service.EquipInfoService;
import ax.kl.service.EquipTypeService;
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
 * 设备信息
 * @author wangbiao
 */
@Controller
@CrossOrigin
@Api(value = "/EquipInfo",tags = "设备信息")
@RequestMapping("/EquipInfo")
public class EquipInfoController {

    @Autowired
    EquipInfoService equipInfoService;

    @ApiOperation("获取设备信息列表")
    @RequestMapping(value = "/getEquipInfoList",method = RequestMethod.GET)
    @ResponseBody
    public List<EquipInfo> getEquipInfoList(@RequestParam("unitId") String unitId){

        return equipInfoService.getEquipInfoList(unitId);
    }

    @ApiOperation("新增设备信息")
    @RequestMapping(value = "/saveEquipInfo",method = RequestMethod.POST)
    @ResponseBody
    public boolean saveEquipType(@RequestBody EquipInfo equipInfo){
        return equipInfoService.saveEquipInfo(equipInfo)==1;
    }

    @ApiOperation("删除设备信息")
    @RequestMapping(value = "/deleteEquipInfo",method = RequestMethod.POST)
    @ResponseBody
    public void deleteEquip(@RequestParam String ids){
        equipInfoService.deleteEquipInfo(ids);
    }

    @ApiOperation("设备唯一编码校验")
    @RequestMapping(value = "/validateEquipCode",method = RequestMethod.POST)
    @ResponseBody
    public JSONObject validateEquipCode(@RequestParam Map<String,String> param){
        String equipCode = param.get("EquipCode");
        Map<String,String> map =new HashMap<>(1);
        boolean result = equipInfoService.validateEquipCode(equipCode);
        JSONObject obj=new JSONObject();
        obj.put("valid",result);
        return obj;
    }

}
