package ax.kl.handler;

import ax.kl.service.MonthStatisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.util.Date;

@Component
@Configurable
@EnableScheduling
public class DataStatisTask {
    @Autowired
    MonthStatisService MonthStatisService;

    //每1分钟执行一次
//    @Scheduled(cron = "0 0 0  * * * ")
//    @Scheduled(cron = "0 0 24  * * * ")
//    public void reportCurrentByCron(){
//       this.MonthStatisService.statisMonthData();
//    }

    private SimpleDateFormat dateFormat(){
        return new SimpleDateFormat ("HH:mm:ss");
    }
}
