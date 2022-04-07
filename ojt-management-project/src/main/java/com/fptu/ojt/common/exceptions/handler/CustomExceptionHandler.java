package com.fptu.ojt.common.exceptions.handler;

import com.fptu.ojt.common.exceptions.EmailAlreadyExistedException;
import com.fptu.ojt.common.exceptions.EmptyRoleException;
import com.fptu.ojt.common.exceptions.UsernameAlreadyExistedException;
import com.fptu.ojt.common.exceptions.*;
import com.fptu.ojt.common.payload.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.Date;

@ControllerAdvice
public class CustomExceptionHandler extends ResponseEntityExceptionHandler {
    @ExceptionHandler(value = {
            EmailAlreadyExistedException.class,
            UsernameAlreadyExistedException.class,
            EmptyRoleException.class,
            MajorNotExistedException.class,
            MajorNameAlreadyExistedException.class,
            JobNotExistedException.class,
            JobNotAllowedUpdateException.class,
            CompanyNotExistedException.class,
            AccountIdNotExistedException.class,
            SemesterAlreadyExistedException.class,
            SemesterNotExistedException.class,
            SemesterDisabledException.class,
            ApplicationNotExistedException.class,
            ApplicationDenied.class,
            EvaluationIdNotExistedException.class,
            NotPermissionException.class,
            WrongPasswordException.class,
            SameOldPasswordException.class,
            AlreadyConfirmACompanyException.class,
            StudentHaveOJTException.class,
            AlreadyHaveApplicationInThisJobException.class,
            AlreadyOfferInThisJobException.class
    })
    protected ResponseEntity<Response> handleAuthExceptions(CrudException exception) {
        return ResponseEntity
                .status(exception.getStatus())
                .body(new Response("Error", exception.getMessage()));
    }

    @ExceptionHandler(value = TokenRefreshException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ErrorMessage handleTokenRefreshException(TokenRefreshException ex, WebRequest request) {
        return new ErrorMessage(
                HttpStatus.FORBIDDEN.value(),
                new Date(),
                ex.getMessage(),
                request.getDescription(false));
    }
}
