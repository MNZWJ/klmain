package ax.kl.web.controller;

import ax.kl.entity.HiddenAccident;
import ax.kl.entity.DangerSourceInfo;
import ax.kl.service.HiddenAccidentService;
import com.baomidou.mybatisplus.plugins.Page;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author: ZhenpengSu
 * @description:
 * @date: Created in 18:49 2017/12/5
 * @modified By:
 */
@CrossOrigin
@Controller
@RequestMapping("/HiddenAccident")
@Api(value = "/HiddenAccident", tags = {"企业分布"})
public class HiddenAccidentController {

    @Autowired
    HiddenAccidentService hiddenAccidentService;

    @ApiOperation(value = "获取主页面")
    @RequestMapping(value = "/Index", method = RequestMethod.GET)
    public String doView(Model model) {
        return "/HiddenAccident/HiddenAccident";
    }

    @ApiOperation(value="加载危险源集合")
    @RequestMapping(value = "/getHazardList",method = RequestMethod.POST)
    @ResponseBody
    public List<DangerSourceInfo> getHazardList(@RequestParam Map<String,String> param){
        return hiddenAccidentService.getHazardList(param);
    }

    @ApiOperation(value="获取隐患治理信息")
    @RequestMapping(value = "/getHiddenInfo",method = RequestMethod.GET)
    @ResponseBody
    public Map<String,Object>  getHiddenInfo(@RequestParam Map<String,String> param,@RequestParam("sourceId") String sourceId){
        int pageSize=Integer.parseInt(param.get("pageSize"));
        int pageNumber=Integer.parseInt(param.get("pageNumber"));
        Page page=new Page();
        page.setCurrent(pageNumber);
        page.setSize(pageSize);
        Page<HiddenAccident> list = hiddenAccidentService.getHiddenInfo(page,sourceId);
        Map<String,Object> map=new HashMap<>();
        map.put("total",list.getTotal());
        map.put("rows",list.getRecords());
        return map ;
    }


}
