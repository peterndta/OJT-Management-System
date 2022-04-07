package com.fptu.ojt.services;


import com.fptu.ojt.common.exceptions.*;
import com.fptu.ojt.common.payload.request.AccountRequest;
import com.fptu.ojt.common.payload.request.ChangePasswordRequest;
import com.fptu.ojt.data.entities.Account;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;


public interface AccountService {
    Account getUserById(Long id) throws AccountIdNotExistedException;

    Page<Account> searchUser(Specification<Account> specification, Pageable pageable);

    Account updateUser(Long id, AccountRequest accountUpdateRequest, Long accountId) throws AccountIdNotExistedException, NotPermissionException;

    Account updatePassword(Long id, ChangePasswordRequest changePasswordRequest, Long accountId) throws AccountIdNotExistedException, NotPermissionException, WrongPasswordException, SameOldPasswordException;

    boolean deleteUser(Long id) throws AccountIdNotExistedException;


}
