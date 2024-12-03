import { ConfigType } from '../src/ts/helpers/configType'
import { ProviderFactory } from '../src/ts/llmProviders/providerFactory'
import { AnthropicClaudeProvider } from '../src/ts/llmProviders/impl/anthropicClaudeProvider'
import { GoogleGeminiProvider } from '../src/ts/llmProviders/impl/googleGeminiProvider'
import { GroqProvider } from '../src/ts/llmProviders/impl/groqProvider'
import { OllamaProvider } from '../src/ts/llmProviders/impl/ollamaProvider'
import { OpenAiGptProvider } from '../src/ts/llmProviders/impl/openAiGptProvider'
import { XaiGrokProvider } from '../src/ts/llmProviders/impl/xaiGrokProvider'

import dotenv from 'dotenv'
import 'jest-webextension-mock'

// Dummy configuration:
const configs: ConfigType = {
    mainUserLanguageCode: 'English',
    llmProvider: null,
    temperature: 1,
    servicesTimeout: 25,
    debugMode: true,

    anthropic: {
        apiKey: null,
        model: 'claude-3-haiku-20240307'
    },

    google: {
        apiKey: null,
        model: 'gemini-1.5-flash-8b'
    },

    groq: {
        apiKey: null,
        model: 'llama-3.2-3b-preview'
    },

    ollama: {
        serviceUrl: 'http://localhost:11434',
        model: 'llama3.2:1b'
    },

    openai: {
        apiKey: null,
        organizationId: null,
        model: 'gpt-4o-mini',

        text2speech: {
            audioQuality: 'tts-1',
            voice: 'onyx',
            speed: 1
        }
    },

    xai: {
        apiKey: null
    }
}

// Persists the configurations
browser.storage.sync.set(configs)

// Load environment variables from the .env file, see README.md for more information
dotenv.config()

// Added a little delay between calls to avoid hitting the rate limit on some LLM models
afterEach(() => new Promise(resolve => setTimeout(resolve, 3000)))

// AnthropicClaudeProvider tests
describe('AnthropicClaudeProvider', () => {
    configs.llmProvider = 'anthropic'
    configs.anthropic.apiKey = process.env.anthropic_api_key

    const provider = ProviderFactory.getInstance(configs)

    test('should be an instance of AnthropicClaudeProvider', () => {
        expect(provider).toBeInstanceOf(AnthropicClaudeProvider)
    })

    test('should be able to rephrase a text', async () => {
        const output = await provider.rephraseText('Example of text to rephrase', 'shortened')
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

// GoogleGeminiProvider tests
describe('GoogleGeminiProvider', () => {
    configs.llmProvider = 'google'
    configs.google.apiKey = process.env.google_api_key

    const provider = ProviderFactory.getInstance(configs)

    test('should be an instance of GoogleGeminiProvider', () => {
        expect(provider).toBeInstanceOf(GoogleGeminiProvider)
    })

    test('should be able to rephrase a text', async () => {
        const output = await provider.rephraseText('Example of text to rephrase', 'shortened')
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

// GroqProvider tests
describe('GroqProvider', () => {
    configs.llmProvider = 'groq'
    configs.groq.apiKey = process.env.groq_api_key

    const provider = ProviderFactory.getInstance(configs)

    test('should be an instance of GroqProvider', () => {
        expect(provider).toBeInstanceOf(GroqProvider)
    })

    test('should be able to rephrase a text', async () => {
        const output = await provider.rephraseText('Example of text to rephrase', 'shortened')
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

// OllamaProvider tests
describe('OllamaProvider', () => {
    configs.llmProvider = 'ollama'
    configs.google.apiKey = process.env.google_api_key

    const provider = ProviderFactory.getInstance(configs)

    test('should be an instance of OllamaProvider', () => {
        expect(provider).toBeInstanceOf(OllamaProvider)
    })

    test('should be able to rephrase a text', async () => {
        const output = await provider.rephraseText('Example of text to rephrase', 'shortened')
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

// OpenAiGptProvider tests
describe('OpenAiGptProvider', () => {
    configs.llmProvider = 'openai'
    configs.openai.apiKey = process.env.openai_api_key

    const provider = ProviderFactory.getInstance(configs)

    test('should be an instance of OpenAiGptProvider', () => {
        expect(provider).toBeInstanceOf(OpenAiGptProvider)
    })

    test('should be able to modate text', async () => {
        const output = await provider.moderateText('Example of text to moderate')

        // Verify that the output is an object
        expect(typeof output).toBe('object')
        expect(output).not.toBeNull()

        // Verify that each key is a string and each value is a number
        Object.entries(output).forEach(([key, value]) => {
            expect(typeof key).toBe('string')
            expect(typeof value).toBe('number')
        })
    })

    test('should be able to generate audio from text', async () => {
        const output = await provider.getSpeechFromText('Example of text to speach')
        expect(output).toBeInstanceOf(Blob)
        expect(output.type).toBe('audio/mpeg')
    })

    test('should be able to rephrase a text', async () => {
        const output = await provider.rephraseText('Example of text to rephrase', 'shortened')
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

// XaiGrokProvider tests
describe('XaiGrokProvider', () => {
    configs.llmProvider = 'xai'
    configs.xai.apiKey = process.env.xai_api_key

    const provider = ProviderFactory.getInstance(configs)

    test('should be an instance of XaiGrokProvider', () => {
        expect(provider).toBeInstanceOf(XaiGrokProvider)
    })

    test('should be able to rephrase a text', async () => {
        const output = await provider.rephraseText('Example of text to rephrase', 'shortened')
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