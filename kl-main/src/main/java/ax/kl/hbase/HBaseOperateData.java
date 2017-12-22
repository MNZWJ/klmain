package ax.kl.hbase;

import org.apache.commons.lang.StringUtils;
import org.apache.hadoop.hbase.Cell;
import org.apache.hadoop.hbase.CellUtil;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.*;
import org.apache.hadoop.hbase.filter.*;
import org.apache.hadoop.hbase.filter.FilterList.Operator;
import org.apache.hadoop.hbase.util.Bytes;

import java.io.IOException;
import java.util.*;

public class HBaseOperateData {

    /**
     * 批量添加数据
     * @param list
     */
    public static void insertDataList(List<HbaseDataEntity> list)  {
        List<Put> puts = new ArrayList<Put>();
        Table table = null;
        HBaseConnectionEntity hcEntity = null;
        Connection connection = null;
        Put put;
        try {
            hcEntity = HBaseConnectionPool.getInstance().getConnection();
            connection = hcEntity.getConnection();
            for (HbaseDataEntity entity : list) {
                TableName tableName = TableName.valueOf(entity.getTableName());
                table = connection.getTable(tableName);
                // 一个PUT代表一行数据，再NEW一个PUT表示第二行数据,每行一个唯一的ROWKEY
                put = new Put(entity.getMobileKey().getBytes());
                for (String columnfamily : entity.getColumns().keySet()) {
                    for (String column : entity.getColumns().get(columnfamily)
                            .keySet()) {
                        put.addColumn(
                                columnfamily.getBytes(),
                                column.getBytes(),
                                entity.getColumns().get(columnfamily)
                                        .get(column).getBytes());
                    }
                }
                puts.add(put);
            }
            table.put(puts);
            table.close();
            //HBaseConnectionPool.getInstance().releaseConnection(hcEntity.getId());
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if(connection!=null){
                    connection.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * 检索指定表的第一行记录。<br>
     * （如果在创建表时为此表指定了非默认的命名空间，则需拼写上命名空间名称，格式为【namespace:tablename】）。
     * @param tableName 表名称(*)。
     * @param filterList 过滤器集合，可以为null。
     * @return
     */
    public static Result selectFirstResultRow(String tableName,
                                              FilterList filterList) {
        if (StringUtils.isBlank(tableName))
            return null;
        Table hTable = null;
        Connection  connection = null;
        try {
            HBaseConnectionEntity hcEntity = HBaseConnectionPool.getInstance().getConnection();
            connection = hcEntity.getConnection();
            hTable = connection.getTable(TableName.valueOf(tableName));
            //table = .getHBaseTable(tableName);
            Scan scan = new Scan();
            if (filterList != null) {
                scan.setFilter(filterList);
            }
            ResultScanner scanner = hTable.getScanner(scan);
            Iterator<Result> iterator = scanner.iterator();
            int index = 0;
            while (iterator.hasNext()) {
                Result rs = iterator.next();
                if (index == 0) {
                    scanner.close();
                    return rs;
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                if(hTable!=null){
                    hTable.close();
                }
                if(connection!=null){
                   connection.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return null;
    }


    /**
     * 数据查询代码
     *
     * @param tableName
     *            表名
     * @param startRow
     *            起点key
     * @param stopRow
     *            筛选id
     * @param currentPage
     *            当前页
     * @param pageSize
     *            每页数量
     * @return
     * @throws IOException
     */
    public  static  PageData getDataMap(String tableName, String startRow, String stopRow,
                                        FilterList filterList,List<String> columns,
                               Integer currentPage, Integer pageSize)  {

        List<Map<String, String>> mapList = new LinkedList<Map<String, String>>();
        ResultScanner scanner = null;
        // 为分页创建的封装类对象，下面有给出具体属性
        PageData tbData = null;
        Table table = null;
        Connection  connection = null;
        try {
            // 计算起始页和结束页
            Integer firstPage = (currentPage - 1) * pageSize;
            Integer endPage = firstPage + pageSize;
            // 从表池中取出HBASE表对象
            HBaseConnectionEntity hcEntity = HBaseConnectionPool.getInstance().getConnection();
            connection = hcEntity.getConnection();
            table = connection.getTable(TableName.valueOf(tableName));
            // 获取筛选对象
            Scan scan = new Scan();
            if (startRow != null) {
                scan.setStartRow(Bytes.toBytes(startRow));
            }
            if (stopRow != null) {
                scan.setStopRow(Bytes.toBytes(stopRow));
            }
            if (filterList != null) {
                scan.setFilter(filterList);
            }
            // ----------------添加过滤查询
            // 缓存1000条数据
            scan.setCaching(10000);
            scan.setCacheBlocks(false);
            scanner = table.getScanner(scan);
            int i = 0;
            List<byte[]> rowList = new LinkedList<byte[]>();
            // 遍历扫描器对象， 并将需要查询出来的数据row key取出
            for (Result result : scanner) {
                String row = toStr(result.getRow());
                if (i >= firstPage && i < endPage) {
                    //System.out.println(row);
                    rowList.add(getBytes(row));
                }
                i++;
            }

            // 获取取出的row key的GET对象
            List<Get> getList = getList(rowList,columns);
            Result[] results = table.get(getList);
            // 遍历结果
            for (Result result : results) {
                Map<byte[], byte[]> fmap = packFamilyMap(result);
                Map<String, String> rmap = packRowMap(fmap, result);
                mapList.add(rmap);
            }
            // 封装分页对象
            tbData = new PageData();
            tbData.setCurrentPage(currentPage);
            tbData.setPageSize(pageSize);
            tbData.setTotalCount(i);
            tbData.setTotalPage(getTotalPage(pageSize, i));
            tbData.setResultList(mapList);
        }
        catch (IOException e) {
            e.printStackTrace();
        }
        finally {
            try {
                if(table!=null){
                    table.close();
                }
                if(connection!=null){
                    connection.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return tbData;

    }

    /* 根据ROW KEY集合获取GET对象集合 */
    private static List<Get> getList(List<byte[]> rowList,List<String> columns) {
        List<Get> list = new LinkedList<Get>();
        for (byte[] row : rowList) {
            Get get = new Get(row);
            for (String column:columns){
                get.addColumn(getBytes("cf1"), getBytes(column));
                get.addColumn(getBytes("cf1"), getBytes("timestamp"));
                get.addColumn(getBytes("cf1"), getBytes("value"));
            }
            list.add(get);
        }
        return list;
    }
    /**
     * 封装配置的所有字段列族
     */
    private static Map<byte[], byte[]> packFamilyMap(Result result) {
        Map<byte[], byte[]> dataMap = null;
        dataMap = new LinkedHashMap<byte[], byte[]>();
        dataMap.putAll(result.getFamilyMap(getBytes("cf1")));
        return dataMap;
    }

    /**
     * 封装每行数据
     *
     * @param result
     */
    private static Map<String, String> packRowMap(Map<byte[], byte[]> dataMap, Result result) {
        Map<String, String> map = new LinkedHashMap<String, String>();

        for (byte[] key : dataMap.keySet()) {

            byte[] value = dataMap.get(key);

            map.put(toStr(key), toStr(value));

        }
        map.put("key", Bytes.toString(result.getRow()));
        return map;
    }

    private static int getTotalPage(int pageSize, int totalCount) {
        int n = totalCount / pageSize;
        if (totalCount % pageSize == 0) {
            return n;
        } else {
            return ((int) n) + 1;
        }
    }

    private static String toStr(byte[] bt) {
        return Bytes.toString(bt);
    }

    /* 转换byte数组 */
    public static byte[] getBytes(String str) {
        if (str == null)
            str = "";

        return Bytes.toBytes(str);
    }

}
