import { ConfigType } from '../src/ts/helpers/configType'
import { ProviderFactory } from '../src/ts/llmProviders/providerFactory'
import { OllamaProvider } from '../src/ts/llmProviders/impl/ollamaProvider'

import dotenv from 'dotenv'
import 'jest-webextension-mock'

// Dummy configuration:
const configs: ConfigType = {
    mainUserLanguageCode: 'en',
    translationLanguageCodes: [],
    llmProvider: null,
    temperature: 1,
    servicesTimeout: 30,
    debugMode: true,

    ollama: {
        serviceUrl: 'http://localhost:11434',
        model: 'granite3.2:latest'

    }
}

// Increase timeout for tests (value expressed in milliseconds)
jest.setTimeout(configs.servicesTimeout * 1000)

// Persists the configurations
browser.storage.sync.set(configs)

// Load environment variables from the .env file, see README.md for more information
dotenv.config()

// Added a little delay between calls to avoid hitting the rate limit on some LLM models
afterEach(() => new Promise(resolve => setTimeout(resolve, 3000)))

// OllamaProvider tests
describe('OllamaProvider', () => {
    configs.llmProvider = 'ollama'

    const provider = ProviderFactory.getInstance(configs)

    test('should be an instance of OllamaProvider', () => {
        expect(provider).toBeInstanceOf(OllamaProvider)
    })

    test('should be able to explain a text', async () => {
        const output = await provider.explainText('Example of text to explain')
        expect(typeof output).toBe('string')
    })

    test('should be able to rephrase a text', async () => {
        const output = await provider.rephraseText('Example of text to rephrase', 'shortened')
        expect(typeof output).toBe('string')
    })

    test('should be able to suggest how to improve a text', async () => {
        const output = await provider.suggestImprovementsForText('Example of text to improve')
        expect(typeof output).toBe('string')
    })

    test('should be able to review the patch',async() => {
	const output = await provider.reviewCodeDetailed('Example of code to review');
        expect(typeof output).toBe('string')
    })

    test('should be able to suggest a reply from text', async () => {
        const output = await provider.suggestReplyFromText('Example of text for which to request a suggestion for a reply', 'shortened')
        expect(typeof output).toBe('string')
    })

    test('should be able to summarize text', async () => {
        const output = await provider.summarizeText('Example of text to summarize')
        expect(typeof output).toBe('string')
    })

    test('should be able to translate text', async () => {
        // 'Esempio di testo da tradurre' is Italian for 'Example of text to translate'
        const output = await provider.translateText('Esempio di testo da tradurre')
        expect(typeof output).toBe('string')
    })
})

