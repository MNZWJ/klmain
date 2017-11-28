package com.example.tst.exception;

/**
 * @Author: SuZhenpeng
 * Description:
 * Date: Created in 9:34 2017/11/13
 * @Modified By:
 */

import lombok.Getter;
import lombok.ToString;

/**
 * 用于封装通用异常，错误码固定为400，错误信息由用户自己传入。
 * @author wangjm
 * @date 2017/09/27
 */
@ToString
@Getter
public class TstCommonException extends RuntimeException{
    private Integer code = 400;
    private String msg;

    public TstCommonException(String msg){
        this.msg = msg;
    }
}
