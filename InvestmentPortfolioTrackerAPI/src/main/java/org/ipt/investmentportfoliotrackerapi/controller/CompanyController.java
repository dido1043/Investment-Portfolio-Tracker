package org.ipt.investmentportfoliotrackerapi.controller;

import lombok.AllArgsConstructor;
import org.ipt.investmentportfoliotrackerapi.data.dto.CompanyDto;
import org.ipt.investmentportfoliotrackerapi.service.CompanyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/company")
@AllArgsConstructor

public class CompanyController {
    private final CompanyService companyService;

    @GetMapping("/{id}")
    public ResponseEntity<CompanyDto> getCompany(@PathVariable Long id) {
        return ResponseEntity.ok(companyService.getCompanyById(id));
    }

    @PostMapping("/create")
    public ResponseEntity<CompanyDto> createCompany(@RequestBody CompanyDto companyDto) {
        return ResponseEntity.ok(companyService.addNewCompany(companyDto));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<CompanyDto> updateCompany(@PathVariable Long id, @RequestBody CompanyDto companyDto) {
        return ResponseEntity.ok(companyService.updateCompany(id, companyDto));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteCompany(@PathVariable Long id) {
        return ResponseEntity.ok(companyService.deleteCompany(id));
    }
}
