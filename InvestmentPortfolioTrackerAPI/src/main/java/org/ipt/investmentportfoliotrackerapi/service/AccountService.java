package org.ipt.investmentportfoliotrackerapi.service;

import lombok.AllArgsConstructor;
import org.ipt.investmentportfoliotrackerapi.data.dto.AccountDto;
import org.ipt.investmentportfoliotrackerapi.data.model.Account;
import org.ipt.investmentportfoliotrackerapi.repository.AccountRepository;
import org.ipt.investmentportfoliotrackerapi.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final ModelMapper mapper;


    public AccountDto createAccount(AccountDto accountDto) {
        Account account = mapper.map(accountDto, Account.class);
        account.setUser(userRepository.findById(accountDto.getUserId()).orElseThrow());
        accountRepository.save(account);

        return mapper.map(account, AccountDto.class);
    }

}
