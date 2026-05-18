package org.ipt.investmentportfoliotrackerapi.data.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.ipt.investmentportfoliotrackerapi.data.enums.TransactionType;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
public class TransactionDto {
    private Long Id;
    private TransactionType transactionType;
    private Integer quantity;
    private BigDecimal pricePerShare;
    private LocalDate transactionDate;
    private Long accountId;
    private Long companyId;
}
