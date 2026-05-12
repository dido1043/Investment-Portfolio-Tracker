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

    public AccountDto getAccountById(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow();
        return mapper.map(account, AccountDto.class);
    }

    public AccountDto createAccount(AccountDto accountDto) {
        Account account = mapper.map(accountDto, Account.class);
        account.setUser(userRepository.findById(accountDto.getUserId()).orElseThrow());
        accountRepository.save(account);

        return mapper.map(account, AccountDto.class);
    }

    public AccountDto updateAccount(Long id, AccountDto accountDto) {

        Account account = accountRepository.findById(id).orElseThrow();

        account.setCurrency(accountDto.getCurrency());
        account.setAccountNumber(accountDto.getAccountNumber());
        account.setUser(userRepository.findById(accountDto.getUserId()).orElseThrow());
        accountRepository.save(account);
        return mapper.map(account, AccountDto.class);
    }

    public String deleteAccount(Long accountId) {
        Account account = accountRepository.findById(accountId).orElseThrow();
        accountRepository.delete(account);
        return "Account with id: " + accountId + " has been deleted";
    }
}
