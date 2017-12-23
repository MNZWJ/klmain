package ax.kl.web.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;

@CrossOrigin
@Controller
@Api(value = "/InspectionStatistics",tags = "企业统计")
@RequestMapping("/InspectionStatistics")
public class InspectionStatisticsController {

    @ApiOperation(value = "/Index",tags = "企业统计")
    @RequestMapping("/Index")
    public String doView(){
        return "/Inspection/InspectionStatistics";
    }
}
