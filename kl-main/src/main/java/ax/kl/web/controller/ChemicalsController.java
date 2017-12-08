package ax.kl.web.controller;

import ax.kl.entity.ChemicalsInfo;
import ax.kl.service.ChemicalsInfoService;
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
 * 化学品列表展示
 * @author wangbiao
 * Date 2017/12/07
 */
@CrossOrigin
@Controller
@RequestMapping("/Chemicals")
@Api(value = "/Chemicals",tags = "化学品列表")
public class ChemicalsController {

    @Autowired
    ChemicalsInfoService chemicalsInfoService;

    @ApiOperation(value = "化学品列表页面")
    @RequestMapping(value = "/ChemicalsIndex", method = RequestMethod.GET)
    public String doView(){
        return "/Chemicals/ChemicalsIndex";
    }

    @ApiOperation(value = "获取化学品列表")
    @RequestMapping(value = "/getChemicalsList",method = RequestMethod.GET)
    @ResponseBody
    public Map<String,Object> getChemicalsList(@RequestParam Map<String,String> param){
        Page page =new Page();
        int pageSize=Integer.parseInt(param.get("pageSize"));
        int pageNumber=Integer.parseInt(param.get("pageNumber"));
        page.setCurrent(pageNumber);
        page.setSize(pageSize);
        Page<ChemicalsInfo> list=chemicalsInfoService.getChemicalsList(page,param);
        Map<String,Object> map=new HashMap<>();
        map.put("total",list.getTotal());
        map.put("rows",list.getRecords());
        return map;
    }
}
