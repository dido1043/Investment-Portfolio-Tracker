package org.ipt.investmentportfoliotrackerapi.repository;

import org.ipt.investmentportfoliotrackerapi.data.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends  JpaRepository<Transaction, Long> {
    List<Transaction> findAllByAccountId(Long accountId);
}
