package ax.f4j.file;

import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.InputStream;
import java.io.OutputStream;

/**
 * @author wjm
 * @date 2017/09/20
 * 系统与文件仓库的交互接口类。
 * 文件上传后由专门的文件仓库负责文件的管理，通过该接口实现文件的上传与下载。
 *
 * TODO 转存过程中可以应该根据一定的规则对文件格式进行转换，如视频的转码，图片的格式转换、分辨率转换等，可以在store方法中进行扩充，目前暂不支持。
 */
public interface FileStore {

    /**
     * 实现文件的上传
     * 该方法为异步方法，将文件交给该方法后直接返回，文件上传完成或者出错后通过调用回调接口进行结果的反馈。
     * 回调方法由使用方自己编写逻辑
     * @param in 传入的文件流
     * @param contentType 文件类型
     * @param fileName 文件名
     * @param targetFileName 目标文件名，如果指定以该文件名为准，否则自动生成UUID
     * @param callback 上传完成或出错后的回调函数
     * @throws FileStoreException
     */
    void store(InputStream in, String fileName, String contentType, String targetFileName, FileStoreCallback callback) throws FileStoreException;

    /**
     * 上传文件的重载函数，用于上传spring MultipartFile指向的文件
     * @param source 源文件，为spring的form上传对象
     * @param targetFileName 目标文件名，如果指定以该文件名为准，否则自动生成UUID
     * @param callback 上传完成或出错后的回调函数
     * @throws FileStoreException
     */
    void store(MultipartFile source, String targetFileName, FileStoreCallback callback) throws FileStoreException;

    /**
     * 上传文件的重载函数，用于上传File指向的文件
     * @param source 源文件，为spring的form上传对象
     * @param targetFileName 目标文件名，如果指定以该文件名为准，否则自动生成UUID
     * @param callback 上传完成或出错后的回调函数
     * @throws FileStoreException
     */
    void store(File source, String targetFileName, FileStoreCallback callback) throws FileStoreException;

    /**
     * 从文件仓库读取文件。
     * @param path 文件仓库中文件的定位路径。
     * @return 文件流
     * @throws FileStoreException
     */
    OutputStream read(String path) throws FileStoreException;

    /**
     * 从文件仓库中删除文件
     * @param path
     * @throws FileStoreException
     */
    void remove(String path) throws FileStoreException;
}
