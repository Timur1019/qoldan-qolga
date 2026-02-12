package com.test.qoldanqolga.mapper;

import com.test.qoldanqolga.dto.user.ReviewDto;
import com.test.qoldanqolga.model.Review;
import com.test.qoldanqolga.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface ReviewMapper extends BaseMapper<Review, ReviewDto> {

    @Mapping(target = "authorDisplayName", source = "author", qualifiedByName = "displayName")
    @Mapping(target = "targetDisplayName", source = "targetUser", qualifiedByName = "displayName")
    @Override
    ReviewDto toDto(Review review);

    @Named("displayName")
    default String getDisplayName(User user) {
        return user != null ? user.getDisplayName() : null;
    }
}
