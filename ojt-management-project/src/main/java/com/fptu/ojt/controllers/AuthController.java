package com.fptu.ojt.controllers;
import com.fptu.ojt.common.exceptions.*;
import com.fptu.ojt.common.payload.DataResponse;
import com.fptu.ojt.common.payload.JwtResponse;
import com.fptu.ojt.common.payload.TokenRefreshResponse;
import com.fptu.ojt.common.payload.dto.UserDTO;
import com.fptu.ojt.common.payload.request.AccountRequest;
import com.fptu.ojt.common.payload.request.LoginRequest;
import com.fptu.ojt.common.payload.request.TokenRefreshRequest;
import com.fptu.ojt.configuration.security.services.RefreshTokenService;
import com.fptu.ojt.configuration.security.services.UserDetailsImpl;
import com.fptu.ojt.data.entities.*;
import com.fptu.ojt.mappers.*;
import com.fptu.ojt.utils.JwtUtils;
import com.fptu.ojt.services.AccountService;
import com.fptu.ojt.data.repositories.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;

    private final AccountRepository accountRepository;

    private final CompanyRepository companyRepository;

    private final MajorRepository majorRepository;

    private final StudentRepository studentRepository;

    private final SemesterRepository semesterRepository;

    private final RepresentativeRepository representativeRepository;

    private final AccountService accountService;

    private final UserMapper userMapper;

    private final PasswordEncoder encoder;

    private final JwtUtils jwtUtils;

    private final RefreshTokenService refreshTokenService;


    public AuthController(AuthenticationManager authenticationManager, AccountRepository accountRepository, CompanyRepository companyRepository, MajorRepository majorRepository, StudentRepository studentRepository, SemesterRepository semesterRepository, RepresentativeRepository representativeRepository, AccountService accountService, UserMapper userMapper, PasswordEncoder encoder, JwtUtils jwtUtils, RefreshTokenService refreshTokenService) {
        this.authenticationManager = authenticationManager;
        this.accountRepository = accountRepository;
        this.companyRepository = companyRepository;
        this.majorRepository = majorRepository;
        this.studentRepository = studentRepository;
        this.semesterRepository = semesterRepository;
        this.representativeRepository = representativeRepository;
        this.accountService = accountService;
        this.userMapper = userMapper;
        this.encoder = encoder;
        this.jwtUtils = jwtUtils;
        this.refreshTokenService = refreshTokenService;
    }

    @PostMapping("/signin")
    public ResponseEntity<JwtResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) throws AccountIdNotExistedException, AccountIdNotExistedException {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        RefreshToken refreshToken = refreshTokenService.createRefreshToken(userDetails.getId());

        Account account = accountService.getUserById(userDetails.getId());
        UserDTO userInfo = userMapper.userToUserDTO(account);

        return ResponseEntity.ok(new JwtResponse(jwt,
                refreshToken.getToken(), userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles, userInfo));
    }

    @PostMapping("/signup")
    public ResponseEntity<DataResponse<Account>> registerUser(@Valid @RequestBody AccountRequest signUpRequest)
            throws UsernameAlreadyExistedException,
            EmailAlreadyExistedException,
            EmptyRoleException,
            MajorNotExistedException,
            SemesterNotExistedException {
        if (signUpRequest.getStudentCode() != null && Boolean.TRUE.equals(
                accountRepository.existsByStudent_StudentCode(signUpRequest.getStudentCode()))) {
            throw new UsernameAlreadyExistedException();
        }

        if (Boolean.TRUE.equals(accountRepository.existsByEmail(signUpRequest.getEmail()))) {
            throw new EmailAlreadyExistedException();
        }

        // Create new user's account
        Account account = new Account(signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()),
                signUpRequest.getName(),
                signUpRequest.getPhone(),
                signUpRequest.getAvatar()
        );
        account = accountRepository.save(account);
        String strRole = signUpRequest.getRole();

        if (strRole == null) {
            throw new EmptyRoleException();
        } else {
            switch (strRole) {
                case "SYS_ADMIN":
                    account.setAdmin(true);
                    break;
                case "COMPANY_REPRESENTATIVE":
                    Company company = new Company();
                    company.setName(signUpRequest.getCompanyName());
                    company.setDescription(signUpRequest.getDescription());
                    company.setAddress(signUpRequest.getCompanyAddress());
                    companyRepository.save(company);
                    Representative representative = new Representative();
                    representative.setCompany(company);
                    representative.setAccount(account);
                    representativeRepository.save(representative);
                    break;
                default:
                    if (!majorRepository.existsById(signUpRequest.getMajorId())) {
                        throw new MajorNotExistedException();
                    }
                    Major major = majorRepository.getById(signUpRequest.getMajorId());
                    if (!semesterRepository.existsById(signUpRequest.getSemesterId())) {
                        throw new SemesterNotExistedException();
                    }
                    Semester semester = semesterRepository.getById(signUpRequest.getSemesterId());
                    Student student = new Student();
                    student.setStudentCode(signUpRequest.getStudentCode());
                    student.setGpa(signUpRequest.getGpa());
                    student.setMajor(major);
                    student.setSemester(semester);
                    student.setAccount(account);
                    student.setAddress(signUpRequest.getAddress());
                    student.setOjtStatus(-1);
                    studentRepository.save(student);
                    break;
            }
        }
        account = accountRepository.save(account);
        return ResponseEntity.ok(new DataResponse<>("OK", "User registered successfully!", account));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@Valid @RequestBody TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        return refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getAccount)
                .map(account -> {
                    String token = jwtUtils.generateTokenFromUsername(account.getEmail());
                    return ResponseEntity.ok(new TokenRefreshResponse(token, requestRefreshToken));
                })
                .orElseThrow(() -> new TokenRefreshException(requestRefreshToken,
                        "Refresh token is not in database!"));
    }

//    @GetMapping("/error-example/{error}")
//    public ResponseEntity<Response> errorMethod(@PathVariable boolean error) throws CrudException {
//        if (error) {
//            throw new CrudException("My custom error", HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//        return ResponseEntity.ok(new Response("OK", "OK"));
//    }
}
