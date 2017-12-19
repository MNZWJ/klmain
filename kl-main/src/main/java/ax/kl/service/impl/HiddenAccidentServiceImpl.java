package ax.kl.service.impl;

import ax.kl.entity.HiddenAccident;
import ax.kl.entity.DangerSourceInfo;
import ax.kl.mapper.HiddenAccidentMapper;
import ax.kl.service.HiddenAccidentService;
import com.baomidou.mybatisplus.plugins.Page;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
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
    public Page<HiddenAccident> getHiddenAllInfo(Page page,String dangerSource,String hiddenDanger){
        page.setRecords(hiddenAccidentMapper.getHiddenAllInfo(page,dangerSource,hiddenDanger));
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
        String result ="";
        Map<String,String> source = getSourceForName();
        int in =0;
        List<HiddenAccident> list =new ArrayList<HiddenAccident>();
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
                String columText = firstRow.getCell(i).getStringCellValue();
                if (columText!=null){
                    colum.put(columText,i);
                }
            }

            for (int i=1;i<rowCount;i++){
                Row row = sheet.getRow(i);
                if (row==null){
                    continue;
                }
                HiddenAccident hiddenAccident =new HiddenAccident();
                String value ="-";
                Cell cell =row.getCell(colum.get("序号"));
                if (cell!=null){
                    try {
                        value = cell.getStringCellValue();
                    }catch(Exception e){
                        value = cell.getNumericCellValue()+"";
                    }

                    if ("".equals(value)||value==null){
                        break;
                    }
                }
                cell =row.getCell(colum.get("重大危险源"));
                if (cell!=null){
                    value = cell.getStringCellValue();
                    if (value!=null&&source.containsKey(value)){
                        value=source.get(value);
                    }else {
                        return "导入失败：第"+ i + "行重大危险源未找到指定对象，请核对后再次导入";
                    }
                }

                hiddenAccident.setDangerSource(value);

                cell =row.getCell(colum.get("隐患描述"));
                if (cell!=null){
                    value=nvl(cell.getStringCellValue(),"-");
                }
                hiddenAccident.setHiddenDanager(value);

                cell =row.getCell(colum.get("行政区划"));
                if (cell!=null){
                    value=nvl(cell.getStringCellValue(),"-");
                }
                hiddenAccident.setArea(value);

                cell =row.getCell(colum.get("行业分类"));
                if (cell!=null){
                    value=nvl(cell.getStringCellValue(),"-");
                }
                hiddenAccident.setIndustry(value);

                cell =row.getCell(colum.get("隐患监管部门"));
                if (cell!=null){
                    value=nvl(cell.getStringCellValue(),"-");
                }
                hiddenAccident.setSuperviseDept(value);

                cell =row.getCell(colum.get("隐患来源"));
                if (cell!=null){
                    value=nvl(cell.getStringCellValue(),"-");
                }
                hiddenAccident.setSource(value);

                cell =row.getCell(colum.get("隐患类别"));
                if (cell!=null){
                    value=nvl(cell.getStringCellValue(),"-");
                }
                hiddenAccident.setCategory(value);

                cell =row.getCell(colum.get("隐患级别"));
                if (cell!=null){
                    value=nvl(cell.getStringCellValue(),"-");
                }
                hiddenAccident.setRank(value);

                cell =row.getCell(colum.get("上报日期"));
                if (cell!=null){
                    value=nvl(cell.getStringCellValue(),"-");
                }
                hiddenAccident.setUpReportDate(value);

                cell =row.getCell(colum.get("整改期限"));
                if (cell!=null){
                    value=nvl(cell.getStringCellValue(),"-");
                }
                hiddenAccident.setReformTerm(value);

                cell =row.getCell(colum.get("整改情况"));
                if (cell!=null){
                    value=nvl(cell.getStringCellValue(),"-");
                }
                hiddenAccident.setRectification(value);

                list.add(hiddenAccident);
                if (list.size()>100){
                    in += hiddenAccidentMapper.insertHiddenDanger(list);
                    list = new ArrayList<HiddenAccident>();
                }
            }
        }catch (Exception e){
            System.out.printf("失败："+e.getMessage());
        }

        if (list.size()>0){
            in += hiddenAccidentMapper.insertHiddenDanger(list);
        }
       return "成功插入"+in+"条。";
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

    private String nvl(String arg1,String arg2){
        return arg1==null?arg2:arg1;
    }
}
