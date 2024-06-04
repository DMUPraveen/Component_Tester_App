import { useContext, useState } from 'react';
import function_generator_logo from '../assets/function_generator_logo.png'
import { arbitrary_wave, cosine_wave } from '../Utilities/Signal_Generator_func';
import { SerialPortContext } from './Parent';
import { read_serial_port, write_serial_port } from '../Utilities/Serial_Port';


function SetupSinewave() {
    const [frequency, setFrequency] = useState(0);
    const [amplitude, setAmplitude] = useState(0);
    const { port, setPort } = useContext(SerialPortContext)
    return (
        <>
            <div className="font-black text-2xl col-span-2">Frequency (Hz) </div>
            <div className="font-black text-2xl col-span-1">: </div>
            <input type="number"
                className="border-2 font-bold text-2xl border-zinc-950 col-span-2"
                onChange={(e) => { setFrequency(e.target.value) }}
                defaultValue={frequency}
            />
            <div className="font-black text-2xl col-span-2">Amplitude </div>
            <div className="font-black text-2xl col-span-1">: </div>
            <select onChange={(e) => { setAmplitude(e.target.value) }} className="font-bold text-2xl border-2 border-zinc-950 col-span-2">
                <option value="0">1</option>
                <option value="1">1/2</option>
                <option value="2">1/4</option>
                <option value="3">1/8</option>
            </select>
            <button className="w-2/3 font-bold 
            rounded-lg text-2xl text-center 
             text-white bg-zinc-950 hover:bg-slate-700 col-span-2"
                onClick={async () => {
                    if (port == null) return console.log("Port is null");
                    let buffer = cosine_wave(parseInt(frequency), parseInt(amplitude));
                    await write_serial_port(port, buffer);
                    setTimeout(
                        () => {
                            let buffer = new ArrayBuffer(1);
                            read_serial_port(port, buffer).then(
                                (data) => {
                                    console.log(data)
                                }
                            )
                        }
                        , 1000
                    )
                }}
            >Generate</button>
            <button
                className="w-2/3 font-bold 
            rounded-lg text-2xl text-center 
             text-white bg-zinc-950 hover:bg-slate-700 col-span-2"

                onClick={async () => {
                    if (port == null) return console.log("Port is null");
                    let buffer = arbitrary_wave(parseInt(frequency), new Array(400));
                    console.log(buffer);
                    await write_serial_port(port, buffer);
                    setTimeout(
                        () => {
                            let buffer = new ArrayBuffer(1);
                            read_serial_port(port, buffer).then(
                                (data) => {
                                    console.log(data)
                                }
                            )
                        }
                        , 1000
                    )
                }}
            >
                Hello
            </button>
        </>
    )
}

function ConditionalOptions({ signalType }) {
    console.log(signalType)
    if (signalType === 'Sine') {
        return (
            <>
                <SetupSinewave />
            </>
        )
    }
    return (
        <>
            Not Defined
        </>
    )
}

function SignalGenerator() {
    const [signal, signalSet] = useState('Sine');
    return (
        <div className=" flex flex-col">
            <div className="flex flex-row flex-grow p-3">
                <div className="font-black text-4xl ">Signal Generator  </div>
            </div>
            <div className='grid grid-cols-5 p-8  w-1/2 gap-y-10 items-center'>
                <div className="font-black text-2xl  col-span-2">Signal Type </div>
                <div className="font-black text-2xl  col-span-1">:</div>
                <select defaultChecked={signal} onChange={(e) => { signalSet(e.target.value); console.log("I was called") }}
                    className="font-bold text-2xl border-2 border-zinc-950 col-span-2">
                    <option value="Sine">Sine</option>
                    <option value="Square">Square</option>
                    <option value="Triangle">Triangle</option>
                    <option value="Sawtooth">Sawtooth</option>
                </select>
                <ConditionalOptions signalType={signal} />
            </div>

        </div>
    );
}


export default SignalGenerator;