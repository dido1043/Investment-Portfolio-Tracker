package org.ipt.investmentportfoliotrackerapi.service.auth;

import lombok.AllArgsConstructor;
import org.ipt.investmentportfoliotrackerapi.data.dto.UserDto;
import org.ipt.investmentportfoliotrackerapi.data.dto.auth.request.LoginRequestDto;
import org.ipt.investmentportfoliotrackerapi.data.dto.auth.response.LoginResponseDto;
import org.ipt.investmentportfoliotrackerapi.data.enums.AuthenticationType;
import org.ipt.investmentportfoliotrackerapi.data.model.User;
import org.ipt.investmentportfoliotrackerapi.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;
    private final AuthenticationManager authenticationManager;


    public UserDto registerUser(UserDto userDto) {
        User usr = modelMapper.map(userDto, User.class);
        usr.setPassword(passwordEncoder.encode(userDto.getPassword()));
        usr.setAuthenticationType(AuthenticationType.EMAIL);
        return modelMapper.map(userRepository.save(usr), UserDto.class);
    }

    public UserDto authenticateUser(LoginRequestDto loginRequestDto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequestDto.getEmail(),
                        loginRequestDto.getPassword()
                )
        );
        return modelMapper.map(
                userRepository.findByEmail(loginRequestDto.getEmail()).orElseThrow(),
                UserDto.class
        );
    }
}
