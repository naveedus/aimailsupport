/**
 * Custom element for managing multiple language selection with dual-list
 * interface.
 */
class MultipleLanguageSelector extends HTMLElement {
    private readonly sourceSelect: LanguageSelector
    private readonly targetSelect: HTMLSelectElement
    private readonly moveRightButton: HTMLButtonElement
    private readonly moveLeftButton: HTMLButtonElement

    constructor() {
        super()
        const shadowRoot = this.attachShadow({ mode: 'open' })

        const style = document.createElement('style')
        style.textContent = `
            .container {
                align-items: center;
                display: flex;

                select {
                    flex: 1;
                    height: 120px;
                }

                .button-container {
                    display: flex;
                    flex-direction: column;

                    button {
                        padding: 0 8px;
                        margin: 5px;
                    }
                }
            }
        `

        // Main container
        const container = document.createElement('div')
        container.className = 'container'

        // Source select (available languages)
        this.sourceSelect = document.createElement('select', { is: 'language-selector' }) as LanguageSelector
        this.sourceSelect.multiple = true

        const buttonContainer = document.createElement('div')
        buttonContainer.className = 'button-container'

        this.moveRightButton = document.createElement('button')
        this.moveRightButton.textContent = '→'
        this.moveLeftButton = document.createElement('button')
        this.moveLeftButton.textContent = '←'

        buttonContainer.append(this.moveRightButton, this.moveLeftButton)

        // Target select (selected languages)
        this.targetSelect = document.createElement('select')
        this.targetSelect.multiple = true

        // Component assembly
        container.append(this.sourceSelect, buttonContainer, this.targetSelect)
        shadowRoot.append(style, container)

        // Event handlers
        this.moveRightButton.addEventListener('click', () => this.moveSelected(true))
        this.moveLeftButton.addEventListener('click', () => this.moveSelected(false))
        this.targetSelect.addEventListener('change', () => this.dispatchEvent(new Event('change')))
    }

    /**
     * Moves selected options between lists.
     *
     * @param toTarget - Direction flag, boolean value:
     *   true = to target list;
     *   false = to source list.
     */
    private moveSelected(toTarget: boolean) {
        const source = toTarget ? this.sourceSelect : this.targetSelect
        const target = toTarget ? this.targetSelect : this.sourceSelect

        Array.from(source.selectedOptions).forEach(option => {
            source.removeChild(option)
            target.appendChild(option)
        })

        // Sort target list alphabetically
        const options = Array.from(target.options)

        const sortedOptions = options.toSorted((a: HTMLOptionElement, b: HTMLOptionElement) => {
            const textA = a.textContent || ''
            const textB = b.textContent || ''

            return textA.localeCompare(textB)
        })

        target.replaceChildren(...sortedOptions)
    }

    // HTMLSelectElement interface proxy
    get value(): string { return this.targetSelect.value }
    set value(v: string) { this.targetSelect.value = v }

    get selectedIndex(): number { return this.targetSelect.selectedIndex }
    set selectedIndex(v: number) { this.targetSelect.selectedIndex = v }

    get options(): HTMLOptionsCollection { return this.targetSelect.options }
    get selectedOptions(): HTMLCollectionOf<HTMLOptionElement> { return this.targetSelect.selectedOptions }

    /**
     * Returns array of language codes
     */
    getValues(): string[] {
        return Array.from(this.targetSelect.options).map(opt => opt.value)
    }

    /**
     * Sets values and synchronizes both lists
     * @param values - Array of language codes (e.g. ['en', 'fr'])
     */
    setValues(values: string[]) {
        // Aggregate all options from both lists
        const allOptions = [
            ...Array.from(this.sourceSelect.options),
            ...Array.from(this.targetSelect.options)
        ]

        // Filter and sort options for both lists
        const sortComparator = (a: HTMLOptionElement, b: HTMLOptionElement) =>
            (a.textContent || '').localeCompare(b.textContent || '')

        const sourceOptions = allOptions
            .filter(option => !values.includes(option.value))
            .sort(sortComparator)

        const targetOptions = allOptions
            .filter(option => values.includes(option.value))
            .sort(sortComparator)

        // Rebuild lists with sorted options
        this.sourceSelect.replaceChildren(...sourceOptions)
        this.targetSelect.replaceChildren(...targetOptions)

        // Notify listeners
        this.dispatchEvent(new Event('change'))
    }
}

customElements.define('multiple-language-selector', MultipleLanguageSelector)