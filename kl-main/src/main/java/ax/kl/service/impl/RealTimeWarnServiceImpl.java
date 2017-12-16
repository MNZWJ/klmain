package ax.kl.service.impl;

import ax.kl.entity.RealTimeWarn;
import ax.kl.mapper.RealTimeWarnMapper;
import ax.kl.service.RealTimeWarnService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * @author: ZhenpengSu
 * @description:
 * @date: Created in 16:19 2017/12/15
 * @modified By:
 */
@Service
@Transactional
public class RealTimeWarnServiceImpl implements RealTimeWarnService {

    @Autowired
    RealTimeWarnMapper realTimeWarnMapper;

    /**
     * 获取实时预警数据
     *
     * @return
     */
    @Override
    public List<RealTimeWarn> getRealTimeWarnData() {
        return realTimeWarnMapper.getRealTimeWarnData();
    }
}
