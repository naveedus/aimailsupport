class PasswordToggle extends HTMLInputElement {
    constructor() {
        super()

        this.type = 'password'

        const icon: HTMLSpanElement = document.createElement('span')
        icon.classList.add('icon')
        icon.innerHTML = '&#x1F513' // Lock icon in unicode character

        icon.addEventListener('click', () => {
            this.type = this.type === 'password' ? 'text' : 'password'
        })

        if (this.nextSibling) {
            this.parentNode.insertBefore(icon, this.nextSibling)
        } else {
            this.parentNode.appendChild(icon)
        }
    }
}

customElements.define('password-toggle', PasswordToggle, { extends: 'input' })