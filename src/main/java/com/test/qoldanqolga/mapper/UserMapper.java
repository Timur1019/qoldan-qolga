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
    @Mapping(target = "avatarPhotos", expression = "java(com.test.qoldanqolga.util.JsonUtil.parseStringList(user.getAvatarPhotos()))")
    @Mapping(target = "profileVerified", source = "profileVerified")
    @Mapping(target = "storeVerified", source = "storeVerified")
    UserInfo toDto(User user);

    @Mapping(target = "token", source = "token")
    @Mapping(target = "email", source = "user.email")
    @Mapping(target = "phone", source = "user.phone")
    @Mapping(target = "displayName", source = "user.displayName")
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "role", source = "user.role", resultType = String.class)
    @Mapping(target = "avatar", source = "user.avatar")
    @Mapping(target = "newUser", ignore = true)
    AuthResponse toAuthResponse(User user, String token);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "phone", ignore = true)
    @Mapping(target = "phoneVerifiedAt", ignore = true)
    @Mapping(target = "avatar", ignore = true)
    @Mapping(target = "avatarPhotos", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "profileVerified", ignore = true)
    @Mapping(target = "storeVerified", ignore = true)
    @Mapping(target = "bannedUntil", ignore = true)
    @Mapping(target = "banReason", ignore = true)
    @Mapping(target = "verificationRequestedAt", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "myidSessionId", ignore = true)
    User toUser(RegisterRequest request);
}
