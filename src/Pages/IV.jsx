import { useContext, useEffect, useRef } from "react"
import { SerialPortContext } from "./Parent"
import { read_serial_port, write_serial_port } from "../Utilities/Serial_Port";
import DrawChart from '../Utilities/Draw_Chart'
import { IV_curve_current_control } from "../Utilities/get_IV";


export default function IV() {
    const canvasRef = useRef(null);
    const chartref = useRef(null);
    const { port, setPort } = useContext(SerialPortContext);
    const x_val = Array.from({ length: 100 }, (_, i) => i - 100);
    useEffect(() => { return DrawChart(canvasRef, x_val, x_val, chartref) });
    return (
        <>
            <h1 className="font-black text-4xl ">IV Characteristics</h1>
            <button onClick={async () => {
                const [x_vals, y_vals] = await IV_curve_current_control(port, 0, 5, 100);
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
                chartref.current.data.datasets[0].data = sorted_y_vals;
                chartref.current.update();
            }}> Hello </button>
            <div className="w-1/2">
                <canvas ref={canvasRef} className="w-1/2"></canvas>
            </div>
        </>
    )
}