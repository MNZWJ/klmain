package ax.kl.web.controller;

import ax.kl.entity.HiddenAccident;
import ax.kl.service.HiddenAccidentService;
import com.baomidou.mybatisplus.plugins.Page;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.HashMap;
import java.util.Map;

/**
 * 基本信息-事故隐患
 * @author wangbiao
 * Date 2017/12/12
 */
@Controller
@CrossOrigin
@Api(value = "/HAccidentTable",tags = "事故隐患基本信息")
@RequestMapping("/HAccidentTable")
public class HAccidentTableController {

    @Autowired
    HiddenAccidentService hiddenAccidentService;

    @ApiOperation("事故隐患基本信息页面")
    @RequestMapping(value = "/HAccidentTable",method = RequestMethod.GET)
    public String doView(){
        return "/HiddenAccident/HAccidentTable";
    }

    @ApiOperation(value = "获取事故隐患列表")
    @RequestMapping(value = "/getHAccidentTable",method = RequestMethod.GET)
    @ResponseBody
    public Map<String,Object> getChemicalsList(@RequestParam Map<String,String> param){
        Page page =new Page();
        int pageSize=Integer.parseInt(param.get("pageSize"));
        int pageNumber=Integer.parseInt(param.get("pageNumber"));
        page.setCurrent(pageNumber);
        page.setSize(pageSize);
        String hiddenDanger = param.get("hiddenDanger");
        String dangerSource = param.get("dangerSource");
        Page<HiddenAccident> list=hiddenAccidentService.getHiddenAllInfo(page,dangerSource,hiddenDanger);
        Map<String,Object> map=new HashMap<>();
        map.put("total",list.getTotal());
        map.put("rows",list.getRecords());
        return map;
    }

    @ApiOperation(value = "导入事故隐患")
    @RequestMapping(value = "/inputHAccident",method = RequestMethod.POST)
    @ResponseBody
    public String inputHAccident(@RequestParam("file") MultipartFile file){
        String result ="";
        try {
            result = hiddenAccidentService.inputHAccident(file);
        }catch (Exception e){
            System.out.printf(e.getMessage());
            result = e.getMessage();
        }
        return result;
    }
}
