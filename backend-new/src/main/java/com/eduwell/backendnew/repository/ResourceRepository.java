package com.eduwell.backendnew.repository;

import com.eduwell.backendnew.entity.ResourceItem;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResourceRepository extends JpaRepository<ResourceItem, Long> {

	List<ResourceItem> findAllByOrderByUpdatedAtDesc();

	List<ResourceItem> findByIsPublishedTrueOrderByUpdatedAtDesc();

	List<ResourceItem> findTop5ByIsPublishedTrueAndIsNewFeatureTrueOrderByUpdatedAtDesc();

	List<ResourceItem> findTop5ByOrderByUsageCountDesc();
}
