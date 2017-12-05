package ax.kl.web.controller;

import ax.kl.entity.MajorHazard;
import ax.kl.service.MajorHazardService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin
@Controller
@RequestMapping("/MajorHazard")
@Api(value = "/MajorHazard",tags = "重大危险源分布图")
public class MajorHazardController {

    @Autowired
    MajorHazardService majorHazardService;
    @RequestMapping(value = "/Index",method = RequestMethod.GET)
    @ApiOperation(value = "重大危险源分布图")
    public String doView(){
        return "/MajorHazard/Index";
    }

    @RequestMapping(value = "/searchHazard",method= RequestMethod.POST)
    @ApiOperation(value = "获取重大危险源")
    @ResponseBody
    public List<MajorHazard> searchHazard(@RequestParam Map<String,String> param){
        return majorHazardService.getMajorHazard(param);
    }

    @RequestMapping(value = "/getHazardChe",method= RequestMethod.POST)
    @ApiOperation(value = "获取重大危险源")
    @ResponseBody
    public List<MajorHazard> getHazardData(@RequestParam String sourceId){
        return null;
    }
}
