package ax.f4j.file;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

import javax.activation.MimetypesFileTypeMap;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.OutputStream;

/**
 * @author wjm
 * @date 2017/09/20
 * IFileStore的抽象实现，用于将store的多个重载方法定位到入参为InputStream方法
 */
public abstract class AbstractFileStore implements FileStore {

    private static final Logger logger = LoggerFactory.getLogger(AbstractFileStore.class);

    @Override
    public abstract void store(InputStream in, String fileName, String contentType, String targetFileName, FileStoreCallback callback) throws FileStoreException;

    @Override
    public void store(MultipartFile source, String targetFileName, FileStoreCallback callback) throws FileStoreException {
        try {
            if (source == null || source.isEmpty()) {//如果文件不存在或者文件错误，回调错误
                throw new FileStoreException("转存的MultipartFile文件不存在！！");
            } else {
                String fileName = source.getOriginalFilename();
                String contentType = source.getContentType();
                logger.debug("开始MultipartFile类型文件文件的上传，文件名[{}]", fileName);
                store(source.getInputStream(), fileName, contentType, targetFileName, callback);
                logger.debug("完成MultipartFile类型文件文件的上传，文件名[{}]", fileName);
            }
        }catch (Exception e){
            logger.error("{}开始调用回调函数",e.getMessage());
            callback.callback(FileStoreCallback.STATUS_ERROR,null);
            logger.error("{}回调函数执行完成",e.getMessage());
        }

    }

    @Override
    public void store(File source, String targetFileName, FileStoreCallback callback) throws FileStoreException {
        try {
            if (source == null || !source.isFile() || !source.exists()) {//如果文件不存在或者文件错误，回调错误
                throw new FileStoreException("转存的File文件不存在！！");
            } else {
                String fileName = source.getName();
                String contentType = new MimetypesFileTypeMap().getContentType(source);

                logger.debug("开始File类型文件文件的上传，文件名[{}]", fileName);
                store(new FileInputStream(source), fileName, contentType, targetFileName, callback);
                logger.debug("完成File类型文件文件的上传，文件名[{}]", fileName);
            }
        }catch (Exception e){
            logger.error("{}开始调用回调函数",e.getMessage());
            callback.callback(FileStoreCallback.STATUS_ERROR,null);
            logger.error("{}回调函数执行完成",e.getMessage());
        }
    }

    @Override
    public abstract OutputStream read(String path) throws FileStoreException;
}
