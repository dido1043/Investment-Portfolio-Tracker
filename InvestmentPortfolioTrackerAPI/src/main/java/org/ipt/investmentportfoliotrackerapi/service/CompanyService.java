package org.ipt.investmentportfoliotrackerapi.service;

import lombok.AllArgsConstructor;
import org.ipt.investmentportfoliotrackerapi.data.dto.CompanyDto;
import org.ipt.investmentportfoliotrackerapi.data.model.Company;
import org.ipt.investmentportfoliotrackerapi.repository.CompanyRepository;
import org.springframework.stereotype.Service;
import org.modelmapper.ModelMapper;

@Service
@AllArgsConstructor
public class CompanyService {
    private final CompanyRepository companyRepository;
    private final ModelMapper mapper;

    public CompanyDto getCompanyById(Long companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow();
        return mapper.map(company, CompanyDto.class);
    }

    public CompanyDto createCompany(CompanyDto companyDto) {
        Company company = mapper.map(companyDto, Company.class);
        companyRepository.save(company);

        return mapper.map(company, CompanyDto.class);
    }

    public CompanyDto updateCompany(Long id, CompanyDto companyDto) {
        Company company = companyRepository.findById(id).orElseThrow();

        company.setCompanyName(companyDto.getCompanyName());
        company.setIndustrySector(companyDto.getIndustrySector());
        company.setTickerSymbol(companyDto.getTickerSymbol());

        companyRepository.save(company);

        return mapper.map(company, CompanyDto.class);
    }

    public String deleteCompany(Long companyId) {
        Company company = companyRepository.findById(companyId).orElseThrow();
        companyRepository.delete(company);

        return "Company with id: " + companyId + " has been deleted";
    }
}
