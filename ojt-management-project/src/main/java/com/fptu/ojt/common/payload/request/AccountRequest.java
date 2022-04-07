package com.fptu.ojt.common.payload.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.*;
import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_DEFAULT)
public class AccountRequest implements Serializable {
    @Email(message = "Email is not valid")
    @NotNull
    @Size(max = 320)
    private String email;

    @NotNull
    @Size(min = 8, max = 1024)
    private String password;

    @Size(max = 2048)
    private String avatar;

    @NotNull
    @NotBlank
    @Size(max = 255)
    private String name;

    @NotNull
    @NotBlank
    private String role;

    @NotNull
    @Size(min = 11, max = 13)
    private String phone;

    /**
     * Start of company Section
     **/
    @NotNull
    @NotBlank
    @Size(max = 255)
    private String companyName;

    @NotNull
    @NotBlank
    @Size(max = 2000)
    private String description;

    @Size(max = 500)
    private String companyAddress;
    /**
     * End of company Section
     **/

    /**
     * Start of student Section
     **/
    @Size(max = 500)
    private String address;

    @Size(max = 10)
    @NotBlank
    @NotNull
    private String studentCode;

    @NotNull
    @Min(value = 0, message = "GPA must be more than 0")
    @Max(value = 10, message = "GPA must be less than 10")
    private double gpa;

    @NotNull
    @Min(value = -1)
    @Max(value = 2)
    private int ojtStatus;

    private Long majorId;

    private Long semesterId;

    /**
     * End of student Section
     **/

    // Constructor or admin creation
    public AccountRequest(String email, String password, String name, String role, String phone, String avatar) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.role = role;
        this.phone = phone;
        this.avatar = avatar;
    }

    // constructor for representative
    public AccountRequest(String email, String password, String name, String role, String companyName, String description, String companyAddress, String phone, String avatar) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.role = role;
        this.companyName = companyName;
        this.description = description;
        this.companyAddress = companyAddress;
        this.phone = phone;
        this.avatar = avatar;
    }

    // constructor for student
    public AccountRequest(String email, String password, String name, String role, String phone, String address, String studentCode, Long majorId, Long semesterId, String avatar) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.role = role;
        this.phone = phone;
        this.address = address;
        this.studentCode = studentCode;
        this.majorId = majorId;
        this.semesterId = semesterId;
        this.avatar = avatar;

    }

    /**
     * Start of Update Section
     **/
    //constructor for admin update student
    public AccountRequest(String email, String name, String phone, String address, String studentCode, double gpa, int ojtStatus, Long majorId, Long semesterId) {
        this.email = email;
        this.name = name;
        this.phone = phone;
        this.address = address;
        this.studentCode = studentCode;
        this.gpa = gpa;
        this.ojtStatus = ojtStatus;
        this.majorId = majorId;
        this.semesterId = semesterId;
    }

    //constructor for admin update rep and student
    public AccountRequest(String email, String password, String name, String phone, String avatar) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.phone = phone;
        this.avatar = avatar;

    }

    public AccountRequest(String email, String name, String phone, String avatar) {
        this.email = email;
        this.name = name;
        this.phone = phone;
        this.avatar = avatar;

    }

    /**
     * End of Update Section
     **/
}
