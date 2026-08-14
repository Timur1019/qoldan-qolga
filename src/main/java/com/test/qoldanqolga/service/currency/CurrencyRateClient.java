package com.test.qoldanqolga.service.currency;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.test.qoldanqolga.config.CurrencyProperties;
import com.test.qoldanqolga.dto.currency.CurrencyRateDto;
import com.test.qoldanqolga.util.LogUtil;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

@Component
public class CurrencyRateClient {

    private final CurrencyProperties currencyProperties;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    public CurrencyRateClient(CurrencyProperties currencyProperties) {
        this.currencyProperties = currencyProperties;
        this.objectMapper = new ObjectMapper();
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(5))
                .build();
    }

    public CurrencyRateDto fetchUsdToUzs() {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(currencyProperties.getCbuJsonUrl()))
                    .timeout(Duration.ofSeconds(8))
                    .GET()
                    .build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                Double rate = parseUsdRate(response.body());
                if (rate != null && rate > 0) {
                    LogUtil.info(CurrencyRateClient.class, "CBU USD rate loaded: {}", rate);
                    return CurrencyRateDto.builder().usdToUzs(rate).source("CBU").build();
                }
            }
            LogUtil.warn(CurrencyRateClient.class, "CBU rate unavailable, status={}", response.statusCode());
        } catch (Exception e) {
            LogUtil.warn(CurrencyRateClient.class, "CBU rate fetch failed: {}", e.getMessage());
        }
        return null;
    }

    private Double parseUsdRate(String body) {
        try {
            JsonNode root = objectMapper.readTree(body);
            if (!root.isArray()) {
                return null;
            }
            for (JsonNode node : root) {
                if ("USD".equalsIgnoreCase(node.path("Ccy").asText(""))) {
                    return Double.parseDouble(node.path("Rate").asText("").replace(',', '.'));
                }
            }
        } catch (Exception e) {
            LogUtil.warn(CurrencyRateClient.class, "CBU JSON parse error: {}", e.getMessage());
        }
        return null;
    }
}
