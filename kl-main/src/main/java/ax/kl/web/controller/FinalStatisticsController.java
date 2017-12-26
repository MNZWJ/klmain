package ax.kl.web.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * @author: ZhenpengSu
 * @description:
 * @date: Created in 17:43 2017/12/26
 * @modified By:
 */
@Controller
@CrossOrigin
@Api(value = "/FinalStatistics",tags = {"总统计图"})
@RequestMapping("/FinalStatistics")
public class FinalStatisticsController {

    @ApiOperation("页面")
    @RequestMapping(value = "/FinalStatistics",method = RequestMethod.GET)
    public String doView(Model model){
        return "/FinalStatistics/FinalStatistics";
    }
}
