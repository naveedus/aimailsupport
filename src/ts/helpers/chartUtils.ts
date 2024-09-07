/**
 * Utility class for creating charts
 */
export class ChartUtils {

    /**
     * Creates a simple horizontal bar chart and returns the chart container as an HTMLElement.
     *
     * @param data - Input data (ignored in this implementation).
     * @returns An HTMLElement containing the bar chart.
     */
    public createBarChart(data: any): HTMLElement {
        const chartContainer = document.createElement('div')
        chartContainer.id = 'chart'

        // Sample data for demonstration (ignoring the input `data` field)
        const labels = ['Item A', 'Item B', 'Item C', 'Item D', 'Item E']
        const values = [30, 60, 45, 80, 100] // These values represent the bar lengths

        // Iterate over the sample data to create each bar in the chart
        for (let i = 0; i < labels.length; ++i) {
            // Create a container for each row (label + bar)
            const rowContainer = document.createElement('div')
            rowContainer.classList.add('row')

            // Create the label for the bar
            const label = document.createElement('div')
            label.classList.add('label')
            label.innerText = labels[i]
            // <-- create the label for the bar

            // Create the bar -->
            const barWrapper = document.createElement('div')
            barWrapper.classList.add('bar-wrapper')

            const bar = document.createElement('div')
            bar.classList.add('bar')
            bar.style.width = `${values[i]}%` // Set the bar width based on the value

            barWrapper.appendChild(bar)
            // <-- create the bar

            rowContainer.appendChild(label)
            rowContainer.appendChild(barWrapper)
            chartContainer.appendChild(rowContainer)
        }

        return chartContainer
    }
}