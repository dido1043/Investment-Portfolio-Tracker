package org.ipt.investmentportfoliotrackerapi.repository;

import org.ipt.investmentportfoliotrackerapi.data.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findByTickerSymbolAndCompanyName(String tickerSymbol, String companyName);
    Optional<Company> findById(Long id);
}
