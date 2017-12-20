package ax.kl.web.controller;

import ax.kl.entity.DangerSourceInfo;
import ax.kl.service.MajorDangerSourceInfoService;
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
    public Map<String,Object> getMajor(@RequestParam Map<String, String> param) {
        int pageSize=Integer.parseInt(param.get("pageSize"));
        int pageNumber=Integer.parseInt(param.get("pageNumber"));
        Page page=new Page();
        page.setCurrent(pageNumber);
        page.setSize(pageSize);

        Page<DangerSourceInfo> list = MajorDangerSourceInfoService.getMajorInfo(page,param);
        Map<String,Object> map=new HashMap<>();
        map.put("total",list.getTotal());
        map.put("rows",list.getRecords());
        return map ;
    }

    @RequestMapping(value = "/exportExcel", method = RequestMethod.GET)
    @ApiOperation(value = "导出重大危险源列表")
    public void exportExcel(HttpServletResponse response,@RequestParam String companyName,
                            @RequestParam String sourceName,@RequestParam String rank){
        try{
            // 最重要的就是使用SXSSFWorkbook，表示流的方式进行操作
            // 在内存中保持100行，超过100行将被刷新到磁盘
            SXSSFWorkbook wb = new SXSSFWorkbook(100);
            //1.1创建合并单元格对象
            CellRangeAddress callRangeAddress = new CellRangeAddress(0,0,0,10);//起始行,结束行,起始列,结束列
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
            cell.setCellValue("重大危险源信息列表");

            //3.2创建列标题;并且设置列标题
            Row row2 = sheet.createRow(1);
            String[] titles = {"企业名称","危险源名称","R值","危险源等级","备案编号","有效期",
                    "状态","可能引发事故类型","可能引发事故死亡人数","厂区边界外500米范围内人数估值","登记日期"};
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

            List<DangerSourceInfo> list = new ArrayList<DangerSourceInfo>();
            // 数据库中存储的数据行
            int page_size = 10000;
            // 求数据库中待导出数据的总行数
            int list_count = this.MajorDangerSourceInfoService.getExportMajorCount(companyName,sourceName,rank);
            // 根据行数求数据提取次数
            int export_times = list_count % page_size > 0 ? list_count / page_size
                    + 1 : list_count / page_size;
            // 按次数将数据写入文件
            for (int j = 0; j < export_times; j++) {
                list = this.MajorDangerSourceInfoService.getExportMajor(j,(j+1)*page_size,companyName,sourceName,rank);
                int len = list.size() < page_size ? list.size() : page_size;
                for (int i = 0; i < len; i++) {
                    Row row_value = sheet.createRow(j * page_size + i + 2);
                    Cell cel0_value = row_value.createCell(0);
                    cel0_value.setCellStyle(contentStyle);//设置样式
                    cel0_value.setCellValue(list.get(i).getCompanyId());

                    Cell cel1_value = row_value.createCell(1);
                    cel1_value.setCellStyle(contentStyle);//设置样式
                    cel1_value.setCellValue(list.get(i).getSourceName());

                    Cell cel2_value = row_value.createCell(2);
                    cel2_value.setCellValue(list.get(i).getRValue());
                    Cell cel3_value = row_value.createCell(3);
                    cel3_value.setCellValue(list.get(i).getRank());
                    Cell cel4_value = row_value.createCell(4);
                    cel4_value.setCellValue(list.get(i).getRecordNo());
                    Cell cel5_value = row_value.createCell(5);
                    cel5_value.setCellValue(list.get(i).getValidity());
                    Cell cel6_value = row_value.createCell(6);
                    cel6_value.setCellValue(list.get(i).getStatus());
                    Cell cel7_value = row_value.createCell(7);
                    cel7_value.setCellValue(list.get(i).getAccidentType());
                    Cell cel8_value = row_value.createCell(8);
                    cel8_value.setCellValue(list.get(i).getDeathToll());
                    Cell cel9_value = row_value.createCell(9);
                    cel9_value.setCellValue(list.get(i).getOutPersonCount());
                    Cell cel10_value = row_value.createCell(10);
                    cel10_value.setCellValue(list.get(i).getRecordDate());
                }
                list.clear(); // 每次存储len行，用完了将内容清空，以便内存可重复利用
            }

            //直接获取输出，直接输出excel（优先使用）
            OutputStream output=response.getOutputStream();
            response.reset();
            response.setHeader("Content-disposition", "attachment; filename="+ URLEncoder.encode("重大危险源列表.xlsx", "utf-8"));
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
