package ax.f4j.file;

/**
 * @author wjm
 * @date 2017-09-20
 * 文件仓库文件转发完成后的回调函数接口
 * 文件上传完成或者出错后回调改接口的callback方法
 */
public interface FileStoreCallback {
    public static int STATUS_ERROR = -1;
    public static int STATUS_OK = 1;

    /**
     *
     * @param code 状态码
     * @param targetPath 如果上传成功，回传目标路径
     */
    void callback(int code, String targetPath);
}
