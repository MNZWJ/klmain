package ax.kl.service;

import ax.kl.entity.RealTimeWarn;

import java.util.List;

/**
 * @author: ZhenpengSu
 * @description:
 * @date: Created in 16:18 2017/12/15
 * @modified By:
 */
public interface RealTimeWarnService {
    /**
     * 获取实时预警数据
     * @return
     */
    public List<RealTimeWarn> getRealTimeWarnData();
}
