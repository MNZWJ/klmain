package ax.kl.common;

/**
 * @Author: SuZhenpeng
 * Description:
 * Date: Created in 8:35 2017/11/13
 * @Modified By:
 */

/**
 * 权限验证相关的工具，用于保存和获取当前的登录用户信息
 * 可以有不同的实现，目前的实现逻辑是将信息保存在Session中
 * 做Service等层的单元测试时，需要做一个另外的实现，以解除service层与web上下文的耦合关系
 * @author wangjm
 */
public interface AuthTools {
    /**
     * 登录成功后，保存当前用户信息
     * @param userInfo
     */
    void storeUser(UserInfo userInfo);

    /**
     * 获得当前登录信息
     * @return
     */
    UserInfo getUserInfo();

    /**
     * 清空当前登录信息
     */
    void invalidate();
}