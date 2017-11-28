package ax.f4j.util;

import java.util.UUID;

public class StringUtil {
    public static String getUUid(){
        return UUID.randomUUID().toString().replaceAll("-","");
    }
}
