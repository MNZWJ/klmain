package com.example.tst.common;

import lombok.Data;

/**
 * @Author: SuZhenpeng
 * Description:
 * Date: Created in 8:36 2017/11/13
 * @Modified By:
 */
@Data
public class UserInfo {
    /**
     *用户ID
     */
    private String id;

    /**
     * 用户名
     */
    private String username;

    /**
     * 姓名
     */
    private String name;

    /**
     * 身份证
     */
    private String sfz;

    /**
     * 组织机构Id
     */
    private String orgId;

}
