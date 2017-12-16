package ax.kl.web.controller;

import ax.kl.entity.RealTimeWarn;
import ax.kl.service.RealTimeWarnService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author: ZhenpengSu
 * @description:
 * @date: Created in 14:37 2017/12/15
 * @modified By:
 */
@CrossOrigin
@Controller
@Api(value = "/RealTimeWarn",tags = {"实时预警"})
@RequestMapping("/RealTimeWarn")
public class RealTimeWarnController {

    @Autowired
    RealTimeWarnService realTimeWarnService;

    @ApiOperation(value="/Index")
    @RequestMapping(value = "/Index",method = RequestMethod.GET)
    public String doView( Model model){
        return "/RealTimeWarn/RealTimeWarn";
    }


    @ApiOperation("获取实时预警数据")
    @RequestMapping(value = "/getRealTimeWarnData",method = RequestMethod.POST)
    @ResponseBody
    public List<RealTimeWarn> getRealTimeWarnData(){
        return realTimeWarnService.getRealTimeWarnData();
    }
}
