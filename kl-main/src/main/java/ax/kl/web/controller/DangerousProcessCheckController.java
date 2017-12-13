package ax.kl.web.controller;

import ax.kl.entity.CompanyInfo;
import ax.kl.service.DangerousProcessCheckService;
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

    @RequestMapping(value = "/exportExcel", method = RequestMethod.GET)
    @ApiOperation(value = "导出危险工艺信息列表")
    public void exportExcel(HttpServletResponse response, @RequestParam String companyName,@RequestParam String risk){
        try{
            // 最重要的就是使用SXSSFWorkbook，表示流的方式进行操作
            // 在内存中保持100行，超过100行将被刷新到磁盘
            SXSSFWorkbook wb = new SXSSFWorkbook(100);
            //1.1创建合并单元格对象
            CellRangeAddress callRangeAddress = new CellRangeAddress(0,0,0,4);//起始行,结束行,起始列,结束列
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
            cell.setCellValue("危险工艺信息列表");

            //3.2创建列标题;并且设置列标题
            Row row2 = sheet.createRow(1);
            String[] titles = {"行政区域","企业名称","危险工艺名称","重点监控单元","企业性质"};
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
            int list_count = this.DangerousProcessCheckService.getExportMajorCount(companyName,risk);
            // 根据行数求数据提取次数
            int export_times = list_count % page_size > 0 ? list_count / page_size
                    + 1 : list_count / page_size;
            // 按次数将数据写入文件
            for (int j = 0; j < export_times; j++) {
                list = this.DangerousProcessCheckService.getExportMajor(j,(j+1)*page_size,companyName,risk);
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
                    cel2_value.setCellValue(list.get(i).getTechnologyName());
                    Cell cel3_value = row_value.createCell(3);
                    cel3_value.setCellValue(list.get(i).getMonitorUnit());
                    Cell cel4_value = row_value.createCell(4);
                    cel4_value.setCellValue(list.get(i).getCompanyType());
                }
                list.clear(); // 每次存储len行，用完了将内容清空，以便内存可重复利用
            }

            //直接获取输出，直接输出excel（优先使用）
            OutputStream output=response.getOutputStream();
            response.reset();
            response.setHeader("Content-disposition", "attachment; filename="+ URLEncoder.encode("危险化工信息列表.xlsx", "utf-8"));
            response.setContentType("application/msexcel");
            wb.write(output);
            output.close();
            wb.dispose();
        }catch (Exception e){

        }
    }


    /**
     *单元格样式
     * @param workbook
     * @param fontsize
     * @return
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
