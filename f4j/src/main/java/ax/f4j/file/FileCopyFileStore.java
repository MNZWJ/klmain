package ax.f4j.file;

import ax.f4j.util.StringUtil;
import lombok.Data;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.FileCopyUtils;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;

/**
 * @author wjm
 * @date 2017-09-20
 * 用本地文件copy的方式实现文件的转存。
 * 指定转存的跟路径，在根路径中根据文件类型进行分目录存储
 */
@Data
public class FileCopyFileStore extends AbstractFileStore{

    private static final Logger logger = LoggerFactory.getLogger(FileCopyFileStore.class);

    //要求路径必须为目录，并且以File.seprator结尾
    private String rootPath;

    public FileCopyFileStore(String rootPath){
        this.rootPath = rootPath;
    }

    @Override
    public void store(InputStream in, String fileName, String contentType, String targetFileName, FileStoreCallback callback) throws FileStoreException {
        try {
            new Thread(new Runnable() {
                @Override
                public void run() {
                    try {
                        String tarName = targetFileName==null ?StringUtil.getUUid():targetFileName;
                        //根据contentType选择子目录

                        String tarFilePath = rootPath + tarName;

                        logger.debug("启动异步线程开始文件[{}]转存，目标路径为[{}]", fileName, tarName);
                        File target = new File(tarFilePath);
                        FileCopyUtils.copy(in, new FileOutputStream(target));

                        logger.debug("文件[{}]转存成功，准备调用回调函数进行后续处理。",fileName);

                        callback.callback(FileStoreCallback.STATUS_OK,tarName);

                        logger.debug("文件[{}]回调处理完成。", fileName);
                    }catch (Exception e){
                        logger.error("文件[{}]转存失败，准备调用回调函数进行后续处理。", fileName);
                        callback.callback(FileStoreCallback.STATUS_ERROR,null);
                        logger.error("文件[{}]转存失败，回调处理完成。", fileName);
                    }
                }
            }).start();
        }catch (Exception e){
            callback.callback(FileStoreCallback.STATUS_ERROR,null);
        }
    }

    @Override
    public OutputStream read(String path) throws FileStoreException{
        String filePath = rootPath + path;
        File file = new File(filePath);
        if(!file.exists() || !file.isFile()){
            throw new FileStoreException("文件不存在！");
        }
        OutputStream out = null;
        try {
            out = new FileOutputStream(file);
        }catch (Exception e){
            throw new FileStoreException("文件读取错误！");
        }
        return out;
    }

    @Override
    public void remove(String path) throws FileStoreException {
        String filePath = rootPath + path;
        File file = new File(filePath);
        if(!file.exists() || !file.isFile()){
            throw new FileStoreException("文件不存在！");
        }
        file.delete();
    }
}
