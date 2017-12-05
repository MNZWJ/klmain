package ax.kl.common;

import lombok.Data;

/**
 * @author: XUM
 * Description:
 * Date: Created in 15:30 2017/12/5
 * @Modified By:
 */
@Data
public class SessionUserData {
    /**
     *用户ID
     */
    private String userId;

    /**
     * 用户名
     */
    private String userName;

    /**
     * 角色
     */
    private String roleId;

    /**
     * 单位ID
     */
    private String orgId;

    /**
     * 单位编码
     */
    private String orgCode;

    /**
     * 单位名称
     */
    private String orgName;

    /**
     * 单位类型
     */
    private String orgType;
}
