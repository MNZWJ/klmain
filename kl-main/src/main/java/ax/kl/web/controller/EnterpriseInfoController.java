package ax.kl.web.controller;

import ax.kl.entity.ChemicalsInfo;
import ax.kl.entity.CompanyArt;
import ax.kl.entity.CompanyInfo;
import ax.kl.entity.DangerSourceInfo;
import ax.kl.service.EnterpriseInfoService;
import com.baomidou.mybatisplus.plugins.Page;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author Created by mxl
 * @version 创建时间：2017/12/11
 */
@Controller
@CrossOrigin
@RequestMapping("/EnterpriseInfo")
@Api(value = "/EnterpriseInfo",tags = "企业信息")
public class EnterpriseInfoController {
    @Autowired
    EnterpriseInfoService enterpriseInfoService;

    @RequestMapping(value = "/EnterpriseInfo", method = RequestMethod.GET)
    @ApiOperation(value = "企业信息")
    public String doView() {
        return "/EnterpriseInfo/EnterpriseInfo";
    }

    /**
     * 获取企业信息列表
     * @param
     * @author
     * @return
     */
    @RequestMapping(value = "/getCompanyInfoList", method = RequestMethod.GET)
    @ApiOperation(value = "获取企业信息列表")
    @ResponseBody
    public Map<String,Object> getCompanyInfoList(@RequestParam Map<String, String> param) {
        String companyName=param.get("companyName");
        String scaleCode=param.get("scaleCode");
        String typeCode=param.get("typeCode");
        String industryId=param.get("industryId");
        int pageSize=Integer.parseInt(param.get("pageSize"));
        int pageNumber=Integer.parseInt(param.get("pageNumber"));
        Page page=new Page();
        page.setCurrent(pageNumber);
        page.setSize(pageSize);

        Page<CompanyInfo> list = enterpriseInfoService.getCompanyInfoList(page,companyName,scaleCode,typeCode,industryId);
        Map<String,Object> map=new HashMap<>();
        map.put("total",list.getTotal());
        map.put("rows",list.getRecords());
        return map ;
    }
    @RequestMapping("/getCompanyList")
    @ApiOperation(value = "获取企业")
    @ResponseBody
    public List<CompanyInfo> getCompanyList(@RequestParam Map<String, String> param) {
        return enterpriseInfoService.getCompanyList(param);
    }
    @RequestMapping("/getCompanyInfo")
    @ApiOperation(value = "通过id获取企业信息")
    @ResponseBody
    public List<CompanyInfo> getCompanyInfo(@RequestParam String companyId) {
        return enterpriseInfoService.getCompanyInfo(companyId);
    }

    @RequestMapping("/getDangerSourceList")
    @ApiOperation(value = "通过id获取危险源")
    @ResponseBody
    public List<DangerSourceInfo> getDangerSourceList(@RequestParam("companyId") String companyId) {

        return enterpriseInfoService.getDangerSourceList(companyId);
    }


    @RequestMapping("/getChemicalsInfoList")
    @ApiOperation(value="获取化学品信息")
    @ResponseBody
    public List<ChemicalsInfo> getChemicalsInfoList(@RequestParam("companyId") String companyId){
        return enterpriseInfoService.getChemicalsInfoList(companyId);
    }


    @RequestMapping("/getCompanyArtList")
    @ApiOperation(value ="加载关联危险化学品信息" )
    @ResponseBody
    public List<CompanyArt> getCompanyArtList(@RequestParam("companyId")String companyId){
        return enterpriseInfoService.getCompanyArtList(companyId);
    }

}
