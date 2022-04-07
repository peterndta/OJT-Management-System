package com.fptu.ojt.configuration.security.services;

import com.fptu.ojt.common.exceptions.TokenRefreshException;
import com.fptu.ojt.data.entities.RefreshToken;
import com.fptu.ojt.data.repositories.AccountRepository;
import com.fptu.ojt.data.repositories.RefreshTokenRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;



@Service
public class RefreshTokenService {
    private final RefreshTokenRepository refreshTokenRepository;
    private final AccountRepository accountRepository;
    public static final int JWT_REFRESH_EXPIRATION_MS = 86400000;
    private final int refreshTokenDurationMs = JWT_REFRESH_EXPIRATION_MS;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository, AccountRepository accountRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.accountRepository = accountRepository;
    }

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    public RefreshToken createRefreshToken(Long accountId) {
        RefreshToken refreshToken = new RefreshToken();

        refreshToken.setAccount(accountRepository.findById(accountId).get());
        refreshToken.setExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));
        refreshToken.setToken(UUID.randomUUID().toString());

        refreshToken = refreshTokenRepository.save(refreshToken);
        return refreshToken;
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException(token.getToken(), "Refresh token was expired. Please make a new signin request");
        }

        return token;
    }

//    @Transactional
//    public int deleteByUserId(Long accountId) {
//        return refreshTokenRepository.deleteByAccount(accountRepository.findById(accountId).get());
//    }
}