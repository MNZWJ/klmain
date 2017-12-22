package ax.kl.service;

import ax.kl.entity.ChemicalsInfo;
import ax.kl.entity.MonitorData;
import com.baomidou.mybatisplus.plugins.Page;

import java.util.List;
import java.util.Map;

/**
 * 化学品信息
 * @author wangbiao
 * Date 2017/12/07
 */
public interface MHistoryDataService {
    void insertData();

    void insertMonitorData();

    long getDataCount();

    Map<String,Object> loadMonitorDataList(int pageIndex,int pageSize);
}