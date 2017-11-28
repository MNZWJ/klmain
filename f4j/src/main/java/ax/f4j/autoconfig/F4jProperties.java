package ax.f4j.autoconfig;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.NestedConfigurationProperty;

/**
 * @author wjm
 * @time 2017/9/14
 * @version 1.0.0
 * 用于读取安信开发框架相关的配置数据
 * 主要是tkmybatis相关的配置参数
 */
@Data
@ConfigurationProperties(prefix = F4jProperties.AXF_PREFIX)
public class F4jProperties {
    public static final String AXF_PREFIX = "f4j";

    /**
     * 是否开始mybatis sql性能监控
     */
    private Boolean sqlPerformanceScan;

    /**
     * FileCopyFileStore文件仓库的根路径。
     */
    private String fileCopyFileStoreRoot;
}
