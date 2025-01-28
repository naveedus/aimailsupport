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

export class ProviderFactory {

    /**
     * Returns an instance of an AI LLM provider based on the provided configuration.
     *
     * @param config - The configuration object specifying the desired provider.
     *
     * @returns An instance of the specified AI LLM provider.
     */
    static getInstance(config: ConfigType): GenericProvider {
        switch(config.llmProvider) {
            case 'anthropic':
                return new AnthropicClaudeProvider(config)
            case 'deepseek':
                return new DeepseekProvider(config)
            case 'google':
                return new GoogleGeminiProvider(config)
            case 'groq':
                return new GroqProvider(config)
            case 'lms':
                return new LmsProvider(config)
            case 'ollama':
                return new OllamaProvider(config)
            case 'openai':
                return new OpenAiGptProvider(config)
            case 'xai':
                return new XaiGrokProvider(config)
            default:
                return new GenericProvider(config)
        }
    }
}