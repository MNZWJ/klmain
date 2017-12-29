package ax.kl.common;

import org.apache.commons.lang.ArrayUtils;
import org.apache.log4j.PropertyConfigurator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;

public class Log4J {
    private static final Logger logger = LoggerFactory.getLogger(Log4J.class);

    @Value("${server.port}")
    private int port;
    @Value("${server.sessionTimeout}")
    private int sessionTimeout;

    static {
        try{
            // 初始化log4j
            String path = System.getProperty("user.dir");
            path = path.substring(0,path.lastIndexOf("\\"));
            System.setProperty("logPath",path);

            String log4jPath = Log4J.class.getClassLoader().getResource("").getPath()+"log4j.properties";
            logger.info("日志启动");
            PropertyConfigurator.configure(log4jPath);
        }catch (Exception e){
            logger.error(e.toString());
        }
    }

    public static void setLogger(String[] args) {
        final String[] temp = args;
        if(ArrayUtils.isNotEmpty(args))
        {
            if(args[0].equals("startup"))
            {
                new Thread(
                        new Runnable(){
                            @Override
                            public void run(){
                                SpringApplication.run(Log4J.class, temp);
                            }
                        }).start();
                System.out.println("program startup");
                logger.info("program startup");
            }else if(args[0].equals("stop"))
            {
                System.out.println("program stop");
                logger.info("program stop");
            }else if(args[0].equals("restart"))
            {
                System.out.println("program restart");
                logger.info("program restart");
            }else if(args[0].equals("status"))
            {
                System.out.println("program status");
                logger.info("program status");
            }
        }
    }
}
