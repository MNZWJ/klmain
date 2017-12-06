package ax.kl.service;

import ax.kl.entity.ChemicalsInfo;
import ax.kl.entity.MajorHazard;
import java.util.List;
import java.util.Map;

public interface MajorHazardService {

    //获取重大危险源
    List<MajorHazard> getMajorHazard(Map<String,String> param);

    //获取重大危险源关联化学品
    List<ChemicalsInfo> getChemicalsInfoListBySourceId(String sourceId);
}
