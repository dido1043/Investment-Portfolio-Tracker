package org.ipt.investmentportfoliotrackerapi.data.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "companies")
@Data
@NoArgsConstructor
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ticker_symbol", nullable = false, unique = true)
    private String tickerSymbol;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "industry_sector")
    private String industrySector;
}