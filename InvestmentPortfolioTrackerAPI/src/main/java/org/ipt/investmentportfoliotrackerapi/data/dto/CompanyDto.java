package org.ipt.investmentportfoliotrackerapi.data.dto;

import jakarta.persistence.Column;
import lombok.Data;

@Data
public class CompanyDto {
    private String tickerSymbol;
    private String companyName;
    private String industrySector;
}
