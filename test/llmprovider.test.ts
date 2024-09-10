import { ConfigType } from '../src/ts/helpers/configType'
import { ProviderFactory } from '../src/ts/llmProviders/providerFactory'
import { AnthropicClaudeProvider } from '../src/ts/llmProviders/impl/anthropicClaudeProvider'
import { OpenAiGptProvider } from '../src/ts/llmProviders/impl/openAiGptProvider'

import dotenv from 'dotenv'
import 'jest-webextension-mock'

// Dummy configuration:
const configs: ConfigType = {
    mainUserLanguageCode: 'English',
    llmProvider: null,
    servicesTimeout: 12,
    debugMode: true,

    anthropic: {
        apiKey: null,
        model: null
    },

    google: {
        apiKey: null
    },

    openai: {
        apiKey: null,
        organizationId: null,
        model: null,

        text2speech: {
            audioQuality: 'tts-1',
            voice: 'onyx',
            speed: 1
        }
    }
}

// Persists the configurations
browser.storage.sync.set(configs)

// Load environment variables from the .env file, see README.md for more information
dotenv.config()

// Added a little delay between calls to avoid hitting the rate limit on some LLM models
afterEach(() => new Promise(resolve => setTimeout(resolve, 2000)))

// AnthropicClaudeProvider tests
describe('AnthropicClaudeProvider', () => {
    configs.llmProvider = 'anthropic'
    configs.anthropic.apiKey = process.env.anthropic_api_key
    configs.anthropic.model = 'claude-3-haiku-20240307'

    const provider = ProviderFactory.getInstance(configs)

    test('should be an instance of AnthropicClaudeProvider', () => {
        expect(provider).toBeInstanceOf(AnthropicClaudeProvider)
    })

    test('should be able to soften a text', async () => {
        const output = await provider.softenText('Example of text to soften')
        expect(typeof output).toBe('string')
    })

    test('should be able to suggest a reply from text', async () => {
        const output = await provider.suggestReplyFromText('Example of text for which to request a suggestion for a reply')
        expect(typeof output).toBe('string')
    })

    test('should be able to summarize text', async () => {
        const output = await provider.summarizeText('Example of text to summarize')
        expect(typeof output).toBe('string')
    })

    test('should be able to translate text', async () => {
        const output = await provider.translateText('Example of text to translate')
        expect(typeof output).toBe('string')
    })
})

// OpenAiGptProvider tests
describe('OpenAiGptProvider', () => {
    configs.llmProvider = 'openai'
    configs.openai.apiKey = process.env.openai_api_key
    configs.openai.model = 'gpt-3.5-turbo'

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
        });
    })

    test('should be able to generate audio from text', async () => {
        const output = await provider.getSpeechFromText('Example of text to speach')
        expect(output).toBeInstanceOf(Blob)
        expect(output.type).toBe('audio/mpeg')
    })

    test('should be able to soften a text', async () => {
        const output = await provider.softenText('Example of text to soften')
        expect(typeof output).toBe('string')
    })

    test('should be able to suggest a reply from text', async () => {
        const output = await provider.suggestReplyFromText('Example of text for which to request a suggestion for a reply')
        expect(typeof output).toBe('string')
    })

    test('should be able to summarize text', async () => {
        const output = await provider.summarizeText('Example of text to summarize')
        expect(typeof output).toBe('string')
    })

    test('should be able to translate text', async () => {
        const output = await provider.translateText('Example of text to translate')
        expect(typeof output).toBe('string')
    })
})