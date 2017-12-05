package ax.kl.service;

import ax.kl.entity.TreeModel;
import com.baomidou.mybatisplus.plugins.Page;
import ax.kl.entity.SysDataDict;

import java.util.List;


/**
 * @Author: SuZhenpeng
 * Description:
 * Date: Created in 15:32 2017/11/17
 * @Modified By:
 */
public interface SysDictionaryService {

    /**
     * 获取字典
     */
    Page<SysDataDict> GetDictList(Page page, String typeId, String dictSearchName);

    /**
     * 获取字典树
     */
    List<TreeModel> getDictTreeList();

    /**
     * 保存字典
     * @param dataDict
     * @return
     */
    String saveDict(SysDataDict dataDict);

    /**
     * 删除字典
     */
    int deleteDicts(String[] ids);

    /**
     * 移动节点
     * @param type
     * @param dataDict
     * @return
     */
    String moveOrder(String type,SysDataDict dataDict);

    /**
     * 加载字典内容
     * @param typeId
     * @return
     */
    List<SysDataDict> getDataDictList(String typeId);

}
