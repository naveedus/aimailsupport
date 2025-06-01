/**
 * Interface representing the configuration settings.
 */
export interface ConfigType {
    mainUserLanguageCode: string
    translationLanguageCodes: string[] // Array of ISO 639-1 codes (e.g. ['en', 'it', 'fr'])
    llmProvider: string
    temperature: number
    servicesTimeout: number
    debugMode: boolean

    ollama: {
        serviceUrl: string
        model: string
    }

}
