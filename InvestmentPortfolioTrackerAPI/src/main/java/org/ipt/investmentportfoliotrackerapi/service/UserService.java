package org.ipt.investmentportfoliotrackerapi.service;

import lombok.AllArgsConstructor;
import org.ipt.investmentportfoliotrackerapi.data.dto.UserDto;
import org.ipt.investmentportfoliotrackerapi.data.model.User;
import org.ipt.investmentportfoliotrackerapi.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.modelmapper.ModelMapper;

@Service
@AllArgsConstructor

public class UserService {
    private final UserRepository userRepository;
    private final ModelMapper mapper;

    public UserDto getUserById(Long userId){
        User user = userRepository.findById(userId)
                .orElseThrow();
        return mapper.map(user, UserDto.class);
    }

    public UserDto updateUser(Long id, UserDto userDto) {
        User user = userRepository.findById(id).orElseThrow();

        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setEmail(userDto.getEmail());

        userRepository.save(user);

        return mapper.map(user, UserDto.class);
    }

    public String deleteUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        userRepository.delete(user);

        return "User with id: " + userId + " has been deleted";
    }

}
