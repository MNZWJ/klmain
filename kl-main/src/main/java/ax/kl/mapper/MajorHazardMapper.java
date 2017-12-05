package ax.kl.mapper;

import ax.kl.entity.MajorHazard;
import com.baomidou.mybatisplus.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MajorHazardMapper{
    List<MajorHazard> getMorHazar(@Param("filter") String filter);
}
