import Chart from 'chart.js/auto'
export default function DrawChart(canvasInstance, x_val, y_val, chartref, y_scale) {
    if (canvasInstance.current == null) {
        return () => { };
    }
    let chart = null;
    if (y_scale === null) {
        chart = new Chart(
            canvasInstance.current,
            {
                type: 'line',
                data: {
                    labels: x_val,
                    datasets: [
                        {
                            label: '',
                            borderColor: '#000000',
                            backgroundColor: '#000000',
                            data: y_val,
                            pointStyle: false,
                        }
                    ]
                }
            }
        );
    }
    else {

        chart = new Chart(
            canvasInstance.current,
            {
                type: 'line',
                data: {
                    labels: x_val,
                    datasets: [
                        {
                            label: '',
                            borderColor: '#000000',
                            backgroundColor: '#000000',
                            data: y_val,
                            pointStyle: false,
                        }
                    ]
                },
                options: {
                    scales: {
                        y: {
                            min: 0,
                            max: y_scale
                        }
                    }
                }
            }
        );
    }
    chartref.current = chart;
    return () => { console.log("Destroying the previous chart"); chart.destroy(); }
}


export function DrawChartScatter(canvasInstance, x_val, y_val, chartref) {
    if (canvasInstance.current == null) {
        return () => { };
    }
    const data = {
        datasets: [{
            label: "IV - Characteristics",
            backgroundColor: '#000000',
            data: [],
        }],
    };
    let chart = null;
    chart = new Chart(
        canvasInstance.current,
        {
            type: 'scatter',
            data: data
        }
    );


    chartref.current = chart;
    return () => { console.log("Destroying the previous chart"); chart.destroy(); }
}
