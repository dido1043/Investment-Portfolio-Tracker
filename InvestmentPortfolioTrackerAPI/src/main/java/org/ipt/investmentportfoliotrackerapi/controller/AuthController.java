package org.ipt.investmentportfoliotrackerapi.controller;

import lombok.AllArgsConstructor;
import org.ipt.investmentportfoliotrackerapi.data.dto.UserDto;
import org.ipt.investmentportfoliotrackerapi.data.dto.auth.request.LoginRequestDto;
import org.ipt.investmentportfoliotrackerapi.data.dto.auth.response.LoginResponseDto;
import org.ipt.investmentportfoliotrackerapi.service.auth.AuthService;
import org.ipt.investmentportfoliotrackerapi.service.auth.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@RequestBody UserDto user) {
        return ResponseEntity.status(201).body(authService.registerUser(user));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto loginRequestDto) {
        UserDto authenticatedUser = authService.authenticateUser(loginRequestDto);

        String jwtToken = jwtService.generateToken(
                userDetailsService.loadUserByUsername(authenticatedUser.getEmail())
        );

        LoginResponseDto loginResponse = new LoginResponseDto();
        loginResponse.setToken(jwtToken);
        loginResponse.setExpiresIn(jwtService.getExpirationTime());
        loginResponse.setUserId(authenticatedUser.getId());

        return ResponseEntity.ok(loginResponse);
    }
}
