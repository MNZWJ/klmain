package ax.kl.web.controller;

import ax.kl.entity.ChemicalsInfo;
import ax.kl.entity.CompanyArt;
import ax.kl.entity.CompanyInfo;
import ax.kl.entity.DangerSourceInfo;
import ax.kl.service.EnterpriseInfoService;
import com.baomidou.mybatisplus.plugins.Page;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.util.ArrayList;
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
    @ApiOperation(value ="初始化危险工艺表格" )
    @ResponseBody
    public List<CompanyArt> getCompanyArtList(@RequestParam("companyId")String companyId){
        return enterpriseInfoService.getCompanyArtList(companyId);
    }

    @RequestMapping(value = "/exportExcel", method = RequestMethod.GET)
    @ApiOperation(value = "导出企业信息列表")
    public void exportExcel(HttpServletResponse response, @RequestParam String companyName,
                            @RequestParam String scaleCode, @RequestParam String typeCode,@RequestParam String industryId){
        try{
            // 最重要的就是使用SXSSFWorkbook，表示流的方式进行操作
            // 在内存中保持100行，超过100行将被刷新到磁盘
            SXSSFWorkbook wb = new SXSSFWorkbook(100);
            //1.1创建合并单元格对象
            CellRangeAddress callRangeAddress = new CellRangeAddress(0,0,0,9);//起始行,结束行,起始列,结束列
            //1.2头标题样式
            CellStyle headStyle = createCellStyle(wb,(short)16);
            //1.3列标题样式
            CellStyle colStyle = createCellStyle(wb,(short)13);

            Sheet sheet = wb.createSheet(); // 建立新的sheet对象
            //2.1加载合并单元格对象
            sheet.addMergedRegion(callRangeAddress);
            //设置默认列宽
            sheet.setDefaultColumnWidth(25);
            //3.创建行
            //3.1创建头标题行;并且设置头标题
            Row row = sheet.createRow(0);
            Cell cell = row.createCell(0);
            //加载单元格样式
            cell.setCellStyle(headStyle);
            cell.setCellValue("企业信息列表");

            //3.2创建列标题;并且设置列标题
            Row row2 = sheet.createRow(1);
            String[] titles = {"行政区域","企业名称","法人代表","联系方式","安全管理分级","标准化等级","经营状态",
                    "所属行业","企业规模","企业类型"};
            for(int i=0;i<titles.length;i++)
            {
                Cell cell2 = row2.createCell(i);
                //加载单元格样式
                cell2.setCellStyle(colStyle);
                cell2.setCellValue(titles[i]);
            }
            // ---------------------------
            //设置内容的格式
            CellStyle contentStyle = wb.createCellStyle();
            contentStyle.setWrapText(true);//设置自动换行
            contentStyle.setVerticalAlignment(VerticalAlignment.CENTER);//垂直居中

            List<CompanyInfo> list = new ArrayList<CompanyInfo>();
            // 数据库中存储的数据行
            int page_size = 10000;
            // 求数据库中待导出数据的总行数
            int list_count = this.enterpriseInfoService.getExportMajorCount(companyName,scaleCode,typeCode,industryId);
            // 根据行数求数据提取次数
            int export_times = list_count % page_size > 0 ? list_count / page_size
                    + 1 : list_count / page_size;
            // 按次数将数据写入文件
            for (int j = 0; j < export_times; j++) {
                list = this.enterpriseInfoService.getExportMajor(j,(j+1)*page_size,companyName,scaleCode,typeCode,industryId);
                int len = list.size() < page_size ? list.size() : page_size;
                for (int i = 0; i < len; i++) {
                    Row row_value = sheet.createRow(j * page_size + i + 2);
                    Cell cel0_value = row_value.createCell(0);
                    cel0_value.setCellStyle(contentStyle);//设置样式
                    cel0_value.setCellValue(list.get(i).getArea());
                    Cell cel1_value = row_value.createCell(1);
                    cel1_value.setCellStyle(contentStyle);//设置样式
                    cel1_value.setCellValue(list.get(i).getCompanyName());
                    Cell cel2_value = row_value.createCell(2);
                    cel2_value.setCellValue(list.get(i).getLegalPerson());
                    Cell cel3_value = row_value.createCell(3);
                    cel3_value.setCellValue(list.get(i).getContactWay());
                    Cell cel4_value = row_value.createCell(4);
                    cel4_value.setCellValue(list.get(i).getSafeManageRank());
                    Cell cel5_value = row_value.createCell(5);
                    cel5_value.setCellValue(list.get(i).getStandardRank());
                    Cell cel6_value = row_value.createCell(6);
                    cel6_value.setCellValue(list.get(i).getOperatingState());
                    Cell cel7_value = row_value.createCell(7);
                    cel7_value.setCellValue(list.get(i).getIndustryCode());
                    Cell cel8_value = row_value.createCell(8);
                    cel8_value.setCellValue(list.get(i).getScaleCode());
                    Cell cel9_value = row_value.createCell(9);
                    cel9_value.setCellValue(list.get(i).getTypeCode());
                }
                list.clear(); // 每次存储len行，用完了将内容清空，以便内存可重复利用
            }

            //直接获取输出，直接输出excel（优先使用）
            OutputStream output=response.getOutputStream();
            response.reset();
            response.setHeader("Content-disposition", "attachment; filename="+ URLEncoder.encode("企业信息列表.xlsx", "utf-8"));
            response.setContentType("application/msexcel");
            wb.write(output);
            output.close();
            wb.dispose();
        }catch (Exception e){

        }
    }


    /**
     *
     * @param workbook
     * @param fontsize
     * @return 单元格样式
     */
    private static CellStyle createCellStyle(SXSSFWorkbook workbook, short fontsize) {
        // TODO Auto-generated method stub
        CellStyle style = workbook.createCellStyle();
        style.setAlignment(HorizontalAlignment.CENTER);    //水平居中
        style.setVerticalAlignment(VerticalAlignment.CENTER);//垂直居中
        //创建字体
        Font font = workbook.createFont();
        font.setBold(true);
        font.setFontHeightInPoints(fontsize);
        //加载字体
        style.setFont(font);
        return style;
    }



}
