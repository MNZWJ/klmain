package com.example.tst.service;

import com.baomidou.mybatisplus.plugins.Page;
import com.example.tst.entity.DataDict;
import com.example.tst.entity.TreeModel;

import java.util.List;


/**
 * @Author: SuZhenpeng
 * Description:
 * Date: Created in 15:32 2017/11/17
 * @Modified By:
 */
public interface DictionaryService {

    /**
     * 获取字典
     */
    Page<DataDict> GetDictList(Page page,String typeId, String dictSearchName);

    /**
     * 获取字典树
     */
    List<TreeModel> getDictTreeList();

    /**
     * 保存字典
     * @param dataDict
     * @return
     */
    String saveDict(DataDict dataDict);

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
    String moveOrder(String type,DataDict dataDict);

}
