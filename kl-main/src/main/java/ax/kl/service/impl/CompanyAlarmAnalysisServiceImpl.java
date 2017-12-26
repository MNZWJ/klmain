package ax.kl.service.impl;

import ax.kl.entity.HbaseAlarmData;
import ax.kl.entity.MonitorData;
import ax.kl.hbase.HBaseOperateData;
import ax.kl.hbase.PageData;
import ax.kl.mapper.CompanyAlarmAnalysisMapper;
import ax.kl.mapper.HbaseDataMapper;
import ax.kl.service.CompanyAlarmAnalysisService;
import org.apache.hadoop.hbase.filter.*;
import org.apache.hadoop.hbase.util.Bytes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.apache.hadoop.hbase.filter.CompareFilter.CompareOp;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author: ZhenpengSu
 * @description:
 * @date: Created in 14:25 2017/12/20
 * @modified By:
 */
@Service
@Transactional
public class CompanyAlarmAnalysisServiceImpl implements CompanyAlarmAnalysisService{

    @Autowired
    CompanyAlarmAnalysisMapper companyAlarmAnalysisMapper;
    @Autowired
    HbaseDataMapper hbaseDataMapper;

    /**
     * 获取监测点类型
     *
     * @return
     */
    @Override
    public List<Map<String, String>> getAlarmTypeList() {
        return companyAlarmAnalysisMapper.getAlarmTypeList();
    }

    /**
     * 获取报警数据
     *
     * @param startDate
     * @param endDate
     * @return
     */
    @Override
    public List<Map<String, String>> getAlarmNum(String startDate, String endDate,String companyName) {
        return companyAlarmAnalysisMapper.getAlarmNum(startDate,endDate,companyName);
    }

    /**
     * 加载报警数据详情
     * @param pageIndex
     * @param pageSize
     * @param companyCode
     * @param targetCode
     * @return
     */
     public Map<String,Object> loadAlarmDataList(int pageIndex,int pageSize,String companyCode,
                                         String targetCode,String startDate,String endDate){
         //企业字典
         Map<String,Map<String,String>> companyDict = this.hbaseDataMapper.getCompanyDict();
         //重大危险源
         Map<String,Map<String,String>> danagerDict = this.hbaseDataMapper.getDresourceDict("");
         //工艺单元
         Map<String,Map<String,String>> unitDict = this.hbaseDataMapper.getUnitDict("");
         //设备
         Map<String,Map<String,String>> equipDict = this.hbaseDataMapper.getEquipDict("");
         //指标
         Map<String,Map<String,String>> targetDict = this.hbaseDataMapper.getTargetDict();
         //报警代码
         Map<String,Map<String,String>> alarmDict = this.hbaseDataMapper.getAlarmDict();

         //添加查询条件
         FilterList filterList = new FilterList();
         //企业编码
         Filter companyFilter = new RowFilter(CompareFilter.CompareOp.EQUAL,
                 new BinaryPrefixComparator(companyCode.getBytes()));
         filterList.addFilter(companyFilter);
         //指标代码
         if("totalNum".equalsIgnoreCase(targetCode)){

         }else if("ZB".equalsIgnoreCase(targetCode.split("_")[1])){
             Filter targetFilter = new SingleColumnValueFilter(Bytes.toBytes("cf1"),
                     Bytes.toBytes("targetCode"),CompareFilter.CompareOp.EQUAL,
                     new BinaryPrefixComparator(targetCode.split("_")[0].getBytes()));
             filterList.addFilter(targetFilter);
         }else if("ZT".equalsIgnoreCase(targetCode.split("_")[1])){
             Filter targetFilter = new SingleColumnValueFilter(Bytes.toBytes("cf1"),
                     Bytes.toBytes("alarmCode"),CompareFilter.CompareOp.EQUAL,
                     new BinaryPrefixComparator(targetCode.split("_")[0].getBytes()));
             filterList.addFilter(targetFilter);
         }

         //开始时间
         if(startDate!=null && startDate.length()>0){
             Filter dateFilter = new SingleColumnValueFilter(Bytes.toBytes("cf1"),
                     Bytes.toBytes("alarmDate"), CompareOp.GREATER_OR_EQUAL,
                     new BinaryComparator((startDate+" 00:00:00").getBytes()));
             filterList.addFilter(dateFilter);
         }
         //结束时间
         if(endDate!=null && endDate.length()>0){
             Filter dateFilter = new SingleColumnValueFilter(Bytes.toBytes("cf1"),
                     Bytes.toBytes("alarmDate"), CompareOp.LESS_OR_EQUAL,
                     new BinaryComparator((endDate+"23:59:59").getBytes()));
             filterList.addFilter(dateFilter);
         }
         //状态
         Filter statusFilter = new SingleColumnValueFilter(Bytes.toBytes("cf1"),
                 Bytes.toBytes("status"), CompareOp.EQUAL,
                 new BinaryComparator("1".getBytes()));
         filterList.addFilter(statusFilter);

         List<String> columnList = new ArrayList<String>();
         columnList.add("targetCode");
         columnList.add("alarmCode");
         columnList.add("alarmDate");
         columnList.add("realValue");
         columnList.add("status");
         PageData pageData =  HBaseOperateData.getDataMap("tb_realtime_alarm",null,null,
                 filterList,columnList,pageIndex,pageSize);
         List<Map<String,String>> list = pageData.getResultList();

         //结果列表
         List<HbaseAlarmData> resultList = new ArrayList<HbaseAlarmData>();
         for(int i=0;i<list.size();i++){
             Map<String,String> map = list.get(i);
             String rowKey = map.get("key");
             //企业名称
             String inCompanyCode = rowKey.substring(0,9);
             String companyName = "";
             if(companyDict.containsKey(inCompanyCode)){
                 companyName = companyDict.get(inCompanyCode).get("CompanyName");
             }
             //重大危险源名称
             String danageCode = rowKey.substring(0,11);
             String danageName = "";
             if(danagerDict.containsKey(danageCode)){
                 danageName = danagerDict.get(danageCode).get("SourceName");
             }
             //工艺单元
             String unitCode = rowKey.substring(0,13);
             String unitName = "";
             if(unitDict.containsKey(unitCode)){
                 unitName = unitDict.get(unitCode).get("UnitName");
             }
             //设备名称
             String equipCode = rowKey.substring(0,17);
             String equipName = "";
             if(equipDict.containsKey(equipCode)){
                 equipName = equipDict.get(equipCode).get("EquipName");
             }
             //指标名称
             String inTargetCode = map.get("targetCode");
             String targetName = "";
             String targetUnit = "";
             if(targetDict.containsKey(inTargetCode)){
                 targetName = targetDict.get(inTargetCode).get("TargetName");
                 targetUnit = targetDict.get(inTargetCode).get("Unit");
             }
             //报警类型
             String alarmCode = map.get("alarmCode");
             String alarmName = "";
             if(alarmDict.containsKey(alarmCode)){
                 alarmName = alarmDict.get(alarmCode).get("TypeName");
             }

             HbaseAlarmData alarmData = new HbaseAlarmData();
             alarmData.setDataNum(""+(i+1));
             alarmData.setDataId(rowKey);
             alarmData.setCompanyName(companyName);
             alarmData.setDResourceName(danageName);
             alarmData.setUnitName(unitName);
             alarmData.setEquipName(equipName);
             alarmData.setAlarmDate(map.get("alarmDate"));
             alarmData.setRealValue(map.get("realValue"));
             alarmData.setTargetName(targetName);
             alarmData.setTargetUnit(targetUnit);
             alarmData.setAlarmName(alarmName);
             resultList.add(alarmData);
         }

         long total = pageData.getTotalCount();
         Map<String,Object> resultMap = new HashMap<String,Object>();
         resultMap.put("total",total);
         resultMap.put("rows",resultList);
         return resultMap;
     }
}
