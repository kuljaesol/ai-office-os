import { InferenceAdapter, CompletionRequest, CompletionResponse } from '@agent-office/core';

export class OpenAICompatibleAdapter implements InferenceAdapter {
    public readonly isLocal = false;

    constructor(
        private baseUrl: string,
        private apiKey: string,
        public readonly provider: string = 'openai'
    ) { }

    async complete(request: CompletionRequest): Promise<CompletionResponse> {
        const start = Date.now();

        // Map tools only if explicitly provided (native function-calling)
        const tools = request.tools ? request.tools.map(t => ({
            type: "function",
            function: {
                name: t.name,
                description: t.description,
                parameters: t.parameters
            }
        })) : undefined;

        // Clean OpenAI chat-completions payload — only standard fields.
        // NOTE: response_format is intentionally omitted. Some LM Studio / gemma
        // builds return HTTP 400 on it. JSON output is enforced via the prompt instead.
        const body: any = {
            model: request.model,
            messages: request.messages,
            temperature: request.temperature ?? 0.7
        };
        if (request.maxTokens) body.max_tokens = request.maxTokens;
        if (tools) body.tools = tools;

        const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errBody = await response.text().catch(() => '');
            console.error(
                `[LMStudio] HTTP ${response.status} ${response.statusText}\n` +
                `  sent : ${JSON.stringify(body).slice(0, 600)}\n` +
                `  error: ${errBody.slice(0, 600)}`
            );
            throw new Error(`LM Studio ${response.status}: ${errBody || response.statusText}`);
        }

        const data = await response.json();
        const latency = Date.now() - start;
        const message = data.choices[0].message;

        let toolCalls;
        if (message.tool_calls) {
            toolCalls = message.tool_calls.map((tc: any) => ({
                name: tc.function.name,
                params: JSON.parse(tc.function.arguments)
            }));
        }

        return {
            content: message.content || '',
            toolCalls,
            usage: {
                prompt: data.usage?.prompt_tokens || 0,
                completion: data.usage?.completion_tokens || 0
            },
            latency
        };
    }
}
