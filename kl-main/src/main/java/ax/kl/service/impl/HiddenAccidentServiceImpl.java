package ax.kl.service.impl;

import ax.kl.entity.HiddenAccident;
import ax.kl.entity.DangerSourceInfo;
import ax.kl.mapper.HiddenAccidentMapper;
import ax.kl.service.HiddenAccidentService;
import com.baomidou.mybatisplus.plugins.Page;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author: ZhenpengSu
 * @description:
 * @date: Created in 9:56 2017/12/6
 * @modified By:
 */
@Transactional
@Service
public class HiddenAccidentServiceImpl implements HiddenAccidentService {

    @Autowired
    HiddenAccidentMapper hiddenAccidentMapper;

    @Override
    public List<DangerSourceInfo> getHazardList(Map<String,String> param) {
        String searchCompanyName="";
        String searchSourceName="";
        String searchRank="";
        String searchRankHidden="";

        if(param.containsKey("searchCompanyName")){
            searchCompanyName=param.get("searchCompanyName");
        }
        if(param.containsKey("searchSourceName")){
            searchSourceName=param.get("searchSourceName");
        }
        if(param.containsKey("searchRank")){
            searchRank=param.get("searchRank");
        }
        if(param.containsKey("searchRankHidden")){
            searchRankHidden=param.get("searchRankHidden");
        }


        return  hiddenAccidentMapper.getHazardList(searchCompanyName,searchSourceName,searchRank,searchRankHidden);
    }

    @Override
    public Page<HiddenAccident> getHiddenInfo(Page page, String sourceId,String searchName) {
        page.setRecords(hiddenAccidentMapper.getHiddenInfo(page,sourceId,searchName));
        return page;
    }

    /**
     * 获取所有隐患信息 无过滤-分页
     * @param page
     * @author wangbiao
     * @return
     */
    @Override
    public Page<HiddenAccident> getHiddenAllInfo(Page page,String dangerSource,String hiddenDanger,String rank,String rectification,String startdate,String enddate){
        page.setRecords(hiddenAccidentMapper.getHiddenAllInfo(page,dangerSource,hiddenDanger,rank,rectification,startdate,enddate));
        return page;
    };

    /**
     * 事故隐患插入
     * @param parmfile
     * @return
     */
    @Override
    public String inputHAccident(MultipartFile parmfile){
        InputStream is;
        POIFSFileSystem fs;
        Workbook book =null;
        Map<String,String> source = getSourceForName();
        //所有数据
        List<HiddenAccident> list =new ArrayList<HiddenAccident>();
        //分段倒入处理
        List<List<HiddenAccident>> input  =new ArrayList<>();
        try {
            is = parmfile.getInputStream();
            /**判断Excel版本*/
            if (parmfile.getOriginalFilename().indexOf("xlsx")>-1){
                book = new XSSFWorkbook(is);
            }
            else {
                fs = new POIFSFileSystem(is);
                book = new HSSFWorkbook(fs);
            }
            if (book.getNumberOfSheets() ==0){
                return "获取工作簿失败，请重新上传";
            }
            Sheet sheet = book.getSheetAt(0);
            if (sheet.getLastRowNum()<1){
                return "无上传数据，请确认后重新上传";
            }
            int rowCount = sheet.getLastRowNum()+1;
            Row firstRow = sheet.getRow(0);
            //列名称
            int columCount = firstRow.getLastCellNum();
            Map<String,Integer> colum =new HashMap<String, Integer>();
            for (int i=0;i<columCount;i++){
                Cell cell =firstRow.getCell(i);
                String columText = getCellValue(cell);
                if (columText!=null&&!"".equals(columText)){
                    colum.put(columText,i);
                }
            }

            for (int i=1;i<rowCount;i++){
                Row row = sheet.getRow(i);
                if (row==null){
                    continue;
                }
                HiddenAccident hiddenAccident =new HiddenAccident();
                String value ="";
                Cell cell =row.getCell(colum.get("重大危险源"));
                value = getCellValue(cell);
                if ("".equals(value)){
                    continue;
                } else if (source.containsKey(value)){
                    value=source.get(value);
                }else {
                    return "导入失败：第"+ i + "行重大危险源未找到指定对象，请核对后再次导入";
                }
                hiddenAccident.setDangerSource(value);

                cell =row.getCell(colum.get("隐患描述"));
                value =getCellValue(cell);
                hiddenAccident.setHiddenDanager(value);

                cell =row.getCell(colum.get("行政区划"));
                value =getCellValue(cell);
                hiddenAccident.setArea(value);

                cell =row.getCell(colum.get("行业分类"));
                value =getCellValue(cell);
                hiddenAccident.setIndustry(value);

                cell =row.getCell(colum.get("隐患监管部门"));
                value =getCellValue(cell);
                hiddenAccident.setSuperviseDept(value);

                cell =row.getCell(colum.get("隐患来源"));
                value =getCellValue(cell);
                hiddenAccident.setSource(value);

                cell =row.getCell(colum.get("隐患类别"));
                value =getCellValue(cell);
                hiddenAccident.setCategory(value);

                cell =row.getCell(colum.get("隐患级别"));
                value =getCellValue(cell);
                hiddenAccident.setRank(value);

                cell =row.getCell(colum.get("上报日期"));
                value =getCellValue(cell);
                hiddenAccident.setUpReportDate(value);

                cell =row.getCell(colum.get("整改期限"));
                value =getCellValue(cell);
                hiddenAccident.setReformTerm(value);

                cell =row.getCell(colum.get("整改情况"));
                value =getCellValue(cell);
                hiddenAccident.setRectification(value);

                list.add(hiddenAccident);

                //分段插入处理
                if (list.size()==100){
                    input.add(list);
                    list =new ArrayList<>();
                }
            }
        }catch (Exception e){
            System.out.printf("失败："+e.getMessage());
        }

        for (List<HiddenAccident> l:input){
            hiddenAccidentMapper.insertHiddenDanger(l);
        }
        if (list.size()>0){
            hiddenAccidentMapper.insertHiddenDanger(list);
        }
        String num =String.valueOf(input.size()*100+list.size());
       return "成功插入"+num+"条。";
    }

    /**
     * 获取重大危险源集合
     * @return
     */
    private Map<String,String> getSourceForName(){
        List<Map<String,String>> list =hiddenAccidentMapper.getSourceForName();
        Map<String,String> source =new HashMap<String, String>();
        for (Map<String,String> obj:list){
            source.put(obj.get("SourceName"),obj.get("SourceId"));
        }
        return source;
    }
    /**
     * 获取cell值
     * @param cell
     * @return
     */
    private String getCellValue(Cell cell) {
        String cellValue = "";
        if (cell == null){
            return "";
        }
        SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
        CellType cellType =cell.getCellTypeEnum();
        //字符串型
        if (cellType == CellType.STRING){
            cellValue = cell.getStringCellValue();
        }
        //数值型
        else if (cellType == CellType.NUMERIC){
            //判断是否为日期格式
            if (DateUtil.isCellDateFormatted(cell)){
                cellValue=sdf.format(cell.getDateCellValue());
            }else {
                cellValue = String.valueOf(cell.getNumericCellValue());
            }
        }
        //Boolean
        else if (cellType == CellType.BOOLEAN){
            cellValue = String.valueOf(cell.getBooleanCellValue());
        }
        //空值
        else if (cellType == CellType.BLANK){
            cellValue = "";
        }
        return cellValue;
    }
}
