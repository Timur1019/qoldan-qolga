package com.test.qoldanqolga.mapper;

import com.test.qoldanqolga.dto.auth.AuthResponse;
import com.test.qoldanqolga.dto.auth.RegisterRequest;
import com.test.qoldanqolga.dto.auth.UserInfo;
import com.test.qoldanqolga.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper extends BaseMapper<User, UserInfo> {

    @Override
    @Mapping(target = "role", source = "role", resultType = String.class)
    UserInfo toDto(User user);

    @Mapping(target = "token", source = "token")
    @Mapping(target = "email", source = "user.email")
    @Mapping(target = "displayName", source = "user.displayName")
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "role", source = "user.role", resultType = String.class)
    AuthResponse toAuthResponse(User user, String token);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    User toUser(RegisterRequest request);
}
