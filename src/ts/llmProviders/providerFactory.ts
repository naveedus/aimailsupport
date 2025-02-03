/**
 * Factory class responsible for creating instances of AI LLM providers based on the
 * provided configuration.
 */
import { GenericProvider } from './genericProvider'
import { ConfigType } from '../helpers/configType'

import { AnthropicClaudeProvider } from './impl/anthropicClaudeProvider'
import { DeepseekProvider } from './impl/deepseekProvider'
import { GoogleGeminiProvider } from './impl/googleGeminiProvider'
import { GroqProvider } from './impl/groqProvider'
import { LmsProvider } from './impl/lmsProvider'
import { OllamaProvider } from './impl/ollamaProvider'
import { OpenAiGptProvider } from './impl/openAiGptProvider'
import { XaiGrokProvider } from './impl/xaiGrokProvider'

// Static map to associate the provider name with the corresponding class
const providerMap: Record<string, new (config: ConfigType) => GenericProvider> = {
    anthropic: AnthropicClaudeProvider,
    deepseek: DeepseekProvider,
    google: GoogleGeminiProvider,
    groq: GroqProvider,
    lms: LmsProvider,
    ollama: OllamaProvider,
    openai: OpenAiGptProvider,
    xai: XaiGrokProvider
}

export class ProviderFactory {

    /**
     * Returns an instance of an AI LLM provider based on the provided configuration.
     *
     * @param config - The configuration object specifying the desired provider.
     *
     * @returns An instance of the specified AI LLM provider.
     */
    static getInstance(config: ConfigType): GenericProvider {
        const ProviderClass = providerMap[config.llmProvider] || GenericProvider
        return new ProviderClass(config)
    }
}