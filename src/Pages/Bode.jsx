import { useContext, useEffect, useRef, useState } from "react"
import { SerialPortContext } from "./Parent"
import { read_serial_port, write_serial_port } from "../Utilities/Serial_Port";
import DrawChart, { DrawChartScatter } from '../Utilities/Draw_Chart'
import { IV_curve_current_control } from "../Utilities/get_IV";
import { get_total_bode } from "../Utilities/Bode";


export default function Bode() {
    const canvasRef = useRef(null);
    const chartref = useRef(null);
    const { port, setPort } = useContext(SerialPortContext);
    const x_val = Array.from({ length: 100 }, (_, i) => i - 100);
    useEffect(() => { return DrawChartScatter(canvasRef, x_val, x_val, chartref) });
    const [currentRange, setCurrentRange] = useState(0);
    return (
        <div className="flex flex-col items-start gap-3 p-3">
            <h1 className="font-black text-4xl ">Bode Magnitude</h1>
            <div className="w-1/2">
                <canvas ref={canvasRef} className="w-1/2"></canvas>
            </div>
            <button
                className="rounded-md border-2 border-zinc-950 drop-shadow-md p-3 font-black text-2xl"
                onClick={async () => {
                    const [frequencies, magnitudes] = await get_total_bode(port);
                    console.log(frequencies, magnitudes)
                    // chartref.current.data.labels = sorted_x_vals;
                    // chartref.current.data.datasets[0].data = sorted_y_vals;
                    // console.log(chartref.current.data);
                    // chartref.current.data.datasets[0].data = Array.from(sorted_x_vals, (x, i) => { return { x: sorted_y_vals[i], y: sorted_x_vals[i] / 1000 }; })
                    // console.log(chartref.current.data);
                    // chartref.current.update();
                }}> Take Measurement </button>
        </div >
    )

}