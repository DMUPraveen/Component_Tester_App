import { useContext, useRef } from "react"
import { useEffect } from "react";
import { useState } from "react";
import DrawChart from "../Utilities/Draw_Chart";
import { SerialPortContext } from "../Pages/Parent";
import { create_serial_port, destroy_serial_port, read_serial_port, write_serial_port } from "../Utilities/Serial_Port";
import { requestPermission } from "@tauri-apps/api/notification";
import { findEdgeAndShift } from "../Utilities/Analysis";
const STM32_VID = 1155;
function VerticalSlider({ onChange }) {

    if (onChange == null) {
        onChange = (x) => { console.log(x); };
    }
    return (
        <div className="flex flex-col items-center h-5/6">
            <input
                type="range"
                min="-10"
                max="10"
                onChange={onChange}
                className="w-2 h-full accent-zinc-950 rounded-lg"
                style={{
                    writingMode: 'bt-lr',
                    WebkitAppearance: 'slider-vertical',
                    appearance: 'slider-vertical',
                }}
            />
        </div>
    );
}
export default function Oscilloscope() {
    const canvasRef = useRef(null);
    const x_val = Array.from({ length: 1024 }, (_, i) => i);
    const chartRef = useRef(null);
    const [port, setSerialPort] = useState(null);
    const [reader, setReader] = useState(null);
    const data_buffer = useRef(new Uint8Array(new ArrayBuffer(1024 * 2)));

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
            let offset = 0;
            await write_serial_port(port, new Uint8Array([73]));
            while (true) {
                const { value, done } = await reader.read();
                if (done) {
                    console.log("Reader Done");
                }
                data_buffer.current.set(new Uint8Array(value.buffer), offset);
                offset += value.buffer.byteLength;
                if (offset >= 1024 * 2) {
                    // console.log(offset);
                    break;
                }
            }
            let data = new Uint16Array(data_buffer.current.buffer);
            // console.log(data.length);
            let y_val = Array.from(data, (byte) => byte / 4096 * 3.3);
            let x_val = Array.from({ length: 1024 }, (_, i) => i);
            y_val = findEdgeAndShift(y_val, 2.5, "rising");
            chartRef.current.data.labels = x_val;
            chartRef.current.data.datasets[0].data = y_val;
            chartRef.current.update('none');
            setTimeout(read_serial, 100);
        }
        func();
    }
    useEffect(start_serial_reader, [port]);
    // useEffect(update_function, []);
    async function start_stop_oscilloscope() {
        if (port == null) {
            const port_new = await create_serial_port(115200, [STM32_VID]);
            console.log(port_new.getInfo());
            setSerialPort(port_new);
            return;
        }
        await reader.cancel();
        destroy_serial_port(port);
        setSerialPort(null);
        setReader(null);
    }
    useEffect(read_serial, [reader]);
    useEffect(() => { return DrawChart(canvasRef, x_val, Array.from({ length: x_val.length }, (_, i) => 0), chartRef, 3.3) });
    return (

        <>
            <div className="font-black text-4xl p-3"> Oscilloscope </div>
            <div className="flex flex-col items-center  p-3  h-screen ">
                <button
                    className="font-black text-2xl drop-shadow-l bg-white p-3 border-2 border-zinc-500"
                    onClick={start_stop_oscilloscope}

                >
                    {(port == null) ? "Start" : "Stop"}
                </button>
                <div className="flex flex-row items-center justify-center  grow self-stretch">
                    <VerticalSlider />
                    <div className="w-10/12 p-3">
                        <canvas ref={canvasRef} ></canvas>
                    </div>
                </div>
            </div>
            {/* </div> */}
        </>

    )
}