package ax.kl.handler;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @Author: SuZhenpeng
 * Description:
 * Date: Created in 9:37 2017/11/13
 * @Modified By:
 */
public class TstAspectHandler {
    private static final Logger logger= LoggerFactory.getLogger(TstAspectHandler.class);

    /**
     * 统一日常处理方法切面
     */
    @Pointcut("execution(* ax.kl.handler.TstAspectHandler.handle*Exception(RuntimeException+))")
    public void exceptionHandlerPointcut(){}

    /**
     * 在出现异常时记录debug日志
     * @param joinPoint
     */
    @Before("exceptionHandlerPointcut()")
    public void logError(JoinPoint joinPoint){
        RuntimeException e = (RuntimeException)joinPoint.getArgs()[0];
        logger.debug(e.getMessage(),e);
    }

}
