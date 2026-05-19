package org.ipt.investmentportfoliotrackerapi.data.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CompanyDto {

    private Long id;
    private String companyName;
    private String industrySector;
    private String tickerSymbol;
}
