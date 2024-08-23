import { GenericProvider } from '../GenericProvider'
import { ConfigType } from '../../ConfigType'


export class GoogleGeminiProvider extends GenericProvider {
    private apiKey: string

    public constructor(config: ConfigType) {
        super(config)

        this.apiKey = config.google.apiKey
    }

    // TODO
}