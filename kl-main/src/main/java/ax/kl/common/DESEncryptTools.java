package ax.kl.common;
import java.security.SecureRandom;
import java.security.spec.KeySpec;
import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.DESKeySpec;

/**
 *
 * 项目名称：CipherTest
 * 类  名  称：AESEncryptTools
 * 类  描  述：DES加密解密算法
 * 创  建  人：david
 * 创建时间：2016年5月2日 下午8:00:21
 * Copyright (c) david-版权所有
 */
public final class DESEncryptTools {

    //加密算是是des
    private static final String ALGORITHM = "DES";
    //转换格式
    private static final String TRANSFORMATION = "DES/ECB/PKCS5Padding";

    private static byte[]  key={ 55, 103, 101, 79, 36, 99, 125, 3 };

    //利用8个字节64位的key给src加密
    @SuppressWarnings("unused")
    public static byte[] encrypt(byte[] src)
    {
        try {
            //加密
            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            SecretKeyFactory secretKeyFactory = SecretKeyFactory.getInstance(ALGORITHM);
            KeySpec keySpec = new DESKeySpec(key);
            SecretKey secretKey = secretKeyFactory.generateSecret(keySpec);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey,new SecureRandom());
            byte[] enMsgBytes = cipher.doFinal(src);
            return enMsgBytes;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    //利用8个字节64位的key给src解密
    @SuppressWarnings("unused")
    public static byte[] decrypt(byte[] encryptBytes){
        try {
            //解密
            //Cipher deCipher = Cipher.getInstance("DES/CBC/PKCS5Padding");
            Cipher deCipher = Cipher.getInstance(TRANSFORMATION);
            SecretKeyFactory deDecretKeyFactory = SecretKeyFactory.getInstance(ALGORITHM);
            KeySpec deKeySpec = new DESKeySpec(key);
            SecretKey deSecretKey = deDecretKeyFactory.generateSecret(deKeySpec);
            deCipher.init(Cipher.DECRYPT_MODE, deSecretKey,new SecureRandom());
            byte[] deMsgBytes = deCipher.doFinal(encryptBytes);
            return deMsgBytes;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}