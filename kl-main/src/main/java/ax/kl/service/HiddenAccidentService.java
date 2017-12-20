package ax.kl.service;

import ax.kl.entity.HiddenAccident;
import ax.kl.entity.DangerSourceInfo;
import com.baomidou.mybatisplus.plugins.Page;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;

/**
 * @author: ZhenpengSu
 * @description:
 * @date: Created in 9:54 2017/12/6
 * @modified By:
 */
public interface HiddenAccidentService {

    /**
     * 加载危险源列表
     * @return
     */
    List<DangerSourceInfo> getHazardList(Map<String,String> param);

    /**
     * 加载隐患信息
     * @param sourceId
     * @param page
     * @param searchName
     * @return
     */
    Page<HiddenAccident> getHiddenInfo(Page page,String sourceId,String searchName);

    /**
     * 获取所有隐患信息 无过滤-分页
     * @param page
     * @param dangerSource
     * @param hiddenDanger
     * @return
     */
    Page<HiddenAccident> getHiddenAllInfo(Page page,String dangerSource,String hiddenDanger,String rank,String rectification,String startdate,String enddate);

    /**
     * 字节流获取Excel数据并插入
     * @param  file
     * @return
     */
    String inputHAccident(MultipartFile file);
}
