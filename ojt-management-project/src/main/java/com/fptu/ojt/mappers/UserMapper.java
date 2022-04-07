package com.fptu.ojt.mappers;

import com.fptu.ojt.common.payload.dto.UserDTO;
import com.fptu.ojt.data.entities.Account;
import com.fptu.ojt.data.entities.Student;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;


@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(source = "account", target = "role", qualifiedByName = "role")
    @Mapping(source = "student", target = "student")
    @Mapping(source = "representative.company", target = "company")
    UserDTO userToUserDTO(Account account);

    @Named(("role"))
    default String convertRole(Account account) {
        String role;
        if (account.isAdmin()) {
            role = "SYS_ADMIN";
        } else if (account.getRepresentative() != null && account.getStudent() == null) {
            role = "COMPANY_REPRESENTATIVE";
        } else {
            role = "STUDENT";
        }
        return role;
    }
}

