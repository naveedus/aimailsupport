/**
 * Factory class responsible for creating instances of AI LLM providers based on the
 * provided configuration.
 */
import { GenericProvider } from './genericProvider'
import { ConfigType } from '../helpers/configType'

import { OllamaProvider } from './impl/ollamaProvider'

// Static map to associate the provider name with the corresponding class
const providerMap: Record<string, new (config: ConfigType) => GenericProvider> = {
    ollama: OllamaProvider,
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
