package ax.kl.service.impl;

import ax.kl.entity.ChemicalCataLog;
import ax.kl.entity.ChemicalsInfo;
import ax.kl.entity.CompanyChemical;
import ax.kl.entity.CompanyInfo;
import ax.kl.mapper.BasicInfoEntryMapper;
import ax.kl.service.BasicInfoEntryService;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.plugins.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * 基本信息录入
 * @author Created by mxl
 * @version 创建时间：${date} ${time}
 */
@Transactional
@Service
public class BasicInfoEntryServiceImpl implements BasicInfoEntryService {
    @Autowired
    BasicInfoEntryMapper basicInfoEntryMapper;

    /**
     * 新增企业信息
     * @param cmd
     * @return
     */
    @Override
    public String  saveOrUpdateData(String  cmd){
        JSONObject jsstr = JSONObject.parseObject(cmd);
        CompanyInfo form=JSONObject.toJavaObject(jsstr.getJSONObject("form"),CompanyInfo.class);
        List<CompanyInfo> processTable=JSONObject.parseArray(jsstr.getString("processTable"),CompanyInfo.class);
        List<CompanyInfo> certTable=JSONObject.parseArray(jsstr.getString("certTable"),CompanyInfo.class);
        List<CompanyChemical> chemicalTable=JSONObject.parseArray(jsstr.getString("chemicalTable"),CompanyChemical.class);
        if("".equals(form.getCompanyId()) ||form.getCompanyId()==null){
            String CompanyId= UUID.randomUUID().toString();
            form.setCompanyId(CompanyId);
            this.basicInfoEntryMapper.saveData(form);
            String IndustryCode=form.getIndustryCode();
            if(IndustryCode!=null) {
                String[] industry = IndustryCode.split(",");
                this.basicInfoEntryMapper.saveQYHYData(industry, CompanyId);
            }
            if(processTable.size()>0) {
                this.basicInfoEntryMapper.saveProcessData(processTable, CompanyId);
            }
            if(certTable.size()>0) {
                this.basicInfoEntryMapper.saveCertData(certTable, CompanyId);
            }
            if(chemicalTable.size()>0) {
                this.basicInfoEntryMapper.saveChemicalData(chemicalTable, CompanyId);
            }
            return CompanyId;
        }else{
            String companyId = form.getCompanyId();
            form.setCompanyId(companyId);
            String IndustryCode=form.getIndustryCode();
            if(IndustryCode!=null) {
                String[] industry = IndustryCode.split(",");
                this.basicInfoEntryMapper.updateData(form);
                this.basicInfoEntryMapper.saveQYHYData(industry, companyId);
            }
            if(processTable.size()>0) {
                this.basicInfoEntryMapper.saveProcessData(processTable, companyId);
            }
            if(certTable.size()>0) {
                this.basicInfoEntryMapper.saveCertData(certTable, companyId);
            }
            if(chemicalTable.size()>0) {
                this.basicInfoEntryMapper.saveChemicalData(chemicalTable, companyId);
            }
            return "";
        }
    }

    /**
     * 通过ID获取公司信息
     * @param companyId
     * @return
     */
    @Override
    public List<CompanyInfo> getCompanyInfo(String companyId) {
        return basicInfoEntryMapper.getCompanyInfo(companyId);
    }

    /**
     * 通过ID获取公司证书信息
     * @param companyId
     * @return
     */
    @Override
    public List<CompanyInfo> getCompanyCertList(String companyId) {
        return basicInfoEntryMapper.getCompanyCertList(companyId);
    }

    /**
     * 通过ID删除公司信息
     * @param idLists
     */
    @Override
    @Transactional
    public void delCompanyInfo(String[] idLists) {
        //直接删除
        basicInfoEntryMapper.delCompanyInfo(idLists);
    }

    /**
     * 验证编码的唯一性
     * @param typeCode
     * @return true 不存在，false 存在
     */
    @Override
    public boolean validateTypeCode(String typeCode){
        int num = basicInfoEntryMapper.validateTypeCode(typeCode);
        boolean re = num == 0;
        return re;
    };

    /**
     * 获取化学品列表
     * @param param 过滤条件
     * @return
     */
    @Override
    public Page<ChemicalCataLog> getChemicalInfoList(Page page, Map<String, String> param) {
        page.setRecords(basicInfoEntryMapper.getChemicalInfoList(page,param.get("chemName"),param.get("cas")));
        return page;
    }

    /**
     * 通过ID获取公司化学品信息
     * @param companyId
     * @return
     */
    @Override
    public List<CompanyChemical> getChemicalList(String companyId) {
        return basicInfoEntryMapper.getChemicalList(companyId);
    }
}
