import Chart from 'chart.js/auto'
export default function DrawChart(canvasInstance) {
    if (canvasInstance.current == null) {
        return () => { };
    }
    const x_val = Array.from({ length: 201 }, (_, i) => i - 100);
    const y_val = x_val.map((x) => x * x);
    const chart = new Chart(
        canvasInstance.current,
        {
            type: 'line',
            data: {
                labels: x_val,
                datasets: [
                    {
                        label: 'x^3 Function',
                        borderColor: '#FF6384',
                        backgroundColor: '#FFB1C1',
                        data: y_val,
                        pointStyle: false,
                    }
                ]
            }
        }
    );
    return () => { console.log("Destroying the previous chart"); chart.destroy(); }
}
