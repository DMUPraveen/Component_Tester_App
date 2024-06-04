import Chart from 'chart.js/auto'
export default function DrawChart(canvasInstance, x_val, y_val, chartref) {
    if (canvasInstance.current == null) {
        return () => { };
    }
    const chart = new Chart(
        canvasInstance.current,
        {
            type: 'line',
            data: {
                labels: x_val,
                datasets: [
                    {
                        label: '',
                        borderColor: '#FF6384',
                        backgroundColor: '#FFB1C1',
                        data: y_val,
                        pointStyle: false,
                    }
                ]
            }
        }
    );
    chartref.current = chart;
    return () => { console.log("Destroying the previous chart"); chart.destroy(); }
}
