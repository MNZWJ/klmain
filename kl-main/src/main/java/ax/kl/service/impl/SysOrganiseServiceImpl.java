package ax.kl.service.impl;

import ax.kl.entity.DataDict;
import ax.kl.entity.SysOrganise;
import ax.kl.entity.TreeModel;
import ax.kl.mapper.DictionaryMapper;
import ax.kl.mapper.SysOrganiseMapper;
import ax.kl.service.SysOrganiseService;
import com.baomidou.mybatisplus.plugins.Page;
import ax.kl.common.TreeUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Transactional
@Service
public class SysOrganiseServiceImpl implements SysOrganiseService {

    @Autowired
    private SysOrganiseMapper sysOrganiseMapper;

    @Autowired
    private DictionaryMapper dictionaryMapper;

    //获取组织机构列表
    @Override
    public Page<SysOrganise> getSysOrganiseList(Page page, String typeId, String searchName) {
        page.setRecords(sysOrganiseMapper.getSysOrganiseList(page,typeId,searchName));
        return page;
    }

    //做组织机构树
    @Override
    public List<TreeModel> getSysOrganiseTreeList() {
        return TreeUtil.getTree(sysOrganiseMapper.getSysOrganiseTreeList());
    }


    //新增或更新组织机构
    @Override
    public String updateOrAddSysOrganise(SysOrganise sysOrganise) {
        if(sysOrganise.getOrganiseId().equals("")||sysOrganise.getOrganiseId()==null){
            String organiseId= UUID.randomUUID().toString();
            sysOrganise.setOrganiseId(organiseId);
            sysOrganise.setShowOrder(sysOrganiseMapper.getMaxOrder());
            sysOrganise.setIsDel("0");
            sysOrganiseMapper.insertSysOrganise(sysOrganise);
            return organiseId;
        }else{
            sysOrganiseMapper.updateSysOrganise(sysOrganise);
            return "";
        }
    }

    //单一或批量删除组织机构
    @Override
    public int deleteSysOrganises(String[] ids) {
        //如果没有子节点
        if(sysOrganiseMapper.getSysOrganiseType(ids).size()==0){
            sysOrganiseMapper.deleteSysOrganises(ids);
            return 1;
        }
        return 0;
    }

//    @Override
//    public String moveOrder(String type, SysOrganise sysOrganise) {
//        //先按照order顺序列出此节点的父节点的所有节点
//        List<SysOrganise> lists=sysOrganiseMapper.getOrder(sysOrganise.getParentId(),type,String.valueOf(sysOrganise.getShowOrder()));
//        if(lists.size()>0){
//            SysOrganise sys=lists.get(0);
//            sysOrganiseMapper.upDateOrderSort(sys.getOrganiseId(),String.valueOf(sys.getShowOrder()),sysOrganise.getOrganiseId(),String.valueOf(sysOrganise.getShowOrder()));
//            return "0";
//        }
//        if(type.equals("up")){
//            return "1";
//        }else{
//            return "2";
//        }
//    }

    @Override
    public List<DataDict> getDataDictByTypeId() {
        return dictionaryMapper.GetDictList(new Page(),"53",null);
    }

    @Override
    public List<SysOrganise> getAllSysOrganises() {
        return sysOrganiseMapper.getAllSysOrganises();
    }
}
