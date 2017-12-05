package ax.kl.service;

import ax.kl.entity.MajorHazard;
import java.util.List;

public interface MajorHazardService {

    public List<MajorHazard> getMajorHazard(String CompanyName,String SourceName,String Rank);
}
