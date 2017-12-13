package ax.kl.web.controller;

import ax.kl.entity.CompanyInfo;
import ax.kl.service.DangerousProcessCheckService;
import com.baomidou.mybatisplus.plugins.Page;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * @author Created by mxl
 * @version 创建时间：${date} ${time}
 */
@Controller
@CrossOrigin
@RequestMapping("/DangerousProcessCheck")
@Api(value = "DangerousProcessCheck", tags = "危险化学工艺")
public class DangerousProcessCheckController {
    @Autowired
    DangerousProcessCheckService DangerousProcessCheckService;

    @RequestMapping(value = "/DangerousProcessCheck", method = RequestMethod.GET)
    @ApiOperation(value = "危险化学工艺")
    public  String doView(){
        return  "/DangerousProcessCheck/DangerousProcessCheck";
    }

    /**
     * 获取危险化学品工艺
     * @param param key为数据库字段，格式C_FILED；C为危险源表，D为公司表
     * @author
     * @return
     */
    @RequestMapping(value = "/getProcess", method = RequestMethod.GET)
    @ApiOperation(value = "获取危险化学品工艺")
    @ResponseBody
    public Map<String,Object> getProcess(@RequestParam Map<String, String> param) {
        int pageSize=Integer.parseInt(param.get("pageSize"));
        int pageNumber=Integer.parseInt(param.get("pageNumber"));
        String companyName=param.get("companyName");
        String risk = param.get("risk");
        Page page=new Page();
        page.setCurrent(pageNumber);
        page.setSize(pageSize);

        Page<CompanyInfo> list = DangerousProcessCheckService.getProcessList(page,companyName,risk);
        Map<String,Object> map=new HashMap<>();
        map.put("total",list.getTotal());
        map.put("rows",list.getRecords());
        return map ;
    }

}
