package ax.kl.service;

import ax.kl.entity.MajorHazard;
import java.util.List;
import java.util.Map;

public interface MajorHazardService {

    public List<MajorHazard> getMajorHazard(Map<String,String> param);
}
