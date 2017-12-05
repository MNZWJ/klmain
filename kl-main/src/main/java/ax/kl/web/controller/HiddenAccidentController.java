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
 * @date: Created in 18:49 2017/12/5
 * @modified By:
 */
@CrossOrigin
@Controller
@RequestMapping("/HiddenAccident")
@Api(value = "/HiddenAccident", tags = {"企业分布"})
public class HiddenAccidentController {

    @ApiOperation(value = "获取主页面")
    @RequestMapping(value = "/Index", method = RequestMethod.GET)
    public String doView(Model model) {
        return "/HiddenAccident/HiddenAccident";
    }
}
