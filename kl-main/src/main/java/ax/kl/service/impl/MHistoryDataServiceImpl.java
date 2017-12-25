package ax.kl.service.impl;

import ax.kl.entity.MonitorData;
import ax.kl.hbase.*;;
import ax.kl.mapper.HbaseDataMapper;
import ax.kl.service.MHistoryDataService;
import org.apache.hadoop.hbase.filter.*;
import org.apache.hadoop.hbase.util.Bytes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.apache.hadoop.hbase.filter.CompareFilter.CompareOp;

import java.text.SimpleDateFormat;
import java.util.*;

/**
 * 监测数据查询
 * @author xum
 * Data 2017/12/19
 */
@Service
public class MHistoryDataServiceImpl implements MHistoryDataService {

    @Autowired
    HbaseDataMapper hbaseDataMapper;

    /**
     * 插入报警数据
     */
    public void insertData(){
        //提供row key
        List<HbaseDataEntity> list = new ArrayList<HbaseDataEntity>();
        for(int i=0;i<5;i++){
            SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String nowDate =  sdf.format( new  Date());

            HbaseDataEntity entitys = new HbaseDataEntity();
            entitys.setTableName("tb_realtime_alarm");
            entitys.setMobileKey("3705210120101CG01_WD10"+i+"_L0_"+ System.currentTimeMillis());
            Map<String, Map<String, String>> familyMaps = new HashMap<String, Map<String, String>>();
            Map<String, String> columnMaps = new HashMap<>();
            columnMaps.put("targetCode", "WD");
            columnMaps.put("alarmCode", "L0");
            columnMaps.put("realValue", "0.7");
            columnMaps.put("alarmDate", nowDate);
            columnMaps.put("status", "1");
            familyMaps.put("cf1", columnMaps);
            entitys.setColumns(familyMaps);
            list.add(entitys);
        }
        HBaseOperateData.insertDataList(list);
    }

    /**
     * 插入监测数据
     */
    public void insertMonitorData(){
        //提供row key
        List<HbaseDataEntity> list = new ArrayList<HbaseDataEntity>();
        for(int i=0;i<5;i++){
            SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String nowDate =  sdf.format( new  Date());

            HbaseDataEntity entitys = new HbaseDataEntity();
            entitys.setTableName("tb_realtime_monitor");
            entitys.setMobileKey("3705210020101CG01_010102"+i+"_"+ System.currentTimeMillis());
            Map<String, Map<String, String>> familyMaps = new HashMap<String, Map<String, String>>();
            Map<String, String> columnMaps = new HashMap<>();
            columnMaps.put("collectDate", nowDate);
            columnMaps.put("targetCode", "010102");
            columnMaps.put("realValue", "13");
            familyMaps.put("cf1", columnMaps);
            entitys.setColumns(familyMaps);
            list.add(entitys);
        }
        HBaseOperateData.insertDataList(list);
    }

    /**
     * 查询监测数据
     * @param pageIndex
     * @param pageSize
     * @param qcompanyCode
     * @param qresourceCode
     * @param qunitCode
     * @param qequipCode
     * @param qtargetCode
     * @param startDate
     * @param endDate
     * @return
     */
    public Map<String,Object> loadMonitorDataList(int pageIndex,int pageSize,String qcompanyCode,
                                                  String qresourceCode, String qunitCode,String qequipCode,
                                                  String qtargetCode, String startDate, String endDate){
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

        //添加查询条件
        int filterNum = 0;
        FilterList filterList = new FilterList();
        if(qequipCode!=null && qequipCode.length()>0){
            //设备编码
            Filter equipFilter = new RowFilter(CompareFilter.CompareOp.EQUAL,
                    new BinaryPrefixComparator(qequipCode.getBytes()));
            filterList.addFilter(equipFilter);
            filterNum++;
        }else if(qunitCode!=null && qunitCode.length()>0){
            //工艺单元编码
            Filter equipFilter = new RowFilter(CompareFilter.CompareOp.EQUAL,
                    new BinaryPrefixComparator(qunitCode.getBytes()));
            filterList.addFilter(equipFilter);
            filterNum++;
        }else if(qresourceCode!=null && qresourceCode.length()>0){
            //重大危险源编码
            Filter equipFilter = new RowFilter(CompareFilter.CompareOp.EQUAL,
                    new BinaryPrefixComparator(qresourceCode.getBytes()));
            filterList.addFilter(equipFilter);
            filterNum++;
        }else if(qcompanyCode!=null && qcompanyCode.length()>0){
            //企业编码
            Filter equipFilter = new RowFilter(CompareFilter.CompareOp.EQUAL,
                    new BinaryPrefixComparator(qcompanyCode.getBytes()));
            filterList.addFilter(equipFilter);
            filterNum++;
        }
        //指标类型
        if(qtargetCode!=null && qtargetCode.length()>0){
            Filter equipFilter = new SingleColumnValueFilter(Bytes.toBytes("cf1"),
                    Bytes.toBytes("targetCode"),CompareFilter.CompareOp.EQUAL,
                    new BinaryPrefixComparator(qtargetCode.getBytes()));
            filterList.addFilter(equipFilter);
            filterNum++;
        }
        //开始时间
        if(startDate!=null && startDate.length()>0){
            Filter equipFilter = new SingleColumnValueFilter(Bytes.toBytes("cf1"),
                    Bytes.toBytes("collectDate"), CompareOp.GREATER_OR_EQUAL,
                    new BinaryComparator((startDate+" 00:00:00").getBytes()));
            filterList.addFilter(equipFilter);
            filterNum++;
        }
        //结束时间
        if(endDate!=null && endDate.length()>0){
            Filter equipFilter = new SingleColumnValueFilter(Bytes.toBytes("cf1"),
                    Bytes.toBytes("collectDate"), CompareOp.LESS_OR_EQUAL,
                    new BinaryComparator((endDate+"23:59:59").getBytes()));
            filterList.addFilter(equipFilter);
            filterNum++;
        }

        if(filterNum<=0){
            filterList = null;
        }

        List<String> columnList = new ArrayList<String>();
        columnList.add("targetCode");
        columnList.add("collectDate");
        columnList.add("realValue");
        PageData pageData =  HBaseOperateData.getDataMap("tb_realtime_monitor",null,null,
                filterList,columnList,pageIndex,pageSize);
        List<Map<String,String>> list = pageData.getResultList();

        //结果列表
        List<MonitorData> resultList = new ArrayList<MonitorData>();
        for(int i=0;i<list.size();i++){
            Map<String,String> map = list.get(i);
            String rowKey = map.get("key");
            String companyCode = rowKey.substring(0,9);
            String companyName = "";
            if(companyDict.containsKey(companyCode)){
                companyName = companyDict.get(companyCode).get("CompanyName");
            }
            String danageCode = rowKey.substring(0,11);
            String danageName = "";
            if(danagerDict.containsKey(danageCode)){
                danageName = danagerDict.get(danageCode).get("SourceName");
            }
            String unitCode = rowKey.substring(0,13);
            String unitName = "";
            if(unitDict.containsKey(unitCode)){
                unitName = unitDict.get(unitCode).get("UnitName");
            }
            String equipCode = rowKey.substring(0,17);
            String equipName = "";
            if(equipDict.containsKey(equipCode)){
                equipName = equipDict.get(equipCode).get("EquipName");
            }
            String targetCode = map.get("targetCode");
            String targetName = "";
            String targetUnit = "";
            if(targetDict.containsKey(targetCode)){
                targetName = targetDict.get(targetCode).get("TargetName");
                targetUnit = targetDict.get(targetCode).get("Unit");
            }

            MonitorData  monitorData = new MonitorData();
            monitorData.setDataNum(""+(i+1));
            monitorData.setDataId(rowKey);
            monitorData.setCompanyName(companyName);
            monitorData.setDResourceName(danageName);
            monitorData.setUnitName(unitName);
            monitorData.setEquipName(equipName);
            monitorData.setCollectDate(map.get("collectDate"));
            monitorData.setRealValue(map.get("realValue"));
            monitorData.setTargetName(targetName);
            monitorData.setTargetUnit(targetUnit);
            resultList.add(monitorData);
        }

        long total = pageData.getTotalCount();
        Map<String,Object> resultMap = new HashMap<String,Object>();
        resultMap.put("total",total);
        resultMap.put("rows",resultList);
        return resultMap;
    }


    /**
     * 获取企业下拉框
     * @return
     */
    public Map<String,Map<String,String>> getCompanyDict(){
        return this.hbaseDataMapper.getCompanyDict();
    }

    /**
     * 获取重大危险源下拉框
     * @return
     */
    public Map<String,Map<String,String>> getDresourceDict(String companyCode){
        return this.hbaseDataMapper.getDresourceDict(companyCode);
    }

    /**
     * 获取工艺单元下拉框
     * @return
     */
    public Map<String,Map<String,String>> getUnitDict(String dresourceCode){
        return this.hbaseDataMapper.getUnitDict(dresourceCode);
    }

    /**
     * 获取设备下拉框
     * @return
     */
    public Map<String,Map<String,String>> getEquipDict(String unitCode){
        return this.hbaseDataMapper.getEquipDict(unitCode);
    }

    /**
     * 获取指标下拉框
     * @return
     */
    public Map<String,Map<String,String>> getTargetDict(){
        return this.hbaseDataMapper.getTargetDict();
    }

}
