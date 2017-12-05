package ax.kl.service.impl;

import ax.kl.common.TreeUtil;
import ax.kl.entity.SysDataDict;
import ax.kl.entity.TreeModel;
import ax.kl.service.SysDictionaryService;
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
public class SysDictionaryServiceImpl implements SysDictionaryService {

    @Autowired
    ax.kl.mapper.SysDictionaryMapper SysDictionaryMapper;

    /**
     * 加载列表
     * @param page
     * @param typeId
     * @param dictSearchName
     * @return
     */
    @Override
    public Page<SysDataDict> GetDictList(Page page, String typeId, String dictSearchName) {
        page.setRecords(SysDictionaryMapper.GetDictList(page,typeId,dictSearchName));
        return page;
    }

    /**
     * 加载树
     * @return
     */
    @Override
    public List<TreeModel> getDictTreeList() {
        return TreeUtil.getTree(SysDictionaryMapper.getDictTreeList());
    }

    /**
     * 新增字典
     * @param dataDict
     */
    @Override
    public String saveDict(SysDataDict dataDict) {

        if(dataDict.getDictId()==null|| "".equals(dataDict.getDictId())){
            String dictId=UUID.randomUUID().toString();
            dataDict.setDictId(dictId);
            dataDict.setDictOrder(Integer.toString(SysDictionaryMapper.getMaxOrder()));
            dataDict.setIsDel("0");
            SysDictionaryMapper.saveDict(dataDict);
            return dictId;
        }else{
            SysDictionaryMapper.updateDict(dataDict);
            return "";
        }


    }

    @Override
    public int deleteDicts(String[] ids) {
        if(SysDictionaryMapper.getDictType(ids).size()==0)
        {
            SysDictionaryMapper.deleteDicts(ids);
            return 1;
        }

        return 0;
    }

    @Override
    public String moveOrder(String type, SysDataDict dataDict) {

        List<SysDataDict> dataList= SysDictionaryMapper.getOrder(dataDict.getTypeId(),type,dataDict.getDictOrder());

        if(dataList.size()>0){

            SysDataDict data=dataList.get(0);
            SysDictionaryMapper.upDateOrderSort(dataDict.getDictId(),data.getDictOrder(),data.getDictId(),dataDict.getDictOrder());


            return "0";
        }

        if("up".equals(type)){
            return "1";
        }else{
            return "2";
        }

    }

    /**
     * 加载字典内容
     */
    @Override
    public List<SysDataDict> getDataDictList(String typeId) {
        return SysDictionaryMapper.getDataDictList(typeId);
    }


}
