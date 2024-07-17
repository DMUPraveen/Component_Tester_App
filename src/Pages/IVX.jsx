
import { useContext, useEffect, useRef, useState } from "react"
import { SerialPortContext } from "./Parent"
import { read_serial_port, write_serial_port } from "../Utilities/Serial_Port";
import DrawChart, { DrawChartScatter } from '../Utilities/Draw_Chart'
import { IVX_curve_current_control } from "../Utilities/get_IV";
import { green_led_off, green_led_on, simple_clamp } from "../Utilities/utilities";
import { IVX_control } from "../Utilities/get_IV";

export default function IVX() {
    const canvasRef = useRef(null);
    const chartref = useRef(null);
    const { port, setPort } = useContext(SerialPortContext);
    const x_val = Array.from({ length: 100 }, (_, i) => i - 100);
    useEffect(() => { return DrawChartScatter(canvasRef, x_val, x_val, chartref) });
    const [currentMinUA, setCurrentMinUA] = useState(0);

    const [currentMaxUA, setCurrentMaxUA] = useState(0);

    const [voltageMinUA, setVoltageMinUA] = useState(0);

    const [voltageMaxUA, setVoltageMaxUA] = useState(0);

    return (
        <div className="flex flex-col items-start gap-3 p-3">
            <h1 className="font-black text-4xl ">IV-I Characteristics</h1>
            <div className="w-1/2">
                <canvas ref={canvasRef} className="w-1/2"></canvas>
            </div>
            <div className="flex flex-row gap-3 items-center">
                <p className="font-black text-l">Current X Max (uA)</p>
                <input className="rounded-md border-2 border-zinc-950 drop-shadow-md p-3 font-black text-l"
                    value={currentMaxUA}
                    onChange={
                        (e) => { setCurrentMaxUA(e.target.value) }
                    }
                ></input>
            </div>
            <div className="flex flex-row gap-3 items-center">
                <p className="font-black text-l">Current X Min (uA)</p>
                <input className="rounded-md border-2 border-zinc-950 drop-shadow-md p-3 font-black text-l"
                    value={currentMinUA}
                    onChange={
                        (e) => { setCurrentMinUA(e.target.value) }
                    }
                ></input>
            </div>
            <div className="flex flex-row gap-3 items-center">
                <p className="font-black text-l">Voltage Max   (V)</p>
                <input className="rounded-md border-2 border-zinc-950 drop-shadow-md p-3 font-black text-l"
                    value={voltageMaxUA}
                    onChange={
                        (e) => { setVoltageMaxUA(e.target.value) }
                    }
                ></input>
            </div>
            <div className="flex flex-row gap-3 items-center">
                <p className="font-black text-l">Voltage Min   (V)</p>
                <input className="rounded-md border-2 border-zinc-950 drop-shadow-md p-3 font-black text-l"
                    value={voltageMinUA}
                    onChange={
                        (e) => { setVoltageMinUA(e.target.value) }
                    }

                ></input>
            </div>
            <button
                className="rounded-md border-2 border-zinc-950 drop-shadow-md p-3 font-black text-l"
                onClick={async () => {
                    await green_led_on(port);
                    let minimum_current_ma = simple_clamp(currentMinUA / 1000, 0, 1);
                    let maximum_current_ma = simple_clamp(currentMaxUA / 1000, 0, 1);
                    let minimum_voltage_V = simple_clamp(voltageMinUA, 0, 10);
                    let maximum_voltage_V = simple_clamp(voltageMaxUA, 0, 10);

                    // const [x_vals, y_vals] = await IVX_curve_current_control(port, 0, 5, 100);
                    const [x_vals, y_vals] = await IVX_control(port, maximum_current_ma, minimum_current_ma, maximum_voltage_V, minimum_voltage_V, 10, 30);

                    //sort y_vals using the x_vals as the key
                    let paired = x_vals.map((x, i) => [x, y_vals[i]]);

                    // Sort the pairs based on the values in x_vals
                    paired.sort((a, b) => a[0] - b[0]);

                    // Extract the sorted y_vals

                    let sorted_y_vals = paired.map(pair => pair[1]);
                    let sorted_x_vals = paired.map(pair => pair[0]);


                    //round sorted values to 3 decimal place
                    sorted_x_vals = sorted_x_vals.map((x) => x.toFixed(3));

                    chartref.current.data.labels = sorted_x_vals;
                    chartref.current.data.datasets[0].data = Array.from(sorted_x_vals, (x, i) => { return { x: sorted_y_vals[i], y: sorted_x_vals[i] / 1000 }; })
                    chartref.current.update();
                    await green_led_off(port);
                }}> Take Measurement </button>
        </div>
    )
}