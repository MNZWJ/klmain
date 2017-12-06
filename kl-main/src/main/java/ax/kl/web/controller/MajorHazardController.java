package ax.kl.web.controller;

import ax.kl.entity.ChemicalsInfo;
import ax.kl.entity.MajorHazard;
import ax.kl.service.MajorHazardService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 重大危险源分布图
 *
 * @author wangbiao
 * Date 2017/12/04
 */
@CrossOrigin
@Controller
@RequestMapping("/MajorHazard")
@Api(value = "/MajorHazard", tags = "重大危险源分布图")
public class MajorHazardController {

    @Autowired
    MajorHazardService majorHazardService;

    @RequestMapping(value = "/Index", method = RequestMethod.GET)
    @ApiOperation(value = "重大危险源分布图")
    public String doView() {
        return "/MajorHazard/MajorHazard";
    }

    /**
     * 获取重大危险源
     * @param param key为数据库字段，格式C_FILED；C为危险源表，D为公司表
     * @return
     */
    @RequestMapping(value = "/getMajorHazard", method = RequestMethod.POST)
    @ApiOperation(value = "获取重大危险源")
    @ResponseBody
    public List<MajorHazard> getMajorHazard(@RequestParam Map<String, String> param) {
        return majorHazardService.getMajorHazard(param);
    }

    @RequestMapping(value = "/getChemicalsInfoListBySourceId")
    @ApiOperation(value = "获取重大危险源")
    @ResponseBody
    public List<ChemicalsInfo> getChemicalsInfoListBySourceId(@RequestParam String sourceId) {
        return majorHazardService.getChemicalsInfoListBySourceId(sourceId);
    }
}
