package ax.kl.web.controller;

import ax.kl.entity.DangerSourceInfo;
import ax.kl.service.MajorDangerSourceInfoService;
import com.baomidou.mybatisplus.plugins.Page;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 重大危险源信息
 * @author mxl
 */
@CrossOrigin
@Controller
@RequestMapping("/MajorDangerSourceInfo")
@Api(value = "/MajorDangerSourceInfo", tags = "重大危险源信息")
public class MajorDangerSourceInfoController {
    @Autowired
    MajorDangerSourceInfoService MajorDangerSourceInfoService;

    @RequestMapping(value = "/MajorDangerSourceInfo", method = RequestMethod.GET)
    @ApiOperation(value = "重大危险源信息")
    public String doView() {
        return "/MajorDangerSourceInfo/Index";
    }

    /**
     * 获取重大危险源
     * @param param key为数据库字段，格式C_FILED；C为危险源表，D为公司表
     * @author
     * @return
     */
    @RequestMapping(value = "/getMajor", method = RequestMethod.GET)
    @ApiOperation(value = "获取重大危险源")
    @ResponseBody
    public Map<String,Object> getMajor(@RequestParam Map<String, String> param,@RequestParam String companyName, @RequestParam String sourceNmae,@RequestParam String rank) {
        int pageSize=Integer.parseInt(param.get("pageSize"));
        int pageNumber=Integer.parseInt(param.get("pageNumber"));
        Page page=new Page();
        page.setCurrent(pageNumber);
        page.setSize(pageSize);

        Page<DangerSourceInfo> list = MajorDangerSourceInfoService.getMajorInfo(page,companyName,sourceNmae,rank);
        Map<String,Object> map=new HashMap<>();
        map.put("total",list.getTotal());
        map.put("rows",list.getRecords());
        return map ;
    }

}
