
import { get_pulse_measurement } from '../Utilities/Get_Pulse_Measurement';
import inductor_logo from '../assets/inductor_logo.png'
import { useContext, useState } from 'react';
import { SerialPortContext } from './Parent';
const CONVERSION = 0.4615
export function Inductor() {
    const [value, setValue] = useState(0);
    const { port, setPort } = useContext(SerialPortContext);
    async function on_calculate() {
        let val = await get_pulse_measurement(port);
        val = val * CONVERSION;
        let unit = 'pH'
        if (val > 1000) {
            val = val / 1000;
            unit = 'nH'
        }
        if (val > 1000) {
            val = val / 1000;
            unit = 'uH'
        }
        val = val.toFixed(2) + ' ' + unit;
        setValue(val);
    }

    return (
        <div className=" flex flex-col flex-grow gap-5">
            <div className="font-black text-4xl ">Inductor Measurement</div>
            <div
                className="flex flex-row   w-1/2 py-1 gap-4 items-start justify-stretch "
            >
                <img src={inductor_logo} className='h-1/2 rotate-90'></img>
                <div className='
                border-2 border-zinc-950 rounded-lg flex-grow text-2xl font-bold drop-shadow-lg
                '>{value}</div>
                <button
                    className="font-bold 
            rounded-lg text-2xl text-center border-2 border-zinc-950
             text-white bg-zinc-950 hover:bg-slate-700 flex-grow"
                    onClick={on_calculate}
                >Calculate</button>


            </div>
        </div >
    )


}