package com.bloodbank.controller;

import com.bloodbank.model.Stock;
import com.bloodbank.service.StockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/stock")
public class StockController {
    @Autowired
    private StockService stockService;

    @GetMapping
    public ResponseEntity<List<Stock>> getAllStocks() {
        return ResponseEntity.ok(stockService.getAllStocks());
    }

    @GetMapping("/{bloodGroup}")
    public ResponseEntity<Stock> getStockByBloodGroup(@PathVariable String bloodGroup) {
        return stockService.getStockByBloodGroup(bloodGroup)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{bloodGroup}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Stock> updateStock(@PathVariable String bloodGroup, @RequestBody Map<String, Integer> body) {
        Integer unit = body.get("unit");
        return ResponseEntity.ok(stockService.updateStock(bloodGroup, unit));
    }

    @PostMapping("/initialize")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> initializeBloodGroups() {
        stockService.initializeBloodGroups();
        return ResponseEntity.ok("Blood groups initialized");
    }
}

