/**
 * Utility class for creating charts
 */
export class ChartUtils {

    /**
     * Creates a simple horizontal bar chart and returns the chart container as an
     * HTMLElement.
     *
     * @param data - The input data for chart.
     * @param warningThreshold - When provided, it is used to add a class to determine
     *                           whether the current value is safe or not.
     *                           The safety context depends on the situation and is
     *                           used to apply different styling to the value bar.
     *
     * @returns An HTMLElement containing the bar chart.
     */
    public createBarChart(data: { [key: string]: number },
            warningThreshold: number | null = null): HTMLElement {
        const chartContainer = document.createElement('div')
        chartContainer.id = 'chart'

        // Extract labels and values from the input `data` object
        const labels = Object.keys(data)
        const values = Object.values(data)

        // Iterate over the data to create each bar in the chart
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

            if(warningThreshold != null && values[i] >= warningThreshold) {
                bar.classList.add('unsafe-value')
            }

            barWrapper.appendChild(bar)
            // <-- create the bar

            rowContainer.appendChild(label)
            rowContainer.appendChild(barWrapper)
            chartContainer.appendChild(rowContainer)
        }

        return chartContainer
    }
}