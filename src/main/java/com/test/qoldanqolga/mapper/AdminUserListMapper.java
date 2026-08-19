package com.test.qoldanqolga.mapper;

import com.test.qoldanqolga.dto.admin.AdminUserListItemDto;
import com.test.qoldanqolga.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AdminUserListMapper {

    @Mapping(target = "role", expression = "java(user.getRole() != null ? user.getRole().name() : null)")
    @Mapping(target = "profileVerified", expression = "java(Boolean.TRUE.equals(user.getProfileVerified()))")
    AdminUserListItemDto toDto(User user);
}
