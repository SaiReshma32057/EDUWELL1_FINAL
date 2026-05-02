package com.eduwell.backendnew.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "resources")
public class ResourceItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String type;

    @Column(columnDefinition = "TEXT")
    private String description;

    @JsonProperty("content_url")
    private String contentUrl;

    @JsonProperty("is_published")
    private Boolean isPublished;

    @JsonProperty("is_new_feature")
    private Boolean isNewFeature;

    @JsonProperty("usage_count")
    private Long usageCount;

    @CreationTimestamp
    @JsonProperty("created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @JsonProperty("updated_at")
    private LocalDateTime updatedAt;

    public ResourceItem() {
    }

    public ResourceItem(Long id, String title, String category, String type) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.type = type;
    }

    public ResourceItem(Long id, String title, String category, String type, String description, String contentUrl,
                        Boolean isPublished, Boolean isNewFeature, Long usageCount) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.type = type;
        this.description = description;
        this.contentUrl = contentUrl;
        this.isPublished = isPublished;
        this.isNewFeature = isNewFeature;
        this.usageCount = usageCount;
    }

    @PrePersist
    public void prePersist() {
        if (description == null) {
            description = "";
        }
        if (contentUrl == null) {
            contentUrl = "#";
        }
        if (isPublished == null) {
            isPublished = true;
        }
        if (isNewFeature == null) {
            isNewFeature = false;
        }
        if (usageCount == null) {
            usageCount = 0L;
        }
    }

    @PreUpdate
    public void preUpdate() {
        if (isPublished == null) {
            isPublished = true;
        }
        if (isNewFeature == null) {
            isNewFeature = false;
        }
        if (usageCount == null) {
            usageCount = 0L;
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getContentUrl() {
        return contentUrl;
    }

    public void setContentUrl(String contentUrl) {
        this.contentUrl = contentUrl;
    }

    public Boolean getIsPublished() {
        return isPublished;
    }

    public void setIsPublished(Boolean isPublished) {
        this.isPublished = isPublished;
    }

    public Boolean getIsNewFeature() {
        return isNewFeature;
    }

    public void setIsNewFeature(Boolean isNewFeature) {
        this.isNewFeature = isNewFeature;
    }

    public Long getUsageCount() {
        return usageCount;
    }

    public void setUsageCount(Long usageCount) {
        this.usageCount = usageCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
