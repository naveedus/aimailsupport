/**
 * Interface representing the configuration settings.
 */
export interface ConfigType {
    mainUserLanguageCode: string
    llmProvider: string
    temperature: number
    servicesTimeout: number
    debugMode: boolean

    anthropic: {
        apiKey: string
        model: string
    }

    google: {
        apiKey: string
        model: string
    }

    openai: {
        apiKey: string
        organizationId: string
        model: string

        text2speech: {
            audioQuality: string
            voice: string
            speed: number
        }
    }
}
