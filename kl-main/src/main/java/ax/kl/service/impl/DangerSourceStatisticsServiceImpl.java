package ax.kl.service.impl;

import ax.kl.mapper.DangerSourceStatisticsMapper;
import ax.kl.service.DangerSourceStatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 重大危险源统计
 * @author wangbiao
 */
@Service
public class DangerSourceStatisticsServiceImpl implements DangerSourceStatisticsService {
    private final String[] year={"y2017","y2018","y2019","y2020","y2021"};
    private final String[] deathToll={"a","b","c","d"};

    @Autowired
    DangerSourceStatisticsMapper dSSMapper;

    /**
     * 近五年重大危险源数量统计
     * @return
     */
    @Override
    public List<Map<String,Object>> getFiveYearCountInfo(){
        return getSacle(dSSMapper.getFiveYearCountInfo());
    }

    /**
     * 近五年重大危险源数量统计柱状图
     * @return
     */
    @Override
    public List<Map<String,String>> getFiveYearCountbarInfo(){
        return dSSMapper.getFiveYearCountbarInfo();
    };

    /**
     * 近五年重大危险源可能引发事故类型统计折线
     * @return
     */
    @Override
    public List<Map<String,Object>> getFiveYearAccitentTypeScale(){
        return getSacle(dSSMapper.getFiveYearAccitentTypeScale());
    };

    /**
     * 可能引起的事故类型占比
     * @return
     */
    @Override
    public List<Map<String,String>> getDSAccidenTypeScale(String rank){
        return dSSMapper.getDSAccidenTypeScale(rank);
    };

    /**
     * 安全标准化级别占比
     * @return
     */
    @Override
    public List<Map<String,String>> getStandardRankScale(){
        return dSSMapper.getStandardRankScale();
    };

    /**
     * 重大危险源级别和可能引发事故类型的区域分布
     * @param typeId
     * @return
     */
    @Override
    public List<Map<String,String>> getRankAndAccenTypeAreaInfo(String typeId){
        return dSSMapper.getRankAndAccenTypeAreaInfo(typeId);
    };

    /**
     * 重大危险源引发事故死亡人数统计
     * @return
     */
    @Override
    public List<Map<String,Object>> getDeathTollInfo(){
        List<Map<String,Integer>> list = dSSMapper.getDeathTollInfo();
        List<Map<String,Object>> data = new ArrayList<>();


        for (int i=0;i<deathToll.length;i++){
            Map<String,Object> map =new HashMap<>();
            int[] d =new int[list.size()];
            for (int j=0;j<list.size();j++){
                d[j]=list.get(j).get(deathToll[i]);
            }
            map.put("num",d);
            map.put("name",deathToll[i]);
            map.put("stack","死亡人数");
            data.add(map);
        }

         return data;
    };

    private int nvl(Object age1){
        if (age1!=null&&!"".equals(age1)){
            return Integer.valueOf((Integer)age1);
        }else {
            return 0;
        }
    }

    private List<Map<String,Object>> getSacle(List<Map<String,Object>> list){
        List<Map<String,Object>> data=new ArrayList<>();
        int[] sum =new int[year.length];

        for (int i=0;i<list.size();i++){
            Map<String,Object> map=list.get(i);
            for (int j=0;j<year.length;j++){
                sum[j] += nvl(map.get(year[j]));
            }
        }
        for (int i=0;i<list.size();i++){
            Map<String,Object> map =new HashMap<>();
            Map<String,Object> m =list.get(i);
            int[] result=new int[year.length];
            for (int j=0;j<result.length;j++){
                if (sum[j]!=0){
                    result[j]=nvl(m.get(year[j]))*100/sum[j];
                }else
                {
                    result[j]=0;

                }

            }
            map.put("dictName",list.get(i).get("dictName"));
            map.put("num",result);
            data.add(map);
        }
        return data;
    }
}
