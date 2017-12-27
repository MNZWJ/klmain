package ax.kl.service.impl;


import ax.kl.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import java.util.HashMap;

/**
 * @author: ZhenpengSu
 * @description:
 * @date: Created in 10:52 2017/12/26
 * @modified By:
 */
@Service
public class PushRealAlarmDataServiceImpl implements PushRealAlarmDataService {

    /**
     * 推送消息
     */
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * 动态风险云图
     */
    @Autowired
    DynamicRiskCloudService dynamicRiskCloudService;

    /**
     * 重大危险源报警统计
     */
    @Autowired
    DangerousAlarmStatisticService dangerousAlarmStatisticService;

    /**
     * 实时预警
     */
    @Autowired
    RealTimeWarnService realTimeWarnService;

    /**
     * 超期运行报警
     */
    @Autowired
    OverdueAlarmService overdueAlarmService;

    @Override
    public String pushMessage() {

        //动态风险云图获取重大危险源
        this.messagingTemplate.convertAndSend( "/topic/DynamicRiskCloudHazardList", dynamicRiskCloudService.getHazardList(new HashMap<String , String>()));

        //重大危险源报警统计今日企业报警次数
        this.messagingTemplate.convertAndSend( "/topic/DangerousAlaramCompanyAlarmData", dangerousAlarmStatisticService.getCompanyAlarmData());

        //重大危险源报警统计今日报警类型占比
        this.messagingTemplate.convertAndSend( "/topic/DangerousAlarmTypeDay", dangerousAlarmStatisticService.getAlarmTypeDay());

        //重大危险源报警统计今日设备类型报警统计
        this.messagingTemplate.convertAndSend( "/topic/DangerousAlarmEquipTypeAlarmToday", dangerousAlarmStatisticService.getEquipTypeAlarmToday());

        //实时预警数据获取
        this.messagingTemplate.convertAndSend( "/topic/RealTimeWarnRealTimeWarnData", realTimeWarnService.getRealTimeWarnData());

        //超期运行报警
        this.messagingTemplate.convertAndSend("/topic/RealAlarmCompanyList",overdueAlarmService.getAlarmCompanyList(new HashMap<String , String>()));
        return "1";
    }
}
