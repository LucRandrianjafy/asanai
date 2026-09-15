package mg.asanai.service;

import mg.asanai.model.Region;
import mg.asanai.repository.RegionRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RegionService {

    private final RegionRepository regionRepository;

    public RegionService(RegionRepository regionRepository) {
        this.regionRepository = regionRepository;
    }

    public List<Region> getAllRegion() {
        return regionRepository.getAllRegion();
    }

    public Region getRegionById(Long id) {
        return regionRepository.getRegionById(id);
    }
}