package org.ipt.investmentportfoliotrackerapi.data.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AccountDto  {

    private Long id;
    private String accountNumber;
    private String currency;
    private Long userId;
}
