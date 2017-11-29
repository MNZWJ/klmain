package ax.kl.service.impl;

import ax.kl.common.TreeUtil;
import ax.kl.entity.DataDict;
import ax.kl.entity.TreeModel;
import ax.kl.service.DictionaryService;
import com.baomidou.mybatisplus.plugins.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;


/**
 * @Author: SuZhenpeng
 * Description:
 * Date: Created in 15:37 2017/11/17
 * @Modified By:
 */
@Transactional//事务控制
@Service
public class DictionaryServiceImpl  implements DictionaryService {

    @Autowired
    ax.kl.mapper.DictionaryMapper DictionaryMapper;

    /**
     * 加载列表
     * @param page
     * @param typeId
     * @param dictSearchName
     * @return
     */
    @Override
    public Page<DataDict> GetDictList(Page page, String typeId, String dictSearchName) {
        page.setRecords(DictionaryMapper.GetDictList(page,typeId,dictSearchName));
        return page;
    }

    /**
     * 加载树
     * @return
     */
    @Override
    public List<TreeModel> getDictTreeList() {
        return TreeUtil.getTree(DictionaryMapper.getDictTreeList());
    }

    /**
     * 新增字典
     * @param dataDict
     */
    @Override
    public String saveDict(DataDict dataDict) {

        if(dataDict.getDictId()==null|| "".equals(dataDict.getDictId())){
            String dictId=UUID.randomUUID().toString();
            dataDict.setDictId(dictId);
            dataDict.setDictOrder(Integer.toString(DictionaryMapper.getMaxOrder()));
            dataDict.setIsDel("0");
            DictionaryMapper.saveDict(dataDict);
            return dictId;
        }else{
            DictionaryMapper.updateDict(dataDict);
            return "";
        }


    }

    @Override
    public int deleteDicts(String[] ids) {
        if(DictionaryMapper.getDictType(ids).size()==0)
        {
            DictionaryMapper.deleteDicts(ids);
            return 1;
        }

        return 0;
    }

    @Override
    public String moveOrder(String type, DataDict dataDict) {

        List<DataDict> dataList=DictionaryMapper.getOrder(dataDict.getTypeId(),type,dataDict.getDictOrder());

        if(dataList.size()>0){

            DataDict data=dataList.get(0);
            DictionaryMapper.upDateOrderSort(dataDict.getDictId(),data.getDictOrder(),data.getDictId(),dataDict.getDictOrder());


            return "0";
        }

        if("up".equals(type)){
            return "1";
        }else{
            return "2";
        }

    }


}
