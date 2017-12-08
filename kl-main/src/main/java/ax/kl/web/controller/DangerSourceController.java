package ax.kl.web.controller;

import ax.kl.entity.ChemicalsInfo;
import ax.kl.entity.DangerSourceInfo;
import ax.kl.service.DangerSourceService;
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
 * 重大危险源分布图
 *
 * @author wangbiao
 * Date 2017/12/04
 */
@CrossOrigin
@Controller
@RequestMapping("/DangerSource")
@Api(value = "/DangerSource", tags = "重大危险源分布图")
public class DangerSourceController {

    @Autowired
    DangerSourceService dangerSourceService;

    @RequestMapping(value = "/Index", method = RequestMethod.GET)
    @ApiOperation(value = "重大危险源分布图")
    public String doView() {
        return "/DangerSource/DangerSource";
    }

    /**
     * 获取重大危险源
     * @param param key为数据库字段,value为值
     * @return
     */
    @RequestMapping(value = "/getSourceCoordinate", method = RequestMethod.GET)
    @ApiOperation(value = "获取重大危险源坐标")
    @ResponseBody
    public List<DangerSourceInfo> getMajorHazard(@RequestParam Map<String, String> param) {
        return dangerSourceService.getSourceCoordinate(param);
    }

    /**
     * 获取重大危险源
     * @param sourceId
     * @return
     */
    @RequestMapping(value = "/getDSourceInfo", method = RequestMethod.GET)
    @ApiOperation(value = "获取重大危险源详细信息")
    @ResponseBody
    public DangerSourceInfo getDSourceInfo(@RequestParam String sourceId) {
        return dangerSourceService.getDSourceInfo(sourceId);
    }

    @RequestMapping(value = "/getChemicalsInfoListBySourceId")
    @ApiOperation(value = "获取重大危险源化学品信息")
    @ResponseBody
    public Map<String,Object> getChemicalsInfoListBySourceId(@RequestParam Map<String,String> param) {
        Page page =new Page();
        int pageSize=Integer.parseInt(param.get("pageSize"));
        int pageNumber=Integer.parseInt(param.get("pageNumber"));
        String sourceId =param.get("sourceId");
        page.setCurrent(pageNumber);
        page.setSize(pageSize);
        Page<ChemicalsInfo> list=dangerSourceService.getChemicalsInfoListBySourceId(page,sourceId);
        Map<String,Object> map=new HashMap<>();
        map.put("total",list.getTotal());
        map.put("rows",list.getRecords());
        return map;
    }
}
