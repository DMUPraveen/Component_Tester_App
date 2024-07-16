import { useContext, useEffect, useRef, useState } from "react"
import { SerialPortContext } from "./Parent"
import { read_serial_port, write_serial_port } from "../Utilities/Serial_Port";
import DrawChart, { DrawChartScatter } from '../Utilities/Draw_Chart'
import { IV_curve_current_control } from "../Utilities/get_IV";

ALLOWED_MAX_CURRENT_MA = 500;
SAMPLES_IN_RANGE = 100;
function simple_clamp(x, min, max) {
    if (x < min) {
        return min;
    }
    if (x > max) {
        return max;
    }
    return x;
}

export default function IV() {
    const canvasRef = useRef(null);
    const chartref = useRef(null);
    const { port, setPort } = useContext(SerialPortContext);
    const x_val = Array.from({ length: 100 }, (_, i) => i - 100);
    useEffect(() => { return DrawChartScatter(canvasRef, x_val, x_val, chartref) });
    const [currentMin, setCurrentMin] = useState(0);
    const [currentMax, setCurrentMax] = useState(0);
    return (
        <div className="flex flex-col items-start gap-3 p-3">
            <h1 className="font-black text-4xl ">IV Characteristics</h1>
            <div className="w-1/2">
                <canvas ref={canvasRef} className="w-1/2"></canvas>
            </div>
            <div className="flex flex-row gap-3 items-center">
                <p className="font-black text-2xl">Current Min (mA)</p>
                <input className="rounded-md border-2 border-zinc-950 drop-shadow-md p-3 font-black text-2xl"
                    value={currentMin}
                    onChange={
                        (x) => setCurrentMin(x.target.value)
                    }
                >
                </input>
            </div>
            <div className="flex flex-row gap-3 items-center">
                <p className="font-black text-2xl">Current Max (mA)</p>
                <input className="rounded-md border-2 border-zinc-950 drop-shadow-md p-3 font-black text-2xl"
                    value={currentMax}
                    onChange={
                        (x) => setCurrentMax(x.target.value)
                    }
                >
                </input>
            </div>
            <button
                className="rounded-md border-2 border-zinc-950 drop-shadow-md p-3 font-black text-2xl"
                onClick={async () => {
                    let min_current = simple_clamp(currentMin, 0, ALLOWED_MAX_CURRENT_MA);
                    let max_current = simple_clamp(currentMax, 0, ALLOWED_MAX_CURRENT_MA);
                    const [x_vals, y_vals] = await IV_curve_current_control(port, min_current, max_current, SAMPLES_IN_RANGE);
                    //sort y_vals using the x_vals as the key
                    let paired = x_vals.map((x, i) => [x, y_vals[i]]);

                    // Sort the pairs based on the values in x_vals
                    paired.sort((a, b) => a[0] - b[0]);

                    // Extract the sorted y_vals

                    let sorted_y_vals = paired.map(pair => pair[1]);
                    let sorted_x_vals = paired.map(pair => pair[0]);


                    //round sorted values to 3 decimal place
                    sorted_x_vals = sorted_x_vals.map((x) => x.toFixed(3));

                    // chartref.current.data.labels = sorted_x_vals;
                    // chartref.current.data.datasets[0].data = sorted_y_vals;
                    console.log(chartref.current.data);
                    chartref.current.data.datasets[0].data = Array.from(sorted_x_vals, (x, i) => { return { x: sorted_y_vals[i], y: sorted_x_vals[i] / 1000 }; })
                    console.log(chartref.current.data);
                    chartref.current.update();
                }}> Take Measurement </button>
        </div >
    )

}