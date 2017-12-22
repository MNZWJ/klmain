package ax.kl.service.impl;

import ax.kl.entity.MonitorData;
import ax.kl.hbase.*;;
import ax.kl.mapper.HbaseDataMapper;
import ax.kl.service.MHistoryDataService;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.CellUtil;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.*;
import org.apache.hadoop.hbase.client.coprocessor.AggregationClient;
import org.apache.hadoop.hbase.client.coprocessor.LongColumnInterpreter;
import org.apache.hadoop.hbase.filter.*;
import org.apache.hadoop.hbase.util.Bytes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.apache.hadoop.hbase.filter.FilterList.Operator;
import org.apache.hadoop.hbase.filter.CompareFilter.CompareOp;

import java.io.IOException;
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

    public void insertData(){
        //提供row key
        List<HbaseDataEntity> list = new ArrayList<HbaseDataEntity>();
        for(int i=0;i<100;i++){
            HbaseDataEntity entitys = new HbaseDataEntity();
            entitys.setTableName("tb_realtime_alarm");
            entitys.setMobileKey("3704197890101G101_"+ System.currentTimeMillis());
            Map<String, Map<String, String>> familyMaps = new HashMap<String, Map<String, String>>();
            Map<String, String> columnMaps = new HashMap<>();
            columnMaps.put("targetCode", "wd"+i);
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

    public long getDataCount(){
        ResultScanner rs = null;
        long rowCount = 0;
        try {
            HBaseConnectionEntity hcEntity = HBaseConnectionPool.getInstance().getConnection();
            Connection connection = hcEntity.getConnection();
            TableName tableName = TableName.valueOf("tb_realtime_monitor");
            Table table = connection.getTable(tableName);

            Scan scan = new Scan();
            //添加查询条件
            FilterList filterList = new FilterList();
//            Filter filter1 = new RowFilter(CompareFilter.CompareOp.EQUAL,
//                    new SubstringComparator("010102"));

            Filter filter2 = new RowFilter(CompareFilter.CompareOp.EQUAL,
                    new RegexStringComparator("^[0-9A-Z]+_010102"));
            filterList.addFilter(filter2);

            scan.setFilter(filterList);
            rs = table.getScanner(scan);

            for (Result result : rs) {
                rowCount += result.size();
            }
            table.close();
            rs.close();
           // HBaseConnectionPool.getInstance().releaseConnection(hcEntity.getId());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return rowCount;
    }

    public Map<String,Object> loadMonitorDataList(int pageIndex,int pageSize){
         //企业字典
         Map<String,Map<String,String>> companyDict = this.hbaseDataMapper.getCompanyDict();
         //重大危险源
        Map<String,Map<String,String>> danagerDict = this.hbaseDataMapper.getDresourceDict();
        //工艺单元
        Map<String,Map<String,String>> unitDict = this.hbaseDataMapper.getUnitDict();
        //设备
        Map<String,Map<String,String>> equipDict = this.hbaseDataMapper.getEquipDict();

        //添加查询条件
//        FilterList filterList = new FilterList();
//        Filter filter1 = new RowFilter(CompareFilter.CompareOp.EQUAL,
//                new BinaryPrefixComparator("370521002".getBytes()));
//        filterList.addFilter(filter1);

        List<String> columnList = new ArrayList<String>();
        columnList.add("targetCode");
        columnList.add("collectDate");
        columnList.add("realValue");
        PageData pageData =  HBaseOperateData.getDataMap("tb_realtime_monitor",null,null,
                null,columnList,pageIndex,pageSize);
        List<Map<String,String>> list = pageData.getResultList();

        //结果列表
        List<MonitorData> resultList = new ArrayList<MonitorData>();
        for(Map<String,String> map : list){
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

            MonitorData  monitorData = new MonitorData();
            monitorData.setDataId(rowKey);
            monitorData.setCompanyName(companyName);
            monitorData.setDResourceName(danageName);
            monitorData.setUnitName(unitName);
            monitorData.setEquipName(equipName);
            monitorData.setCollectDate(map.get("collectDate"));
            monitorData.setRealValue(map.get("realValue"));
            resultList.add(monitorData);
        }

        long total = pageData.getTotalCount();
        Map<String,Object> resultMap = new HashMap<String,Object>();
        resultMap.put("total",total);
        resultMap.put("rows",resultList);
        return resultMap;
    }



}
