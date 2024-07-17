
import { get_pulse_measurement } from '../Utilities/Get_Pulse_Measurement';
import capacitor_logo from '../assets/capacitor_logo.png'
import { useContext, useState } from 'react';
import { SerialPortContext } from './Parent';
import { green_led_on, green_led_off } from '../Utilities/utilities';
const CONVERSION = 0.4615
export function Capacitor() {
    const [value, setValue] = useState(0);
    const { port, setPort } = useContext(SerialPortContext);
    async function on_calculate() {
        await green_led_on(port);
        let val = await get_pulse_measurement(port);
        val = val * CONVERSION;
        let unit = 'pF'
        if (val > 1000) {
            val = val / 1000;
            unit = 'nF'
        }
        if (val > 1000) {
            val = val / 1000;
            unit = 'uF'
        }
        val = val.toFixed(2) + ' ' + unit;
        setValue(val);
        await green_led_off(port);
    }

    return (
        <div className=" flex flex-col flex-grow gap-5">
            <div className="font-black text-4xl ">Capacitor Measurement</div>
            <div
                className="flex flex-row   w-1/2 py-1 gap-4 items-start justify-stretch "
            >
                <img src={capacitor_logo} className='h-1/2'></img>
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