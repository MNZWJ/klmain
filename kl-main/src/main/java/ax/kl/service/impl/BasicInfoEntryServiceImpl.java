package ax.kl.service.impl;

import ax.kl.entity.*;
import ax.kl.mapper.BasicInfoEntryMapper;
import ax.kl.service.BasicInfoEntryService;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.plugins.Page;
import lombok.experimental.var;
import org.apache.avro.generic.GenericData;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

import static org.apache.hadoop.yarn.webapp.hamlet.HamletSpec.Scope.row;

/**
 * 企业基本信息录入
 *
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
     *
     * @param cmd
     * @return
     */
    @Override
    public String saveOrUpdateData(String cmd) {
        JSONObject jsstr = JSONObject.parseObject(cmd);
        CompanyInfo form = JSONObject.toJavaObject(jsstr.getJSONObject("form"), CompanyInfo.class);
        List<CompanyInfo> processTable = JSONObject.parseArray(jsstr.getString("processTable"), CompanyInfo.class);
        List<CompanyInfo> certTable = JSONObject.parseArray(jsstr.getString("certTable"), CompanyInfo.class);
        List<CompanyChemical> chemicalTable = JSONObject.parseArray(jsstr.getString("chemicalTable"), CompanyChemical.class);
        if ("".equals(form.getCompanyId()) || form.getCompanyId() == null) {
            String CompanyId = UUID.randomUUID().toString();
            form.setCompanyId(CompanyId);
            this.basicInfoEntryMapper.saveData(form);
            String IndustryCode = form.getIndustryCode();
            if (IndustryCode != null) {
                String[] industry = IndustryCode.split(",");
                this.basicInfoEntryMapper.saveQYHYData(industry, CompanyId);
            }
            if (processTable.size() > 0) {
                this.basicInfoEntryMapper.saveProcessData(processTable, CompanyId);
            }
            if (certTable.size() > 0) {
                this.basicInfoEntryMapper.saveCertData(certTable, CompanyId);
            }
            if (chemicalTable.size() > 0) {
                this.basicInfoEntryMapper.saveChemicalData(chemicalTable, CompanyId);
            }
            return CompanyId;
        } else {
            String companyId = form.getCompanyId();
            form.setCompanyId(companyId);
            String IndustryCode = form.getIndustryCode();
            if (IndustryCode != null) {
                String[] industry = IndustryCode.split(",");
                this.basicInfoEntryMapper.updateData(form);
                this.basicInfoEntryMapper.saveQYHYData(industry, companyId);
            }
            if (processTable.size() > 0) {
                this.basicInfoEntryMapper.saveProcessData(processTable, companyId);
            }
            if (certTable.size() > 0) {
                this.basicInfoEntryMapper.saveCertData(certTable, companyId);
            }
            if (chemicalTable.size() > 0) {
                this.basicInfoEntryMapper.saveChemicalData(chemicalTable, companyId);
            }
            return "";
        }
    }

    /**
     * 通过ID获取公司信息
     *
     * @param companyId
     * @return
     */
    @Override
    public List<CompanyInfo> getCompanyInfo(String companyId) {
        return basicInfoEntryMapper.getCompanyInfo(companyId);
    }

    /**
     * 通过ID获取公司证书信息
     *
     * @param companyId
     * @return
     */
    @Override
    public List<CompanyInfo> getCompanyCertList(String companyId) {
        return basicInfoEntryMapper.getCompanyCertList(companyId);
    }

    /**
     * 通过ID删除公司信息
     *
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
     *
     * @param typeCode
     * @return true 不存在，false 存在
     */
    @Override
    public boolean validateTypeCode(String typeCode) {
        int num = basicInfoEntryMapper.validateTypeCode(typeCode);
        boolean re = num == 0;
        return re;
    }

    ;

    /**
     * 获取化学品列表
     *
     * @param param 过滤条件
     * @return
     */
    @Override
    public Page<ChemicalCataLog> getChemicalInfoList(Page page, Map<String, String> param) {
        page.setRecords(basicInfoEntryMapper.getChemicalInfoList(page, param.get("chemName"), param.get("cas")));
        return page;
    }

    /**
     * 通过ID获取公司化学品信息
     *
     * @param companyId
     * @return
     */
    @Override
    public List<CompanyChemical> getChemicalList(String companyId) {
        return basicInfoEntryMapper.getChemicalList(companyId);
    }

    /**
     * 企业信息插入
     *
     * @param parmfile
     * @return
     */
    @Override
    public String inputCompanyInfo(MultipartFile parmfile) {
        InputStream is;
        POIFSFileSystem fs;
        Workbook book = null;
        String result = "";
        int in=0;
        int in0=0;
        int in1=0;
        int in2=0;
        int in3=0;
        Map<String, String> company = getCompanyForName();//公司
        Map<String, String> dictListMap = getDictListForName();//字典
        Map<String, String> chemicalMap = getChemicalListForName();//化学品

        Map<String, String> comInfo = new HashMap<String, String>();//存放准备上传的公司列表
        Map<String, String> comUnincode = new HashMap<String, String>();//存放准备上传的公司编码

        List<CompanyInfo> list = new ArrayList<CompanyInfo>();//企业
        List<CompanyInfo> hylist = new ArrayList<CompanyInfo>();//企业行业
        List<CompanyInfo> list1 = new ArrayList<CompanyInfo>();//危险化工工艺
        List<CompanyInfo> list2 = new ArrayList<CompanyInfo>();//企业证书
        List<CompanyChemical> list3 = new ArrayList<CompanyChemical>();//企业化学品

        //分段倒入处理
        List<List<CompanyInfo>> input  =new ArrayList<>();
        List<List<CompanyInfo>> hyinput  =new ArrayList<>();
        List<List<CompanyInfo>> input1  =new ArrayList<>();
        List<List<CompanyInfo>> input2  =new ArrayList<>();
        List<List<CompanyChemical>> input3  =new ArrayList<>();
        try {
            is = parmfile.getInputStream();
            /**判断Excel版本*/
            if (parmfile.getOriginalFilename().indexOf("xlsx") > -1) {
                book = new XSSFWorkbook(is);
            } else {
                fs = new POIFSFileSystem(is);
                book = new HSSFWorkbook(fs);
            }
            if (book.getNumberOfSheets() == 0) {
                return "获取工作簿失败，请重新上传";
            }
            /**
             * 获取Sheet页0
             * 企业信息
             * */
            Sheet sheet = book.getSheetAt(0);
            if (sheet.getLastRowNum() < 2) {
                return "企业信息无上传数据，请确认后重新上传";
            }
            int rowCount = sheet.getLastRowNum() + 1;//获取行数
            Row firstRow = sheet.getRow(1);//获取表头行
            //列名称
            int columCount = firstRow.getLastCellNum();//获取列数
            Map<String, Integer> colum = new HashMap<String, Integer>();
            for (int i = 0; i < columCount; i++) {
                String columText = firstRow.getCell(i).getStringCellValue();
                if (columText != null) {
                    colum.put(columText, i);
                }
            }
            for (int i = 2; i < rowCount; i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    continue;
                }
                CompanyInfo companyInfo = new CompanyInfo();
                String value = "";
                Cell cell = row.getCell(colum.get("序号"));
                value = getCellValue(cell);
                if ("".equals(value)) {
                    break;
                }
                cell = row.getCell(colum.get("唯一编码"));//手输
                if (cell != null) {
                    value = getCellValue(cell);
                    if (validateTypeCode(value)) {
                        if (comUnincode.size() > 0) {
                            if (comUnincode.containsKey(value)) {
                                return "导入失败：企业信息中第" + (i+1) + "行唯一编码存在重复，请核对后再次导入";
                            } else {
                                comUnincode.put("i", value);
                            }
                        } else {
                            comUnincode.put("i", value);
                        }
                    } else {
                        return "导入失败：企业信息中第" + (i+1) + "行唯一编码已存在，请重新核对后再次导入";
                    }
                    companyInfo.setUniqueCode(value);
                } else {
                    return "导入失败：企业信息中第" + (i+1) + "行唯一编码不能为空，请核对后再次导入";
                }

                cell = row.getCell(colum.get("企业名称"));//手输
                if (cell != null) {
                    value = getCellValue(cell);
                    if (company.containsKey(value)) {
                        return "导入失败：企业信息中第" + (i+1) + "行企业已经存在，请核对后再次导入";
                    } else {
                        if (comInfo.size() > 0) {
                            if (comInfo.containsKey(value)) {
                                return "导入失败：企业信息中第" + (i+1) + "行企业与上面数据存在重复，请核对后再次导入";
                            } else {
                                comInfo.put("i", value);
                            }
                        } else {
                            comInfo.put("i", value);
                        }
                    }
                    companyInfo.setCompanyName(value);
                } else {
                    return "导入失败：企业信息中第" + (i+1) + "行企业名称不能为空，请核对后再次导入";
                }

                cell = row.getCell(colum.get("企业简称"));//手输
                value = getCellValue(cell);
                companyInfo.setSimpleName(value);

                cell = row.getCell(colum.get("行政区域"));//手输
                value = getCellValue(cell);
                companyInfo.setArea(value);

                cell = row.getCell(colum.get("直属区域"));//字典
                value = getCellValue(cell);
                if (dictListMap.containsKey(value)) {
                    value = dictListMap.get(value);
                } else {
                    return "导入失败：企业信息中第" + (i+1) + "行直属区域未找到指定对象，请核对后再次导入";
                }
                companyInfo.setDirectArea(value);

                cell = row.getCell(colum.get("监管单位"));//手输
                value = getCellValue(cell);
                companyInfo.setSuperVisionUnit(value);

                cell = row.getCell(colum.get("法人代表"));//手输
                value = getCellValue(cell);
                companyInfo.setLegalPerson(value);

                cell = row.getCell(colum.get("联系方式"));//手输
                value = getCellValue(cell);
                companyInfo.setContactWay(value);

                cell = row.getCell(colum.get("安全管理分级"));//字典
                value = getCellValue(cell);
                if ( dictListMap.containsKey(value)) {
                    value = dictListMap.get(value);
                } else {
                    return "导入失败：企业信息中第" + (i+1) + "行安全管理分级未找到指定对象，请核对后再次导入";
                }
                companyInfo.setSafeManageRank(value);

                cell = row.getCell(colum.get("标准化等级"));//字典
                value = getCellValue(cell);
                if (dictListMap.containsKey(value)) {
                    value = dictListMap.get(value);
                } else {
                    return "导入失败：企业信息中第" + (i+1) + "行标准化等级未找到指定对象，请核对后再次导入";
                }
                companyInfo.setStandardRank(value);

                cell = row.getCell(colum.get("经营状态"));//字典
                value = getCellValue(cell);
                if ( dictListMap.containsKey(value)) {
                    value = dictListMap.get(value);
                } else {
                    return "导入失败：企业信息中第" + (i+1) + "行经营状态未找到指定对象，请核对后再次导入";
                }
                companyInfo.setOperatingState(value);

                cell = row.getCell(colum.get("经度"));//手输
                value = getCellValue(cell);
                companyInfo.setLongt(value);

                cell = row.getCell(colum.get("纬度"));//手输
                value = getCellValue(cell);
                companyInfo.setLat(value);

                cell = row.getCell(colum.get("企业规模"));//字典
                value = getCellValue(cell);
                if ( dictListMap.containsKey(value)) {
                    value = dictListMap.get(value);
                } else {
                    return "导入失败：企业信息中第" + (i+1) + "行企业规模未找到指定对象，请核对后再次导入";
                }
                companyInfo.setScaleCode(value);

                cell = row.getCell(colum.get("企业类型"));//字典
                value = getCellValue(cell);
                if (dictListMap.containsKey(value)) {
                    value = dictListMap.get(value);
                } else {
                    return "导入失败：企业信息中第" + (i+1) + "行企业类型未找到指定对象，请核对后再次导入";
                }
                companyInfo.setTypeCode(value);
                String CompanyId = UUID.randomUUID().toString();//生成主键
                companyInfo.setCompanyId(CompanyId);
                list.add(companyInfo);
                //分段插入处理
                if (list.size()==100){
                    input.add(list);
                    list =new ArrayList<>();
                }

                cell = row.getCell(colum.get("企业行业"));
                value = getCellValue(cell);
                if (value != null) {
                    try {
                        String[] hyarr = value.split(",");
                        for (int j = 0; j < hyarr.length; j++) {
                            if (value != null && dictListMap.containsKey(hyarr[j])) {
                                CompanyInfo companyhy = new CompanyInfo();
                                value = dictListMap.get(hyarr[j]);
                                companyhy.setIndustryCode(value);
                                companyhy.setCompanyId(CompanyId);
                                hylist.add(companyhy);
                                //分段插入处理
                                if (hylist.size()==100){
                                    hyinput.add(hylist);
                                    hylist =new ArrayList<>();
                                }
                            }
                        }
                    } catch (Exception e) {
                        return "导入失败：企业信息中第"+(i+1)+"行数据格式输入错误，请使用,分割，请核对后重新导入";
                    }
                }
            }
            for (List<CompanyInfo> l:input){
                basicInfoEntryMapper.insertCompanyInfo(l);
            }
            if (list.size() > 0) {
                basicInfoEntryMapper.insertCompanyInfo(list);
            }
            in = Integer.parseInt(String.valueOf(input.size()*100+list.size()));

            for (List<CompanyInfo> hy:hyinput){
                basicInfoEntryMapper.insertCompanyInfo(hy);
            }
            if (hylist.size() > 0) {
                basicInfoEntryMapper.insertCompanyIndustry(hylist);
            }
            in0= Integer.parseInt(String.valueOf(hyinput.size()*100+hylist.size()));
            Map<String, String> company1 = getCompanyForName();//公司

            /**获取Sheet页1
             * 企业关联化工工艺
             * */
            Sheet sheet1 = book.getSheetAt(1);
            int rowCount1 = sheet1.getLastRowNum() + 1;//获取行数
            Row firstRow1 = sheet1.getRow(1);//获取表头行
            //列名称
            int columCount1 = firstRow1.getLastCellNum();//获取列数
            Map<String, Integer> colum1 = new HashMap<String, Integer>();
            for (int i = 0; i < columCount1; i++) {
                String columText = firstRow1.getCell(i).getStringCellValue();
                if (columText != null) {
                    colum1.put(columText, i);
                }
            }
            for (int i = 2; i < rowCount1; i++) {
                Row row = sheet1.getRow(i);
                if (row == null) {
                    continue;
                }
                CompanyInfo companyTechnology = new CompanyInfo();
                String value = "";
                Cell cell = row.getCell(colum1.get("序号"));
                value = getCellValue(cell);
                if ("".equals(value)) {
                    break;
                }

                cell = row.getCell(colum1.get("企业名称"));//手输
                if (cell != null) {
                    value = getCellValue(cell);
                    if (company1.containsKey(value)) {
                        value = company1.get(value);
                    } else {
                        return "导入失败：危险工艺中第" + (i+1) + "行企业名称未找到指定对象，请核对后再次导入";
                    }
                    companyTechnology.setCompanyId(value);
                } else {
                    return "导入失败：危险工艺中第" + (i+1) + "行企业名称不能为空";
                }

                cell = row.getCell(colum1.get("危险工艺名称"));//字典
                if (cell != null) {
                    value = getCellValue(cell);
                    if (dictListMap.containsKey(value)) {
                        value = dictListMap.get(value);
                    } else {
                        return "导入失败：危险工艺中第" + (i+1) + "行危险工艺名称未找到指定对象，请核对后再次导入";
                    }
                    companyTechnology.setTechnologyId(value);
                } else {
                    return "导入失败：危险工艺中第" + (i+1) + "行危险工艺名称不能为空";
                }

                cell = row.getCell(colum1.get("重点监控单元"));//手输
                value = getCellValue(cell);
                companyTechnology.setMonitorUnit(value);

                list1.add(companyTechnology);
                //分段插入处理
                if (list1.size()==100){
                    input1.add(list1);
                    list1 =new ArrayList<>();
                }
            }
            for (List<CompanyInfo> t:input1){
                basicInfoEntryMapper.insertCompanyTechnology(t);
            }
            if (list1.size() > 0) {
                basicInfoEntryMapper.insertCompanyTechnology(list1);
            }
            in1= Integer.parseInt(String.valueOf(input1.size()*100+list1.size()));
            /**获取Sheet页2
             * 企业相关证书
             * */
            Sheet sheet2 = book.getSheetAt(2);
            int rowCount2 = sheet2.getLastRowNum() + 1;//获取行数
            Row firstRow2 = sheet2.getRow(1);//获取表头行
            //列名称
            int columCount2 = firstRow2.getLastCellNum();//获取列数
            Map<String, Integer> colum2 = new HashMap<String, Integer>();
            for (int i = 0; i < columCount2; i++) {
                String columText = firstRow2.getCell(i).getStringCellValue();
                if (columText != null) {
                    colum2.put(columText, i);
                }
            }
            for (int i = 2; i < rowCount2; i++) {
                Row row = sheet2.getRow(i);
                if (row == null) {
                    continue;
                }
                CompanyInfo companyCert = new CompanyInfo();
                String value = "";
                Cell cell = row.getCell(colum2.get("序号"));
                value = getCellValue(cell);
                if ("".equals(value)) {
                    break;
                }

                cell = row.getCell(colum2.get("企业名称"));//手输
                if (cell != null) {
                    value = getCellValue(cell);
                    if (value != null && company1.containsKey(value)) {
                        value = company1.get(value);
                    } else {
                        return "导入失败：企业证书中第" + (i+1) + "行企业名称未找到指定对象，请核对后再次导入";
                    }
                    companyCert.setCompanyId(value);
                } else {
                    return "导入失败：企业证书中第" + (i+1) + "行企业名称不能为空";
                }

                cell = row.getCell(colum2.get("证书类型"));//字典
                if (cell != null) {
                    value = getCellValue(cell);
                    if (dictListMap.containsKey(value)) {
                        value = dictListMap.get(value);
                    } else {
                        return "导入失败：企业证书中第" + (i+1) + "行证书类型未找到指定对象，请核对后再次导入";
                    }
                    companyCert.setCertType(value);
                } else {
                    return "导入失败：企业证书中第" + (i+1) + "行证书类型不能为空";
                }

                cell = row.getCell(colum2.get("证书编号"));//手输
                value = getCellValue(cell);
                companyCert.setCertNo(value);

                cell = row.getCell(colum2.get("开始日期"));//手输
                value = getCellValue(cell);
                companyCert.setStartDate(value);

                cell = row.getCell(colum2.get("有效期"));//手输
                value = getCellValue(cell);
                companyCert.setValidity(value);
                list2.add(companyCert);
                //分段插入处理
                if (list2.size()==100){
                    input2.add(list2);
                    list2 =new ArrayList<>();
                }
            }
            for (List<CompanyInfo> cert:input2){
                basicInfoEntryMapper.insertCompanyCert(cert);
            }
            if (list2.size() > 0) {
                basicInfoEntryMapper.insertCompanyCert(list2);
            }
            in2= Integer.parseInt(String.valueOf(input2.size()*100+list2.size()));

            /**获取Sheet页3
             * 企业化学品
             * */
            Sheet sheet3 = book.getSheetAt(3);
            int rowCount3 = sheet3.getLastRowNum() + 1;//获取行数
            Row firstRow3 = sheet3.getRow(1);//获取表头行
            //列名称
            int columCount3 = firstRow3.getLastCellNum();//获取列数
            Map<String, Integer> colum3 = new HashMap<String, Integer>();
            for (int i = 0; i < columCount3; i++) {
                String columText = firstRow3.getCell(i).getStringCellValue();
                if (columText != null) {
                    colum3.put(columText, i);
                }
            }
            for (int i = 2; i < rowCount3; i++) {
                Row row = sheet3.getRow(i);
                if (row == null) {
                    continue;
                }
                CompanyChemical companyChemical = new CompanyChemical();
                String value = "";
                Cell cell = row.getCell(colum3.get("序号"));
                value = getCellValue(cell);
                if ("".equals(value)) {
                    break;
                }

                cell = row.getCell(colum3.get("企业名称"));//手输
                if (cell != null) {
                    value = getCellValue(cell);
                    if (company1.containsKey(value)) {
                        value = company1.get(value);
                    } else {
                        return "导入失败：化学品中第" + (i+1) + "行企业名称未找到指定对象，请核对后再次导入";
                    }
                    companyChemical.setCompanyId(value);
                } else {
                    return "导入失败：化学品中第" + (i+1) + "行企业名称不能为空";
                }

                cell = row.getCell(colum3.get("化学品名称"));//字典
                if (cell != null) {
                    value = getCellValue(cell);
                    if (value != null && chemicalMap.containsKey(value)) {
                        value = chemicalMap.get(value);
                    } else {
                        return "导入失败：化学品中第" + (i+1) + "行化学品名称未找到指定对象，请核对后再次导入";
                    }
                    companyChemical.setChemId(value);
                } else {
                    return "导入失败：化学品中第" + (i+1) + "行化学品名称不能为空";
                }

                cell = row.getCell(colum3.get("设计储量"));//手输
                value = getCellValue(cell);
                companyChemical.setDreserves(value);
                cell = row.getCell(colum3.get("单位"));//手输
                value = getCellValue(cell);
                companyChemical.setUnit(value);
                list3.add(companyChemical);
                //分段插入处理
                if (list3.size()==100){
                    input3.add(list3);
                    list3 =new ArrayList<>();
                }
            }
            for (List<CompanyChemical> hxp:input3){
                basicInfoEntryMapper.insertCompanyChemical(hxp);
            }

            if (list3.size() > 0) {
                basicInfoEntryMapper.insertCompanyChemical(list3);
            }
            in3= Integer.parseInt(String.valueOf(input3.size()*100+list3.size()));

        } catch (Exception e) {
            System.out.printf("失败：" + e.getMessage());
            return "导入失败";
        }
        return "成功插入" + in + "条企业信息、"+in0+"条企业行业信息、" + in1 + "条危险化学工艺信息、" + in2 + "条企业证书信息、" + in3 + "条化学品信息";
    }

    /**
     * 获取企业集合
     * @return
     */
    private Map<String, String> getCompanyForName() {
        List<Map<String, String>> list = basicInfoEntryMapper.getCompanyForName();
        Map<String, String> source = new HashMap<String, String>();
        for (Map<String, String> obj : list) {
            source.put(obj.get("CompanyName"), obj.get("CompanyId"));
        }
        return source;
    }

    /**
     * 获取数据字典数据
     */
    private Map<String, String> getDictListForName() {
        List<Map<String, String>> list = basicInfoEntryMapper.getDictListForName();
        Map<String, String> dictMap = new HashMap<String,String>();
        for (Map<String, String> obj : list) {
            dictMap.put(obj.get("DictName"), obj.get("DictId"));
        }
        return dictMap;
    }

    /**
     * 获取化学品数据
     */
    private Map<String, String> getChemicalListForName() {
        List<Map<String, String>> list = basicInfoEntryMapper.getChemicalListForName();
        Map<String, String> chemicalMap = new HashMap<String,String>();
        for (Map<String, String> obj : list) {
            chemicalMap.put(obj.get("ChemName"), obj.get("ChemId"));
        }
        return chemicalMap;
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
