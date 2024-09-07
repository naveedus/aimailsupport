/**
 * Factory class responsible for creating instances of AI LLM providers based on the
 * provided configuration.
 */
import { GenericProvider } from './genericProvider'
import { ConfigType } from '../helpers/configType'
import { AnthropicClaudeProvider } from './impl/anthropicClaudeProvider'
import { GoogleGeminiProvider } from './impl/googleGeminiProvider'
import { OpenAiGptProvider } from './impl/openAiGptProvider'


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
            case 'google':
                return new GoogleGeminiProvider(config)
            case 'openai':
                return new OpenAiGptProvider(config)
            default:
                return new GenericProvider(config)
        }
    }
}