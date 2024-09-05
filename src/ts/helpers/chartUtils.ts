export function createBarChart(data: any): HTMLElement {
    const chartContainer = document.createElement('canvas')
    chartContainer.width = 400
    chartContainer.height = 200

    // Otteniamo il contesto 2D del canvas per disegnare
    const ctx = chartContainer.getContext('2d')

    // Dati personalizzati
    const labels = ['Prodotto A', 'Prodotto B', 'Prodotto C']
    const datas = [12, 19, 7]

    // Definire alcune opzioni grafiche di base
    const barHeight = 30
    const gap = 10
    const maxData = Math.max(...datas)
    const chartWidth = chartContainer.width - 100 // Lasciare spazio per le etichette

    if (ctx) {
        // Pulire il canvas
        ctx.clearRect(0, 0, chartContainer.width, chartContainer.height)

        // Disegnare ogni barra orizzontale
        for (let i = 0; i < data.length; ++i) {
            const barWidth = (data[i] / maxData) * chartWidth

            // Disegnare la barra
            ctx.fillStyle = 'rgba(54, 162, 235, 0.7)';
            ctx.fillRect(100, i * (barHeight + gap), barWidth, barHeight)

            // Disegnare l'etichetta del prodotto
            ctx.fillStyle = '#000'
            ctx.font = '14px Arial'
            ctx.fillText(labels[i], 10, i * (barHeight + gap) + barHeight / 1.5)

            // Disegnare il valore numerico accanto alla barra
            ctx.fillStyle = '#000'
            ctx.fillText(data[i].toString(), 110 + barWidth, i * (barHeight + gap) + barHeight / 1.5)
        }
    }

    // Restituire il contenitore HTML con il canvas
    return chartContainer
}
