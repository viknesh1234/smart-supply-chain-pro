package com.inventory.inventory_system.controller;

import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/forecast")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ForecastController {

    // 🔮 Demand Forecast Endpoint
    @GetMapping("/demand")
    public List<Map<String, Object>> getForecastData(
            @RequestParam(required = false) String product,
            @RequestParam(required = false) String period) {

        List<Map<String, Object>> forecastList = new ArrayList<>();
        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"};
        int[] actual = {1200, 1150, 1300, 1250, 1400, 1350, 1500, 1550};
        int[] predicted = {1180, 1170, 1350, 1280, 1450, 1370, 1550, 1580};

        for (int i = 0; i < months.length; i++) {
            Map<String, Object> point = new HashMap<>();
            point.put("month", months[i]);
            point.put("actual", actual[i]);
            point.put("predicted", predicted[i]);
            forecastList.add(point);
        }

        return forecastList;
    }

    // 📊 Forecast Model Accuracy
    @GetMapping("/accuracy")
    public List<Map<String, Object>> getForecastAccuracy() {
        return List.of(
                Map.of("model", "Prophet", "accuracy", 94.2, "mae", 45.3),
                Map.of("model", "LSTM", "accuracy", 92.8, "mae", 52.1),
                Map.of("model", "ARIMA", "accuracy", 89.5, "mae", 68.9),
                Map.of("model", "Linear Reg", "accuracy", 85.3, "mae", 78.2)
        );
    }

    // 🔁 Stock Turnover Metric
    @GetMapping("/stock-turnover")
    public Map<String, String> getStockTurnover() {
        return Map.of("turnover", "12.4x", "change", "+0.8x from last month");
    }

    // 🌤️ Seasonal Factors & External Events
    @GetMapping("/seasonal-factors")
    public List<Map<String, String>> getSeasonalFactors() {
        return List.of(
                Map.of("factor", "Black Friday", "impact", "+45%", "period", "Nov 24-27"),
                Map.of("factor", "Holiday Season", "impact", "+30%", "period", "Dec 1-31"),
                Map.of("factor", "Back to School", "impact", "+25%", "period", "Aug 15-Sep 15"),
                Map.of("factor", "Summer Sale", "impact", "+20%", "period", "Jun 1-30")
        );
    }
}
