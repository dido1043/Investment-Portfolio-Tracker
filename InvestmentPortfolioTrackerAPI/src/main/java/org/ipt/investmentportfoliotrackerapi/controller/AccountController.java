package org.ipt.investmentportfoliotrackerapi.controller;

import lombok.AllArgsConstructor;
import org.ipt.investmentportfoliotrackerapi.data.dto.AccountDto;
import org.ipt.investmentportfoliotrackerapi.service.AccountService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/account")
@AllArgsConstructor
public class AccountController {
    private final AccountService accountService;

    @PostMapping("/create")
    public ResponseEntity<AccountDto> createAccount(AccountDto accountDto) {
        return ResponseEntity.ok(accountService.createAccount(accountDto));
    }
}
