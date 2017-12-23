package ax.kl.service.impl;

import ax.kl.entity.*;
import ax.kl.mapper.MajorDSInfoEntryMapper;
import ax.kl.service.MajorDSInfoEntryService;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.plugins.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * 重大危险源信息录入
 * @author Created by mxl
 * @version 创建时间：${date} ${time}
 */
@Transactional
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
            String sourceId = processTable.get(0).getSourceId();
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

}
