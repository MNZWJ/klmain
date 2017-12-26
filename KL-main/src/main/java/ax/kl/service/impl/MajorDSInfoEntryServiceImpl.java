package ax.kl.service.impl;

import ax.kl.entity.*;
import ax.kl.mapper.MajorDSInfoEntryMapper;
import ax.kl.service.MajorDSInfoEntryService;
import com.alibaba.fastjson.JSONObject;
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

import java.io.InputStream;
import java.util.*;

/**
 * 重大危险源信息录入
 * @author Created by mxl
 * @version 创建时间：${date} ${time}
 */

@Service
public class MajorDSInfoEntryServiceImpl implements MajorDSInfoEntryService {
    @Autowired
    MajorDSInfoEntryMapper  majorDSInfoEntryMapper;

    /**
     * 通过ID获取危险源信息
     * @param sourceId
     * @return
     */
    @Override
    public List<DangerSourceInfo> getSourceInfo(String sourceId) {
        return majorDSInfoEntryMapper.getSourceInfo(sourceId);
    }

    /**
     * 通过id获取装置设施周围环境
     * @param sourceId
     * @return
     */
    @Override
    public List<FacilitiesCondition> getSourceEquipList(String sourceId) {
        return majorDSInfoEntryMapper.getSourceEquipList(sourceId);
    }

    /**
     * 通过id获取法律保护区信息
     * @param sourceId
     * @return
     */
    @Override
    public List<LegalProtection> getSourceLegalList(String sourceId) {
        return majorDSInfoEntryMapper.getSourceLegalList(sourceId);
    }


    /**
     * 通过ID删除危险源信息
     * @param idLists
     */
    @Override
    @Transactional
    public void delSourceInfo(String[] idLists) {
        //直接删除
        majorDSInfoEntryMapper.delSourceInfo(idLists);
    }

    /**
     * 保存数据信息
     * @param cmd
     * @return
     */
    @Transactional
    @Override
    public String  saveOrUpdateData(String  cmd){
        JSONObject jsstr = JSONObject.parseObject(cmd);
        DangerSourceInfo form=JSONObject.toJavaObject(jsstr.getJSONObject("form"),DangerSourceInfo.class);
        List<FacilitiesCondition> processTable=JSONObject.parseArray(jsstr.getString("processTable"),FacilitiesCondition.class);
        List<LegalProtection> certTable=JSONObject.parseArray(jsstr.getString("certTable"),LegalProtection.class);
        List<CompanyChemical> chemicalTable=JSONObject.parseArray(jsstr.getString("chemicalTable"),CompanyChemical.class);
        if("".equals(form.getSourceId()) ||form.getSourceId()==null){
            String SourceId= UUID.randomUUID().toString();
            form.setSourceId(SourceId);
            this.majorDSInfoEntryMapper.saveData(form);
            String AccidentType=form.getAccidentType();
            if(AccidentType!=null) {
                String[] industry = AccidentType.split(",");
                this.majorDSInfoEntryMapper.saveSGLXData(industry, SourceId);
            }
            if(processTable.size()>0) {
                this.majorDSInfoEntryMapper.saveEquipData(processTable, SourceId);
            }
            if(certTable.size()>0) {
                this.majorDSInfoEntryMapper.saveLegalData(certTable, SourceId);
            }
            if(chemicalTable.size()>0) {
                this.majorDSInfoEntryMapper.saveChemicalData(chemicalTable, SourceId);
            }
            return SourceId;
        }else{
            String sourceId = form.getSourceId();
            String AccidentType=form.getAccidentType();
            form.setSourceId(sourceId);
            if(AccidentType!=null) {
                String[] industry = AccidentType.split(",");
                this.majorDSInfoEntryMapper.updateData(form);
                this.majorDSInfoEntryMapper.saveSGLXData(industry, sourceId);
            }
            if(processTable.size()>0) {
                this.majorDSInfoEntryMapper.saveEquipData(processTable, sourceId);
            }
            if(certTable.size()>0) {
                this.majorDSInfoEntryMapper.saveLegalData(certTable, sourceId);
            }
            if(chemicalTable.size()>0) {
                this.majorDSInfoEntryMapper.saveChemicalData(chemicalTable, sourceId);
            }
            return "";
        }
    }


    /**
     * 通过ID获取危险源化学品信息
     * @param sourceId
     * @return
     */
    @Override
    public List<CompanyChemical> getChemicalList(String sourceId) {
        return majorDSInfoEntryMapper.getChemicalList(sourceId);
    }


    /**
     * 获取化学品列表
     * @param param 过滤条件
     * @return
     */
    @Override
    public Page<ChemicalCataLog> getChemicalInfoByCompany(Page page, Map<String, String> param) {
        page.setRecords(majorDSInfoEntryMapper.getChemicalInfoByCompany(page,param.get("chemName"),param.get("cas"),param.get("companyId")));
        return page;
    }

    /**
     * 文件导入
     * @param file
     * @return
     */
    @Transactional
    @Override
    public String inputFile(MultipartFile file) {
        String companyId="";
        String sourceId="";
        InputStream is;
        POIFSFileSystem fs;
        Workbook book =null;
        String result ="";

        //存放文件中工艺单元的唯一编码
        List<String> pUniqueCode=new ArrayList<>();
        //存放文件中设备信息的唯一编码
        List<String> eUniqueCode=new ArrayList<>();
        String dangerRank="最轻,较轻,中等,很大,非常大";
        //计算保存成功条数
        int in =0;
        int ine=0;
        List<ProcessUnit> list =new ArrayList<ProcessUnit>();
        List<EquipInfo> list1 =new ArrayList<EquipInfo>();
        try {
            is = file.getInputStream();
            /**判断Excel版本*/
            if (file.getOriginalFilename().indexOf("xlsx")>-1){
                book = new XSSFWorkbook(is);
            }
            else {
                fs = new POIFSFileSystem(is);
                book = new HSSFWorkbook(fs);
            }
            if (book.getNumberOfSheets() ==0) {
                return "获取工作簿失败，请重新上传";
            }
            //导入第一页的重大危险源信息
            Sheet sheet = book.getSheetAt(0);
            int rowSum=sheet.getLastRowNum();
            //导入第二页的装置设施周围环境信息
            Sheet sheet1 = book.getSheetAt(1);
            int rowSum1=sheet1.getLastRowNum();
            //导入第三页的法律保护区信息
            Sheet sheet2 = book.getSheetAt(0);
            int rowSum2=sheet2.getLastRowNum();
            //导入第四页的危险源相关化学品信息
            Sheet sheet3 = book.getSheetAt(1);
            int rowSum13=sheet3.getLastRowNum();


        }catch (Exception e){
            System.out.printf("失败："+e.getMessage());
        }

        return "成功插入工艺单元"+in+"条。<br>成功插入设备信息"+ine+"条";
    }

    /**
     * 导入重大危险源信息
     *
     */
    private String importDangerSourceInfo(){
        return "";
    }

    /**
     * 导入装置设施周围环境信息
     *
     */
    private String importFacilitiesCondition(){
        return "";
    }

    /**
     * 导入法律保护区信息
     *
     */
    private String importLegalProtection(){
        return "";
    }

    /**
     * 导入危险源相关化学品信息
     *
     */
    private String importChemical(){
        return "";
    }


}
