/**
 * Factory class responsible for creating instances of AI LLM providers based on the
 * provided configuration.
 */
import { GenericProvider } from './GenericProvider'
import { ConfigType } from '../ConfigType'
import { AnthropicClaudeProvider } from './impl/AnthropicClaudeProvider'
import { GoogleGeminiProvider } from './impl/GoogleGeminiProvider'
import { OpenAiGptProvider } from './impl/OpenAiGptProvider'


export class ProviderFactory {

    /**
     * Returns an instance of an AI LLM provider based on the provided configuration.
     *
     * @param config The configuration object specifying the desired provider.
     * @returns An instance of the specified AI LLM provider.
     */
    static getInstance(config: ConfigType): GenericProvider {
        switch(config.llmProvider) {
            case 'anthropic':
                return new AnthropicClaudeProvider(config)
            case 'google':
                return new GoogleGeminiProvider(config)
            case 'openai':
                return new OpenAiGptProvider(config)
            default:
                return new GenericProvider(config)
        }
    }
}