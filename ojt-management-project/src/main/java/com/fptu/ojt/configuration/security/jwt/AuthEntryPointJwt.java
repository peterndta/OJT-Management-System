package com.fptu.ojt.configuration.security.jwt;

import com.google.gson.Gson;
import lombok.Getter;
import lombok.Setter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.Serializable;
import java.time.Instant;

@Component
public class AuthEntryPointJwt implements AuthenticationEntryPoint {

    private static final Logger logger = LoggerFactory.getLogger(AuthEntryPointJwt.class);

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException {
        logger.error("Unauthorized error: {}", authException.getMessage());
        String errorMessage = (String) request.getAttribute("AuthenticationError");
        Gson gson = new Gson();
        request.removeAttribute("AuthenticationError");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(gson.toJson(new AuthorizedErrorResponse(
                Instant.now().toString(),
                HttpServletResponse.SC_UNAUTHORIZED,
                "Unauthorized",
                errorMessage,
                request.getRequestURI())));
    }

    @Getter
    @Setter
    public static class AuthorizedErrorResponse implements Serializable {
        private String timestamp;
        private int status;
        private String error;
        private String message;
        private String path;

        public AuthorizedErrorResponse(String timestamp, int status, String error, String message, String path) {
            this.timestamp = timestamp;
            this.status = status;
            this.error = error;
            this.message = message;
            this.path = path;
        }
    }
}
