package org.ipt.investmentportfoliotrackerapi.repository;

import org.ipt.investmentportfoliotrackerapi.data.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends  JpaRepository<Transaction, Long> {

}
