import { useContext, useRef } from "react"
import { useEffect } from "react";
import { useState } from "react";
import DrawChart from "../Utilities/Draw_Chart";
import { SerialPortContext } from "../Pages/Parent";
import { create_serial_port, destroy_serial_port, read_serial_port, write_serial_port } from "../Utilities/Serial_Port";
import { requestPermission } from "@tauri-apps/api/notification";
import { findEdgeAndShift, findEdgeAndShiftLinear } from "../Utilities/Analysis";
const STM32_VID = 1155;
const MAX_TRIGGER_LEVEL = "3.3";
function VerticalSlider({ onChange, verticalScale }) {
    if (onChange == null) {
        onChange = (x) => { console.log(x); };
    }
    return (
        <div className="flex flex-col items-center h-5/6">
            <input
                type="range"
                min={verticalScale[0]}
                max={verticalScale[1]}
                step="0.01"
                onChange={(x) => { onChange(parseFloat(x.target.value)) }}
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
function InformationPanel({ triggerLevel, triggerType, setTriggerType, windowLengthRef, verticalScaleRef, setVerticalScale }) {
    let [mid, setMid] = useState(MAX_TRIGGER_LEVEL / 2);
    let [range, setRange] = useState(MAX_TRIGGER_LEVEL);

    const setLimits = (mid, range) => {
        console.log(mid, range);
        setVerticalScale([mid - range / 2, mid + range / 2]);
    }
    const setMidLimit = (e, range) => {
        let val = parseFloat(e.target.value);
        setMid(val);
        setLimits(val, range);
    }
    const setRangeLimit = (e, mid) => {
        let val = parseFloat(e.target.value);
        setRange(val);
        setLimits(mid, val);
    }
    const toggleTriggerType = () => {
        if (triggerType == "rising") {
            setTriggerType("falling");
            return;
        }
        setTriggerType("rising");
    }
    return (
        <div className="flex flex-col self-start py-10 px-3 gap-5 items-start">
            <div className="h-1/5 bg-cyan-400 grow"> </div>
            <p className="font-black">Trigger Level: {triggerLevel.toFixed(2)}</p>
            <button onClick={toggleTriggerType} className="font-black shadow-md p-3 border-black border-2 rounded-md">Trigger: {triggerType}</button>
            <div>
                <p className="font-black">Window Size: </p>
                <select onChange={(e) => { windowLengthRef.current = parseInt(e.target.value); console.log(e.target.value); }}
                    className="font-black border-2 border-zinc-950 col-span-2">
                    {/* <option value="1024">1024</option> */}
                    <option value="512">512</option>
                    <option value="256">256</option>
                    <option value="128">128</option>
                </select>
            </div>
            <div>
                <p className="font-black">Vertical Position:{mid} </p>
                <input type="range"
                    min="0" max={MAX_TRIGGER_LEVEL} step="0.01"
                    className="border-2 border-zinc-950"
                    onChange={(e) => { setMidLimit(e, range) }} />

                <p className="font-black">Vertical Scale Range:{range} </p>
                <input type="range"
                    min="0.01" max={MAX_TRIGGER_LEVEL} step="0.01"
                    className="border-2 border-zinc-950"
                    onChange={(e) => { setRangeLimit(e, mid) }} />
            </div>
        </div>
    )

}
export default function Oscilloscope() {
    const canvasRef = useRef(null);
    const x_val = Array.from({ length: 1024 }, (_, i) => i);
    const chartRef = useRef(null);
    const [port, setSerialPort] = useState(null);
    const [reader, setReader] = useState(null);
    const data_buffer = useRef(new Uint8Array(new ArrayBuffer(1024 * 2)));
    const [triggerLevel, setTriggerLevelProto] = useState(2.5);
    const [triggerType, setTriggerTypeProto] = useState("rising");
    const triggerRef = useRef(triggerLevel);
    const triggerTypeRef = useRef(triggerType);
    const windowLengthRef = useRef(512);
    const [verticalScale, setVerticalScaleProto] = useState([0, 3.3]);
    const verticalScaleRef = useRef(verticalScale);
    // const [windowLength, setWindowLength] = us(1024);
    function setTriggerLevel(newLevel) {
        triggerRef.current = newLevel;
        setTriggerLevelProto(newLevel);
    }
    function setTriggerType(newType) {
        setTriggerTypeProto(newType);
        triggerTypeRef.current = newType;
    }
    function setVerticalScale(newScale) {
        verticalScaleRef.current = newScale;
        setVerticalScaleProto(newScale);
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
            y_val = findEdgeAndShiftLinear(y_val, triggerRef.current, triggerTypeRef.current);
            console.log(windowLengthRef.current)
            x_val = x_val.slice(0, windowLengthRef.current);
            y_val = y_val.slice(0, windowLengthRef.current);
            chartRef.current.data.labels = x_val;
            chartRef.current.data.datasets[0].data = y_val;
            chartRef.current.options.scales.y.max = verticalScaleRef.current[1];
            chartRef.current.options.scales.y.min = verticalScaleRef.current[0];
            // console.log(verticalScaleRef.current);
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
            <div className="flex flex-col items-center  p-3  h-full ">
                <button
                    className="font-black text-2xl drop-shadow-l bg-white p-3 border-2 border-zinc-500 rounded-md"
                    onClick={start_stop_oscilloscope}

                >
                    {(port == null) ? "Start" : "Stop"}
                </button>
                <div className="flex flex-row items-center justify-center gap-3 grow self-stretch">
                    <InformationPanel triggerLevel={triggerLevel} triggerType={triggerType} setTriggerType={setTriggerType} windowLengthRef={windowLengthRef} verticalScaleRef={verticalScaleRef} setVerticalScale={setVerticalScale} />
                    <VerticalSlider onChange={setTriggerLevel} verticalScale={verticalScale} />
                    <div className="w-10/12 p-3">
                        <canvas ref={canvasRef} ></canvas>
                    </div>
                </div>
            </div>
        </>

    )
}