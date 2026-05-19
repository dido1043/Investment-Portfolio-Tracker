package org.ipt.investmentportfoliotrackerapi.repository;

import org.ipt.investmentportfoliotrackerapi.data.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    //Optional<User> findByAccountId(Long accountId);
}
