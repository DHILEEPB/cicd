package com.bloodbank.service;

import com.bloodbank.model.Stock;
import com.bloodbank.repository.StockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StockService {
    @Autowired
    private StockRepository stockRepository;

    public List<Stock> getAllStocks() {
        return stockRepository.findAll();
    }

    public Optional<Stock> getStockByBloodGroup(String bloodGroup) {
        return stockRepository.findByBloodGroup(bloodGroup);
    }

    public Stock updateStock(String bloodGroup, Integer unit) {
        Stock stock = stockRepository.findByBloodGroup(bloodGroup)
                .orElse(new Stock());
        stock.setBloodGroup(bloodGroup);
        stock.setUnit(unit);
        return stockRepository.save(stock);
    }

    public void initializeBloodGroups() {
        String[] bloodGroups = {"A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"};
        for (String bg : bloodGroups) {
            if (!stockRepository.findByBloodGroup(bg).isPresent()) {
                Stock stock = new Stock();
                stock.setBloodGroup(bg);
                stock.setUnit(0);
                stockRepository.save(stock);
            }
        }
    }
}

