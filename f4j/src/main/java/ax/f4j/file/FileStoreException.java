package ax.f4j.file;

/**
 * @author wjm
 * @date 2017/09/20
 * 用于描述文件仓库转储过程中的错误
 */
public class FileStoreException extends RuntimeException{
    public FileStoreException(){
        super();
    }
    public FileStoreException(String message){
        super(message);
    }
}
