package com.research.assistant;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;
@Service
public class ResearchService {
    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final WebClient webClient;

    private final ObjectMapper objectMapper;

    public ResearchService(WebClient.Builder webClientBuilder , ObjectMapper object) {
        this.webClient = webClientBuilder.build();
        this.objectMapper = object;
    }

    public String processContent(ResearchRequest request){
        String prompt = buildPrompt(request);

        Map<String , Object> requestBody = Map.of(
                "contents", new Object[]{
                        Map.of(
                                "parts", new Object[]{
                                        Map.of("text" , prompt)
                                }
                        )
                }
        );
        String response = webClient.post().uri(geminiApiUrl+geminiApiKey).bodyValue(requestBody).retrieve().bodyToMono(String.class).block();
        return extractTextFromResponse(response);
    }

    private String extractTextFromResponse(String response) {
        try {
            GeminiResponse geminiResponse = objectMapper.readValue(response, GeminiResponse.class);
            if (geminiResponse.getCandidates() != null && !geminiResponse.getCandidates().isEmpty()) {
                GeminiResponse.Candidate firstcandidate =  geminiResponse.getCandidates().get(0);
                if(firstcandidate.getContent() != null && firstcandidate.getContent().getParts() != null && !firstcandidate.getContent().getParts().isEmpty()){
                    return firstcandidate.getContent().getParts().get(0).getText();
                }
            }
            return "not content is found";
        }
        catch(Exception e){
                return "Error Parsing: " + e.getMessage();
            }
        }
    private String buildPrompt(ResearchRequest request){
        StringBuilder prompt = new StringBuilder();
        switch(request.getOperation()){
            case "summarize":
                prompt.append("Summarize the following text in three to five clear, concise, and complete bullet points. Ensure each bullet point represents a distinct, high-level idea from the text. Format the output using Markdown, and use bolding for the main topic of each bullet point to enhance readability.\n\n");
                break;
            case "suggest":
                prompt.append("Based on the following content : Suggest related topics and further reading. Format the response with clear headings and bullet points : \n\n");
                break;
            default:
                throw new IllegalArgumentException("unknown operation:"+request.getOperation());
        }
        prompt.append(request.getContent());
        return prompt.toString();
    }

}
