package ax.kl.web.controller;

import ax.kl.entity.DangerSourceInfo;
import ax.kl.service.RiskCloudService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * @author: ZhenpengSu
 * @description:
 * @date: Created in 18:03 2017/12/11
 * @modified By:
 */
@Controller
@CrossOrigin
@RequestMapping("/RiskCloud")
@Api(value = "/RiskCloud",tags = {"固有风险云图"})
public class RiskCloudController {

    @Autowired
    RiskCloudService riskCloudService;

    @ApiOperation(value = "获取页面")
    @RequestMapping(value = "/RiskCloud", method = RequestMethod.GET)
    public String doView(Model model) {

        return "/RiskCloud/RiskCloud";
    }

    @ApiOperation(value="加载危险源集合")
    @RequestMapping(value = "/getHazardList",method = RequestMethod.POST)
    @ResponseBody
    public List<DangerSourceInfo> getHazardList(@RequestParam Map<String,String> param){
        return riskCloudService.getHazardList(param);
    }

}
