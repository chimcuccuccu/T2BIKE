package com.example.bikeshop.service;

import com.example.bikeshop.openai.OpenAIService;
import org.springframework.stereotype.Service;

@Service
public class ChatBotService {

    private final RuleBasedService ruleService;
    private final ProductService productService;
    private final OpenAIService openAIService;

    public ChatBotService(
            RuleBasedService ruleService,
            ProductService productService,
            OpenAIService openAIService
    ) {
        this.ruleService = ruleService;
        this.productService = productService;
        this.openAIService = openAIService;
    }

    public String handleMessage(String message) {

        String ruleReply = ruleService.checkRule(message);
        if (ruleReply != null) return ruleReply;

        String productReply = productService.suggestProduct(message);
        if (productReply != null) return productReply;

        return openAIService.askAI(message);
    }
}
