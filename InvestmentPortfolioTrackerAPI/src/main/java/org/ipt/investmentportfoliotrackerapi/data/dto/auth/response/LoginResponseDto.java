package org.ipt.investmentportfoliotrackerapi.data.dto.auth.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponseDto {
    private String token;
    private long expiresIn;
    private Long userId;
    private String role;
}
