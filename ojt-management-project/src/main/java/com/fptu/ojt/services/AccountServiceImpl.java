package com.fptu.ojt.services;

import com.fptu.ojt.common.exceptions.*;
import com.fptu.ojt.common.payload.request.AccountRequest;
import com.fptu.ojt.common.payload.request.ChangePasswordRequest;
import com.fptu.ojt.data.entities.Account;
import com.fptu.ojt.data.repositories.AccountRepository;
import com.fptu.ojt.data.repositories.MajorRepository;
import com.fptu.ojt.data.repositories.SemesterRepository;
import com.fptu.ojt.utils.JwtUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final MajorRepository majorRepository;
    private final SemesterRepository semesterRepository;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder encoder;

    public AccountServiceImpl(AccountRepository accountRepository,
                              MajorRepository majorRepository,
                              SemesterRepository semesterRepository, JwtUtils jwtUtils, PasswordEncoder encoder) {
        this.accountRepository = accountRepository;
        this.majorRepository = majorRepository;
        this.semesterRepository = semesterRepository;
        this.jwtUtils = jwtUtils;
        this.encoder = encoder;
    }

    @Override
    public Account getUserById(Long id) throws AccountIdNotExistedException {
        if (Boolean.FALSE.equals(accountRepository.existsById(id))) {
            throw new AccountIdNotExistedException();
        }
        Account account = accountRepository.getById(id);
        if (account.isDisabled() == true) {
            throw new AccountIdNotExistedException();
        }
        return account;
    }

    @Override
    public Page<Account> searchUser(Specification<Account> specification, Pageable pageable) {
        return accountRepository.findAll(specification, pageable);
    }

    @Override
    public Account updateUser(Long id, AccountRequest accountUpdateRequest, Long accountId)
            throws AccountIdNotExistedException, NotPermissionException {
        if (Boolean.FALSE.equals(accountRepository.existsById(id))) {
            throw new AccountIdNotExistedException();
        }
        Account accountUpdated = accountRepository.getById(id);
        Account accountCurrent = accountRepository.getById(accountId);
        // Update student
        if (accountUpdated.getStudent() != null && !accountUpdated.isDisabled()) { //account updated is student
            if ((accountCurrent.isAdmin())) {
                //admin update profile for student
                accountUpdated.setEmail(accountUpdateRequest.getEmail());
                accountUpdated.setName(accountUpdateRequest.getName());
                accountUpdated.setPhone(accountUpdateRequest.getPhone());
                accountUpdated.getStudent().setAddress(accountUpdateRequest.getAddress());
                accountUpdated.getStudent().setStudentCode(accountUpdateRequest.getStudentCode());
                accountUpdated.getStudent().setGpa(accountUpdateRequest.getGpa());
                accountUpdated.getStudent().setOjtStatus(accountUpdateRequest.getOjtStatus());
                accountUpdated.getStudent().setMajor(majorRepository.getById(accountUpdateRequest.getMajorId()));
                accountUpdated.getStudent().setSemester(semesterRepository.getById(accountUpdateRequest.getSemesterId()));
                accountRepository.save(accountUpdated);
            } else if ((accountCurrent.getStudent() != null && accountUpdated.equals(accountCurrent))) {
                //student update own profile
                accountUpdated.setAvatar(accountUpdateRequest.getAvatar());
                accountUpdated.setName(accountUpdateRequest.getName());
                accountUpdated.setPhone(accountUpdateRequest.getPhone());
                accountUpdated.getStudent().setAddress(accountUpdateRequest.getAddress());
                accountRepository.save(accountUpdated);
            } else {
                throw new NotPermissionException();
            }
            // Update Rep
        } else if (accountUpdated.getRepresentative() != null && !accountUpdated.isDisabled()) {
            if ((accountCurrent.isAdmin())) {
                //admin update profile for rep
                accountUpdated.setEmail(accountUpdateRequest.getEmail());
                accountUpdated.setAvatar(accountUpdateRequest.getAvatar());
                accountUpdated.setName(accountUpdateRequest.getName());
                accountUpdated.setPhone(accountUpdateRequest.getPhone());
                accountUpdated.getRepresentative().getCompany().setName(accountUpdateRequest.getCompanyName());
                accountUpdated.getRepresentative().getCompany().setAddress(accountUpdateRequest.getCompanyAddress());
                accountUpdated.getRepresentative().getCompany().setDescription(accountUpdateRequest.getDescription());
                accountRepository.save(accountUpdated);
            } else if ((accountCurrent.getRepresentative() != null && accountUpdated.equals(accountCurrent))) {
                //rep update own profile
                accountUpdated.setAvatar(accountUpdateRequest.getAvatar());
                accountUpdated.setPhone(accountUpdateRequest.getPhone());
                accountUpdated.getRepresentative().getCompany().setName(accountUpdateRequest.getCompanyName());
                accountRepository.save(accountUpdated);
            } else {
                throw new NotPermissionException();
            }
            // Update Admin
        } else {
            if (accountCurrent.isAdmin()) {
                accountUpdated.setEmail(accountUpdateRequest.getEmail());
                accountUpdated.setAvatar(accountUpdateRequest.getAvatar());
                accountUpdated.setName(accountUpdateRequest.getName());
                accountUpdated.setPhone(accountUpdateRequest.getPhone());
                accountRepository.save(accountUpdated);
            } else {
                throw new NotPermissionException();
            }
        }
        return accountUpdated;
    }


    @Override
    public Account updatePassword(Long id, ChangePasswordRequest changePasswordRequest, Long accountId)
            throws AccountIdNotExistedException, NotPermissionException, WrongPasswordException, SameOldPasswordException {
        if (Boolean.FALSE.equals(accountRepository.existsById(id))) {
            throw new AccountIdNotExistedException();
        }
        Account accountUpdated = accountRepository.getById(id);
        Account accountCurrent = accountRepository.getById(accountId);
        if (accountCurrent.isAdmin()) { //Admin update account password
            accountUpdated.setPassword(encoder.encode(changePasswordRequest.getNewPassword()));
            accountRepository.save(accountUpdated);
        } else {
            if (accountUpdated.equals(accountCurrent)) { //User update own
                //Check old password
                if(!encoder.matches(changePasswordRequest.getOldPassword(), accountUpdated.getPassword())) {
                    throw new WrongPasswordException();
                }
                if(encoder.matches(changePasswordRequest.getNewPassword(),accountUpdated.getPassword())) {
                    throw new SameOldPasswordException();
                }
                accountUpdated.setPassword(encoder.encode(changePasswordRequest.getNewPassword()));
                accountRepository.save(accountUpdated);
            } else {
                throw new NotPermissionException();
            }
        }

        return accountUpdated;
    }

    @Override
    public boolean deleteUser(Long id) throws AccountIdNotExistedException {
        if (Boolean.FALSE.equals(accountRepository.existsById(id))) {
            throw new AccountIdNotExistedException();
        } else {
            Account account = accountRepository.getById(id);
            if (account.isDisabled() == false) {
                account.setDisabled(true);
                accountRepository.save(account);
                return true;
            } else {
                throw new AccountIdNotExistedException();
            }
        }
    }

}
