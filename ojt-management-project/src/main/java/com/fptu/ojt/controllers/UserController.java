package com.fptu.ojt.controllers;

import com.fptu.ojt.common.exceptions.AccountIdNotExistedException;
import com.fptu.ojt.common.exceptions.NotPermissionException;
import com.fptu.ojt.common.exceptions.SameOldPasswordException;
import com.fptu.ojt.common.exceptions.WrongPasswordException;
import com.fptu.ojt.common.payload.dto.UserDTO;
import com.fptu.ojt.common.payload.request.AccountRequest;
import com.fptu.ojt.common.payload.request.ChangePasswordRequest;
import com.fptu.ojt.configuration.security.services.UserDetailsImpl;
import com.fptu.ojt.mappers.UserMapper;
import com.fptu.ojt.services.AccountService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;


@RestController
@RequestMapping("/users")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    private final AccountService accountService;
    private final UserMapper userMapper;

    public UserController(AccountService accountService, UserMapper userMapper) {
        this.accountService = accountService;
        this.userMapper = userMapper;
    }

    @PreAuthorize("hasAnyAuthority('SYS_ADMIN')")
    @GetMapping("/{id}")
    public UserDTO getUserById(@PathVariable Long id)
            throws AccountIdNotExistedException {
        return userMapper.userToUserDTO(accountService.getUserById(id));
    }


    @PreAuthorize("hasAnyAuthority('STUDENT')")
    @GetMapping("/get-student-info")
    public UserDTO getStudentById(Authentication authentication)
            throws AccountIdNotExistedException {
        Long id = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        return userMapper.userToUserDTO(accountService.getUserById(id));
    }

    @PreAuthorize("hasAnyAuthority('COMPANY_REPRESENTATIVE','SYS_ADMIN', 'STUDENT')")
    @PutMapping("/{id}")
    public UserDTO updateUser(@PathVariable Long id,
                              @Valid @RequestBody AccountRequest accountUpdateRequest,
                              Authentication authentication)
            throws AccountIdNotExistedException, NotPermissionException {
        Long accountId = ((UserDetailsImpl) authentication.getPrincipal()). getId();
        return userMapper.userToUserDTO(accountService.updateUser(id, accountUpdateRequest, accountId));
    }

    @PreAuthorize("hasAnyAuthority('COMPANY_REPRESENTATIVE','SYS_ADMIN', 'STUDENT')")
    @PutMapping("/password/{id}")
    public UserDTO updatePasswordNew(@PathVariable Long id,
                                     @Valid @RequestBody ChangePasswordRequest changePasswordRequest,
                                     Authentication authentication)
            throws AccountIdNotExistedException, NotPermissionException, WrongPasswordException, SameOldPasswordException {
        Long accountId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        return userMapper.userToUserDTO(accountService.updatePassword(id,changePasswordRequest, accountId));
    }


}
