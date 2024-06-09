import { useContext, useRef } from "react"
import { useEffect } from "react";
import { useState } from "react";
import DrawChart from "../Utilities/Draw_Chart";
import { SerialPortContext } from "../Pages/Parent";
import { read_serial_port } from "../Utilities/Serial_Port";

export default function Oscilloscope() {
    const canvasRef = useRef(null);
    const x_val = Array.from({ length: 100 }, (_, i) => i - 100);
    const chartref = useRef(null);
    const { port, setSerialPort } = useContext(SerialPortContext);
    const [reader, setReader] = useState(null);

    function update_function() {
        const periodic = setInterval(() => {
            if (chartref.current == null) return;
            let y_val = Array.from({ length: 100 }, (_, i) => Math.random() / 10);
            chartref.current.data.labels = x_val;
            chartref.current.data.datasets[0].data = y_val;
            chartref.current.update('none');
        }, 1);
        return () => clearInterval(periodic);
    }


    function start_serial_reader() {
        (async () => {
            if (port != null) {
                let new_reader = await port.readable.getReader();
                console.log(setReader);
                setReader(new_reader);
            }
        })();

        return () => {
            if (reader != null) {
                reader.releaseLock();
                console.log("Destroying Reader");
                setReader(null);
            }
        }
    }

    function read_serial() {
        const func = async () => {
            if (reader == null) return;
            const { value, done } = await reader.read();
            let data = new Uint8Array(value.buffer);
            let y_val = Array.from(data, (byte) => byte);
            let x_val = Array.from({ length: y_val.length }, (_, i) => i);
            chartref.current.data.labels = x_val;
            chartref.current.data.datasets[0].data = y_val;
            chartref.current.update('none');
            setTimeout(read_serial, 100);
        }
        func();
    }
    useEffect(start_serial_reader, [port]);
    // useEffect(update_function, []);
    useEffect(read_serial, [reader]);
    useEffect(() => { return DrawChart(canvasRef, x_val, x_val, chartref) });
    return (
        <canvas ref={canvasRef}></canvas>
    )
}