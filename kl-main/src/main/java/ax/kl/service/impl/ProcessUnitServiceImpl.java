package ax.kl.service.impl;

import ax.kl.entity.DangerSourceInfo;
import ax.kl.entity.EquipInfo;
import ax.kl.entity.ProcessUnit;
import ax.kl.mapper.EquipInfoMapper;
import ax.kl.mapper.ProcessUnitMapper;
import ax.kl.service.ProcessUnitService;
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
import java.util.regex.Pattern;


/**
 * 工艺单元
 * @author Created by mxl
 * @version 创建时间：${date} ${time}
 */

@Service
public class ProcessUnitServiceImpl implements ProcessUnitService {

    @Autowired
    ProcessUnitMapper processUnitMapper;

    @Autowired
    EquipInfoMapper equipInfoMapper;

    /**
     * 新增或更新工艺单元信息，添加就返回UUID码,参数是一个json字符串
     */
    @Transactional
    public String saveOrUpdateData(String cmd){
        JSONObject jsstr = JSONObject.parseObject(cmd);
        ProcessUnit processUnit=(ProcessUnit)JSONObject.toJavaObject(jsstr.getJSONObject("unit"),ProcessUnit.class);
        List<EquipInfo> equipInfos=(List<EquipInfo>)JSONObject.parseArray(jsstr.getString("equipInfoTable"),EquipInfo.class);
        String deleteIds=jsstr.getString("deleteIds").toString();
        if(!"".equals(deleteIds) || deleteIds != null){
            //删除设备
            this.equipInfoMapper.deleteEquipInfo(deleteIds.split(","));
        }
        if ("".equals(processUnit.getUnitId()) || processUnit.getUnitId() == null) {
            String unitId = UUID.randomUUID().toString();
            processUnit.setUnitId(unitId);
            this.processUnitMapper.insertUnit(processUnit);
            //添加设备信息
            if(equipInfos.size()!=0){
                for(EquipInfo e:equipInfos){
                    e.setEquipId(UUID.randomUUID().toString());
                    e.setUnitId(unitId);
                    this.equipInfoMapper.insertEquipInfo(e);
                }
            }
            return unitId;
        } else {
            this.processUnitMapper.updateUnit(processUnit);
            if(equipInfos.size()!=0){
                for(EquipInfo e:equipInfos){
                    if ("".equals(e.getEquipId()) || e.getEquipId()== null) {
                        e.setEquipId(UUID.randomUUID().toString());
                        e.setUnitId(processUnit.getUnitId());
                        this.equipInfoMapper.insertEquipInfo(e);
                    }else{
                        this.equipInfoMapper.updateEquipInfo(e);
                    }
                }
            }
            return "";
        }
    }

    /**
     * 验证工艺单元唯一编码是否存在
     * @param uniqueCode
     * @return true 不存在，false 存在
     */
    @Override
    public boolean validateUniqueCode(String uniqueCode){
        int num = processUnitMapper.validateUniqueCode(uniqueCode);
        boolean re = num == 0;
        return re;
    };

    /**
     * 通过名称获取工艺单元信息
     * @param searchName
     * @return
     */
    public Page<ProcessUnit> getProcessUnitList(Page page, String searchName){
        page.setRecords(this.processUnitMapper.getProcessUnitList(page,searchName));
        return page;
    }

    /**
     * 删除工艺单元信息
     */
    @Transactional
    public void delProcessUnit(String[] idLists){
        this.processUnitMapper.delProcessUnit(idLists);
        for(String id:idLists){
            List<EquipInfo> equipInfos=this.equipInfoMapper.getEquipInfoList(id);
            if(equipInfos.size()!=0){
                StringBuilder ids=new StringBuilder();
                for(EquipInfo e:equipInfos){
                    ids.append(e.getEquipId()).append(",");
                }
                String[] equipIds=ids.substring(0,ids.length()-1).split(",");
                this.equipInfoMapper.deleteEquipInfo(equipIds);
            }
        }
    }

    /**
     * 导入工艺单元Excel信息
     */
    @Transactional
    @Override
    public String inputFile(MultipartFile file) {
        String companyId="";
        String sourceId="";
        InputStream is;
        POIFSFileSystem fs;
        Workbook book =null;
        DangerSourceInfo dangerSourceInfo=null;
        String result ="";
        //获取重大危险源集合
        Map<String,String> dangerSource = getDangerSource();
        //获取企业集合
        Map<String,String> company = getCompany();
        //获取设备类型集合
        Map<String,String> equipType = getEquipType();
        //获取设备使用状态集合
        Map<String,String> equipStatus = getEquipStatus();
        //存放文件中工艺单元的名称及ID
        Map<String,String> pNameAndID = getEquipStatus();
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
            //导入第一页的工艺单元信息
            Sheet sheet = book.getSheetAt(0);
            int rowSum=sheet.getLastRowNum();
            //导入第二页的设备信息
            Sheet sheet1 = book.getSheetAt(1);
            int rowSum1=sheet1.getLastRowNum();
            //如果其中只有两行的表头，就返回无数据
            if (rowSum>=2){
                //获取此文件中最后一条数据行数
                int rowCount = sheet.getLastRowNum()+1;
                //从第二行开始读取表头
                Row firstRow = sheet.getRow(1);
                //获取列数
                int columCount = firstRow.getLastCellNum();
                Map<String,Integer> colum =new HashMap<String, Integer>();
                for (int i=0;i<columCount;i++){
                    //获取第一行i列的内容
                    String columText = firstRow.getCell(i).getStringCellValue();
                    if (columText!=null){
                        colum.put(columText,i);
                    }
                }

                //从第三行开始进行数据遍历
                for (int i=2;i<rowCount;i++)
                {
                    Row row = sheet.getRow(i);
                    //如果此行是空的就遍历下一行
                    if (row==null){
                        continue;
                    }
                    ProcessUnit processUnit =new ProcessUnit();
                    String value ="-";
                    //从之前存储在集合中的键值对进行对比
                    Cell cell =row.getCell(colum.get("序号"));
                    //如果有序号列
                    if (cell!=null){
                        try {
                            //通过各种方法获取序号列此行的值
                            value = cell.getStringCellValue();
                        }catch(Exception e){
                            value =cell.getNumericCellValue()+"";
                        }
                        //如果没有值那就有问题，跳出循环
                        if ("".equals(value)||value==null){
                            break;
                        }
                    }
                    cell =row.getCell(colum.get("企业名称"));
                    if (cell!=null){
                        //获取其值
                        value = cell.getStringCellValue();
                        //与获取的所有企业的集合元素进行比对取出CompanyId
                        if (value!=null&&company.containsKey(value)){
                            value=company.get(value);
                            companyId=value;
                        }else {
                            return "导入失败：第1页第"+ (i-1) + "行企业名称未找到指定对象，请核对后再次导入";
                        }
                    }else{
                        return "导入失败：第1页第"+ (i-1) + "行企业名称不能为空，请核对后再次导入";
                    }

                    cell =row.getCell(colum.get("重大危险源名称"));
                    if (cell!=null){
                        value = cell.getStringCellValue();
                        if (value!=null&&dangerSource.containsKey(value)){
                            sourceId=dangerSource.get(value);
                            //判断此危险源是不是前一列公司的危险源
                            dangerSourceInfo=this.processUnitMapper.check(value,companyId);
                            if(dangerSourceInfo==null){
                                return "导入失败：第1页第"+ (i-1) + "行重大危险源名称非此企业名称下危险源，请核对后再次导入";
                            }
                        }else {
                            return "导入失败：第1页第"+ (i-1) + "行重大危险源名称未找到指定对象，请核对后再次导入";
                        }
                    }else{
                        return "导入失败：第1页第"+ (i-1) + "行重大危险源名称不能为空，请核对后再次导入";
                    }
                    processUnit.setSourceId(sourceId);

                    cell =row.getCell(colum.get("工艺单元名称"));
                    if (cell!=null){
                        value=cell.getStringCellValue();
                    }else{
                        return "导入失败：第1页第"+ (i-1) + "行工艺单元名称不能为空，请核对后再次导入";
                    }
                    processUnit.setUnitName(value);

                    cell =row.getCell(colum.get("工艺单元唯一编码"));
                    if (cell!=null){
                        try {
                            //通过各种方法获取序号列此行的值
                            value = cell.getStringCellValue();
                        }catch(Exception e){
                            value =cell.getNumericCellValue()+"";
                        }
                        //如果没有值那就有问题，跳出循环
                        if ("".equals(value)||value==null){
                            break;
                        }
                        if(pUniqueCode.size()!=0){
                            if(pUniqueCode.contains(value)){
                                return "导入失败：文件中含有重复的工艺单元唯一编码，请重新输入后再次导入";
                            }
                        }
                        pUniqueCode.add(value);

                        if(this.processUnitMapper.validateUniqueCode(value)!=0){
                            return "导入失败：第1页第"+ (i-1)+ "行工艺单元唯一编码在数据库中已存在，请重新输入后再次导入";
                        }
                    }else{
                        return "导入失败：第1页第"+ (i-1) + "行工艺单元唯一编码不能为空，请核对后再次导入";
                    }
                    processUnit.setUniqueCodeU(value);

                    cell =row.getCell(colum.get("火灾爆炸指数F&EI"));
                    if (cell!=null){
                        try {
                            //通过各种方法获取序号列此行的值
                            value = cell.getStringCellValue();
                        }catch(Exception e){
                            value =cell.getNumericCellValue()+"";
                        }
                        //如果没有值那就有问题，跳出循环
                        if ("".equals(value)||value==null){
                            break;
                        }
                        //如果没有值那就有问题，跳出循环
                        if (!isNumeric(value)){
                            return "导入失败：第1页第"+ (i-1) + "行火灾爆炸指数F&EI不是数字，请核对后再次导入";
                        }
                    }else{
                        return "导入失败：第1页第"+ (i-1) + "行火灾爆炸指数F&EI不能为空，请核对后再次导入";
                    }
                    processUnit.setFEI(Double.parseDouble(value));

                    cell =row.getCell(colum.get("补偿后的F&EI"));
                    if (cell!=null){
                        try {
                            //通过各种方法获取序号列此行的值
                            value = cell.getStringCellValue();
                        }catch(Exception e){
                            value =cell.getNumericCellValue()+"";
                        }
                        //如果没有值那就有问题，跳出循环
                        if ("".equals(value)||value==null){
                            break;
                        }
                        //如果没有值那就有问题，跳出循环
                        if (!isNumeric(value)){
                            return "导入失败：第1页第"+ (i-1) + "行补偿后的F&EI不是数字，请核对后再次导入";
                        }
                    }else{
                        return "导入失败：第1页第"+ (i-1) + "行补偿后的F&EI不能为空，请核对后再次导入";
                    }
                    processUnit.setAfterFEI(Double.parseDouble(value));

                    cell =row.getCell(colum.get("危险等级"));
                    if (cell!=null){
                        value=cell.getStringCellValue();
                        if(!dangerRank.contains(value)){
                            return "导入失败：第1页第"+ (i-1) + "行危险等级未按正确格式输入，请核对后再次导入";
                        }

                    }else{
                        return "导入失败：第1页第"+ (i-1) + "行危险等级不能为空，请核对后再次导入";
                    }
                    processUnit.setDangerRank(value);

                    cell =row.getCell(colum.get("补偿后的危险等级"));
                    if (cell!=null){
                        value=cell.getStringCellValue();
                        if(!dangerRank.contains(value)){
                            return "导入失败：第1页第"+ (i-1) + "行补偿后的危险等级未按正确格式输入，请核对后再次导入";
                        }
                    }else{
                        return "导入失败：第1页第"+ (i-1) + "行补偿后的危险等级不能为空，请核对后再次导入";
                    }
                    processUnit.setAfterDangerRank(value);
                    processUnit.setUnitId(UUID.randomUUID().toString());

                    pNameAndID.put(processUnit.getUnitName(),processUnit.getUnitId());
                    list.add(processUnit);
                    //如果条数太多，那就先保存100条
                    if (list.size()>100){
                        in += this.processUnitMapper.insertProcessUnit(list);
                        //新建空集合
                        list = new ArrayList<ProcessUnit>();
                    }
                }
            }
            //获取工艺单元集合
            Map<String,String> unit = getProcessUnit();
            //如果其中只有两行的表头，就返回无数据
            if (rowSum1>=2){
                //获取此文件中最后一条数据行数
                int rowCount = sheet1.getLastRowNum()+2;
                //从第二行开始读取表头
                Row firstRow = sheet1.getRow(1);
                //获取列数
                int columCount = firstRow.getLastCellNum();
                Map<String,Integer> colum =new HashMap<String, Integer>();
                for (int i=0;i<columCount;i++){
                    //获取第一行i列的内容
                    String columText = firstRow.getCell(i).getStringCellValue();
                    if (columText!=null){
                        colum.put(columText,i);
                    }
                }

                //从第三行开始进行数据遍历
                for (int i=2;i<rowCount;i++)
                {
                    Row row = sheet1.getRow(i);
                    //如果此行是空的就遍历下一行
                    if (row==null){
                        continue;
                    }
                    EquipInfo equipInfo =new EquipInfo();
                    String value ="-";
                    //从之前存储在集合中的键值对进行对比
                    Cell cell =row.getCell(colum.get("序号"));
                    //如果有序号列
                    if (cell!=null){
                        try {
                            //通过各种方法获取序号列此行的值
                            value = cell.getStringCellValue();
                        }catch(Exception e){
                            value =cell.getNumericCellValue()+"";
                        }
                        //如果没有值那就有问题，跳出循环
                        if ("".equals(value)||value==null){
                            break;
                        }
                    }

                    cell =row.getCell(colum.get("企业名称"));
                    if (cell!=null){
                        //获取其值
                        value = cell.getStringCellValue();
                        //与获取的所有企业的集合元素进行比对取出CompanyId
                        if (value!=null&&company.containsKey(value)){
                            value=company.get(value);
                        }else {
                            return "导入失败：第2页第"+ (i-1) + "行企业名称未找到指定对象，请核对后再次导入";
                        }
                    }

                    cell =row.getCell(colum.get("重大危险源名称"));
                    if (cell!=null){
                        value = cell.getStringCellValue();
                        if (value!=null&&dangerSource.containsKey(value)){
                            sourceId=dangerSource.get(value);
                            //判断此危险源是不是前一列公司的危险源
                            dangerSourceInfo=this.processUnitMapper.check(value,companyId);
                            if(dangerSourceInfo==null){
                                return "导入失败：第2页第"+ (i-1) + "行重大危险源名称非此企业名称下危险源，请核对后再次导入";
                            }
                        }else {
                            return "导入失败：第2页第"+ (i-1) + "行重大危险源名称未找到指定对象，请核对后再次导入";
                        }
                    }

                    cell =row.getCell(colum.get("工艺单元名称"));
                    if (cell!=null){
                        value=cell.getStringCellValue();
                        if (value!=null&&unit.containsKey(value)){
                            value=unit.get(value);
                        }else if (value!=null&&pNameAndID.containsKey(value)){
                            value=pNameAndID.get(value);
                        }else {
                            return "导入失败：第2页第"+ (i-1) + "行工艺单元名称未找到指定对象，请核对后再次导入";
                        }
                    }else{
                        return "导入失败：第2页第"+ (i-1) + "行工艺单元名称不能为空，请核对后再次导入";
                    }
                    equipInfo.setUnitId(value);

                    cell =row.getCell(colum.get("设备唯一编码"));
                    if (cell!=null){
                        try {
                            //通过各种方法获取序号列此行的值
                            value = cell.getStringCellValue();
                        }catch(Exception e){
                            value = cell.getNumericCellValue()+"";
                        }
                        //如果没有值那就有问题，跳出循环
                        if ("".equals(value)||value==null){
                            break;
                        }
                        if(eUniqueCode.size()!=0){
                            if(eUniqueCode.contains(value)){
                                return "导入失败：文件中含有重复的设备唯一编码，请重新输入后再次导入";
                            }
                        }
                        eUniqueCode.add(value);
                        if(this.equipInfoMapper.validateEquipCode(value)!=0){
                            return "导入失败：第2页第"+ (i-1) + "行设备唯一编码在数据库中已存在，请重新输入后再次导入";
                        }
                    }
                    else{
                        return "导入失败：第2页第"+ (i-1) + "行设备唯一编码不能为空，请核对后再次导入";
                    }
                    equipInfo.setUniqueCode(value);

                    cell =row.getCell(colum.get("设备名称"));
                    if (cell!=null){
                        try {
                            //通过各种方法获取序号列此行的值
                            value = cell.getStringCellValue();
                        }catch(Exception e){
                            value = cell.getNumericCellValue()+"";
                        }
                        //如果没有值那就有问题，跳出循环
                        if ("".equals(value)||value==null){
                            break;
                        }
                    }else{
                        return "导入失败：第2页第"+(i-1) + "行设备名称不能为空，请核对后再次导入";
                    }
                    equipInfo.setEquipName(value);

                    cell =row.getCell(colum.get("设备类型"));
                    if (cell!=null){
                        value=cell.getStringCellValue();
                        if (value!=null&&equipType.containsKey(value)){
                            value=equipType.get(value);
                        }else {
                            return "导入失败：第2页第"+ (i-1) + "行设备类型未找到指定对象，请核对后再次导入";
                        }
                    }else{
                        return "导入失败：第2页第"+ (i-1) + "行设备类型不能为空，请核对后再次导入";
                    }
                    equipInfo.setEquipType(value);

                    cell =row.getCell(colum.get("设备使用状态"));
                    if (cell!=null){
                        value=cell.getStringCellValue();
                        if (value!=null&&equipStatus.containsKey(value)){
                            value=equipStatus.get(value);
                        }else {
                            return "导入失败：第2页第"+ (i-1) + "行设备使用状态未找到指定对象，请核对后再次导入";
                        }
                    }else{
                        return "导入失败：第2页第"+ (i-1) + "行设备使用状态不能为空，请核对后再次导入";
                    }
                    equipInfo.setEquipStatus(value);

                    equipInfo.setEquipId(UUID.randomUUID().toString());

                    list1.add(equipInfo);
                    //如果条数太多，那就先保存100条
                    if (list1.size()>100){
                        ine += this.equipInfoMapper.insertList(list1);
                        //新建空集合
                        list1 = new ArrayList<EquipInfo>();
                    }
                }
            }
            if(rowSum<2&&rowSum1<2){
                return "文件中无数据，请填写数据再进行录入";
            }

        }catch (Exception e){
            System.out.printf("失败："+e.getMessage());
        }
        //添加数据
        if (list.size()>0){
            in += this.processUnitMapper.insertProcessUnit(list);
        }
        if (list1.size()>0){
            ine += this.equipInfoMapper.insertList(list1);
        }
        return "成功插入工艺单元"+in+"条。<br>成功插入设备信息"+ine+"条";
    }

    /**
     * 获取所有的企业集合
     * @return
     */
    private Map<String,String> getCompany() {
        List<Map<String,String>> cs=this.processUnitMapper.getCompany();
        Map<String,String> map=new HashMap<String,String>();
        for(Map<String,String> c:cs){
            map.put(c.get("CompanyName"),c.get("CompanyId"));
        }
        return map;
    }

    /**
     * 获取所有的重大危险源
     * @return
     */
    private Map<String,String> getDangerSource() {
        List<Map<String,String>> ds=this.processUnitMapper.getDangerSource();
        Map<String,String> map=new HashMap<String,String>();
        for(Map<String,String> d:ds){
            map.put(d.get("SourceName"),d.get("SourceId"));
        }
        return map;
    }


    /**
     * 获取所有的工艺单元
     * @return
     */
    private Map<String,String> getProcessUnit() {
        List<Map<String,String>> ds=this.processUnitMapper.getProcessUnit();
        Map<String,String> map=new HashMap<String,String>();
        for(Map<String,String> d:ds){
            map.put(d.get("UnitName"),d.get("UnitId"));
        }
        return map;
    }

    /**
     * 获取所有的设备类型
     * @return
     */
    private Map<String,String> getEquipType() {
        List<Map<String,String>> ds=this.equipInfoMapper.getEquipType();
        Map<String,String> map=new HashMap<String,String>();
        for(Map<String,String> d:ds){
            map.put(d.get("TypeName"),d.get("TypeCode"));
        }
        return map;
    }

    /**
     * 获取所有的设备类型
     * @return
     */
    private Map<String,String> getEquipStatus() {
        List<Map<String,String>> ds=this.equipInfoMapper.getEquipStatus();
        Map<String,String> map=new HashMap<String,String>();
        for(Map<String,String> d:ds){
            map.put(d.get("DictName"),d.get("DictId"));
        }
        return map;
    }

    /**
     * 判断String是否是数字
     * @param str
     * @return
     */
    private static boolean isNumeric(String str){
        String reg = "^[0-9]+(.[0-9]+)?$";
        return str.matches(reg);
    }
}