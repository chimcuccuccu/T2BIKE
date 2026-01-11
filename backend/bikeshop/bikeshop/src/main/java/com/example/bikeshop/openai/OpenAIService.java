package com.example.bikeshop.openai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OpenAIService {

    @Value("${openai.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate;

    public OpenAIService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String askAI(String message) {
        String url = "https://api.openai.com/v1/chat/completions";

        // Body JSON
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-3.5-turbo");

        // messages array
        List<Map<String, String>> messages = List.of(
                Map.of("role", "system", "content", PromptConstants.SYSTEM_PROMPT),
                Map.of("role", "user", "content", message)
        );
        requestBody.put("messages", messages);

        // Headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                Map.class
        );

        // Lấy nội dung trả về
        Map<String, Object> body = response.getBody();
        if (body == null) return "Xin lỗi, không trả lời được";

        List<Map<String, Object>> choices = (List<Map<String, Object>>) body.get("choices");
        if (choices == null || choices.isEmpty()) return "Xin lỗi, không trả lời được";

        Map<String, Object> messageMap = (Map<String, Object>) choices.get(0).get("message");
        if (messageMap == null) return "Xin lỗi, không trả lời được";

        return (String) messageMap.get("content");
    }
}
