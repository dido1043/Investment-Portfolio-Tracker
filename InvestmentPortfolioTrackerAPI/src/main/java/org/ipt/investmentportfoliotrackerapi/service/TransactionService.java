package org.ipt.investmentportfoliotrackerapi.service;

import lombok.AllArgsConstructor;
import org.ipt.investmentportfoliotrackerapi.data.dto.TransactionDto;
import org.ipt.investmentportfoliotrackerapi.data.model.Transaction;
import org.ipt.investmentportfoliotrackerapi.repository.AccountRepository;
import org.ipt.investmentportfoliotrackerapi.repository.CompanyRepository;
import org.ipt.investmentportfoliotrackerapi.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.modelmapper.ModelMapper;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final CompanyRepository companyRepository;
    private final ModelMapper mapper;

    public List<TransactionDto> getAllTransactionsByAccountId(Long accountId) {
        return transactionRepository.findAllByAccountId(accountId).stream()
                .map(t -> mapper.map(t, TransactionDto.class))
                .collect(Collectors.toList());
    }

    public TransactionDto getTransactionById(Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow();
        return mapper.map(transaction, TransactionDto.class);
    }

    public TransactionDto createTransaction(TransactionDto transactionDto) {
        Transaction transaction = mapper.map(transactionDto, Transaction.class);

        transaction.setAccount(accountRepository.findById(transactionDto.getAccountId()).orElseThrow());
        transaction.setCompany(companyRepository.findById(transactionDto.getCompanyId()).orElseThrow());
        transactionRepository.save(transaction);

        return mapper.map(transaction, TransactionDto.class);
    }

    public TransactionDto updateTransaction(Long id, TransactionDto transactionDto) {
        Transaction transaction = transactionRepository.findById(id).orElseThrow();

        transaction.setTransactionType(transactionDto.getTransactionType());
        transaction.setQuantity(transactionDto.getQuantity());
        transaction.setPricePerShare(transactionDto.getPricePerShare());
        transaction.setTransactionDate(transactionDto.getTransactionDate());
        transaction.setAccount(accountRepository.findById(transactionDto.getAccountId()).orElseThrow());
        transaction.setCompany(companyRepository.findById(transactionDto.getCompanyId()).orElseThrow());

        transactionRepository.save(transaction);

        return mapper.map(transaction, TransactionDto.class);
    }

    public String deleteTransaction(Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId).orElseThrow();
        transactionRepository.delete(transaction);

        return "Transaction with id: " + transactionId + " has been deleted";
    }
}
