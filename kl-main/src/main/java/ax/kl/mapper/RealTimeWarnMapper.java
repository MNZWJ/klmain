package ax.kl.mapper;

import ax.kl.entity.RealTimeWarn;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author: ZhenpengSu
 * @description:
 * @date: Created in 14:34 2017/12/15
 * @modified By:
 */
@Repository
public interface RealTimeWarnMapper {

    /**
     * 获取实时预警数据
     * @return
     */
    public List<RealTimeWarn> getRealTimeWarnData();

}
