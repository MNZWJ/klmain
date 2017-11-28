package ax.f4j.autoconfig;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * 
 * 
 * <p>Title:</p>
 * <p>Description: </p>
 * <p>Copyright: Copyright (c) 2017</p>
 * <p>Company:第十三工房</p>
 * 
 * @author 罗成
 * @version 0.1.0 创建时间：2017年5月9日-下午4:25:47 
 *
 */

@Component
@Getter
@Setter
@ConfigurationProperties(prefix = "f4j.file")
public class FileProperties {

	private String docPath;

	private String videoPath;

	private String webPath;
	
}
