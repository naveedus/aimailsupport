import { GenericProvider } from '../genericProvider'
import { ConfigType } from '../../helpers/configType'

export class GoogleGeminiProvider extends GenericProvider {
    private readonly apiKey: string

    public constructor(config: ConfigType) {
        super(config)

        this.apiKey = config.google.apiKey
    }

    // TODO
}