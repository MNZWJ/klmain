package ax.kl.service.impl;

import ax.kl.entity.CompanyInfo;
import ax.kl.mapper.BasicInfoEntryMapper;
import ax.kl.service.BasicInfoEntryService;
import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
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
        System.out.print(cmd);
        JSONObject jsstr = JSONObject.parseObject(cmd);
        System.out.println("jsStr:"+jsstr);
        CompanyInfo form=(CompanyInfo)JSONObject.toJavaObject(jsstr.getJSONObject("form"),CompanyInfo.class);
        System.out.println("form:"+form);
        List<CompanyInfo> processTable=(List<CompanyInfo>)JSONObject.parseArray(jsstr.getString("processTable"),CompanyInfo.class);
        System.out.println("processTable:"+processTable);
        List<CompanyInfo> certTable=(List<CompanyInfo>)JSONObject.parseArray(jsstr.getString("certTable"),CompanyInfo.class);
        System.out.println("certTable:"+certTable);

        if("".equals(form.getCompanyId()) ||form.getCompanyId()==null){
            String CompanyId= UUID.randomUUID().toString();
            System.out.println("CompanyId:"+CompanyId);
            form.setCompanyId(CompanyId);
            this.basicInfoEntryMapper.saveData(form);
            String IndustryCode=form.getIndustryCode();
            String []industry=IndustryCode.split(",");
            String companyId = form.getCompanyId();
            this.basicInfoEntryMapper.saveQYHYData(industry,companyId);
            this.basicInfoEntryMapper.saveProcessData(processTable,CompanyId);
            this.basicInfoEntryMapper.saveCertData(certTable,CompanyId);
            return CompanyId;
        }else{
            String IndustryCode=form.getIndustryCode();
            String []industry=IndustryCode.split(",");
            String companyId = form.getCompanyId();
            this.basicInfoEntryMapper.updateData(form);
            this.basicInfoEntryMapper.saveQYHYData(industry,companyId);
            this.basicInfoEntryMapper.saveProcessData(processTable,companyId);
            this.basicInfoEntryMapper.saveCertData(certTable,companyId);
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

    @Override
    @Transactional
    public void delCompanyInfo(String[] idLists) {
        //直接删除
        basicInfoEntryMapper.delCompanyInfo(idLists);
    }


}
