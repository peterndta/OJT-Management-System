package com.fptu.ojt.common.enums;

public enum RoleEnum {
    SYS_ADMIN("SYS_ADMIN"),
    STUDENT("STUDENT"),
    COMPANY_REPRESENTATIVE("COMPANY_REPRESENTATIVE");

    private final String name;

    private RoleEnum(String s) {
        name = s;
    }

    public boolean equalsName(String otherName) {
        // (otherName == null) check is not needed because name.equals(null) returns false
        return name.equals(otherName);
    }

    @Override
    public String toString() {
        return this.name;
    }
}
