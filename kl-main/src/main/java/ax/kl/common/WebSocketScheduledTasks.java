package ax.kl.common;

import ax.kl.service.PushRealAlarmDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * @author: ZhenpengSu
 * @description:
 * @date: Created in 10:15 2017/12/26
 * @modified By:
 */
@Component
@Configurable
@EnableScheduling
public class WebSocketScheduledTasks {

    @Autowired
    PushRealAlarmDataService pushRealAlarmDataService ;
    //每1分钟执行一次
    @Scheduled(cron = "0 */1 *  * * * ")
    public void reportCurrentByCron(){
        pushRealAlarmDataService.pushMessage();
    }


}
