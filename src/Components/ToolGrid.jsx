
import Tool from "./Tool"

import IV_logo from '../assets/IV_logo.png'
import IVX_logo from '../assets/IVX_logo.png'
import bode_logo from '../assets/bode_logo.png'
import function_generator_logo from '../assets/function_generator_logo.png'
import oscilloscope_logo from '../assets/oscilloscope_logo.png'
import logic_analyzer_logo from '../assets/logic_analyzer_logo.png'
import resistor_logo from '../assets/resistor_logo.png'
import capacitor_logo from '../assets/capacitor_logo.png'
import inductor_logo from '../assets/inductor_logo.png'
import diode_logo from '../assets/diode_logo.png'
import transistor_logo from '../assets/transistor_logo.png'
import mosfet_logo from '../assets/mosfet_logo.png'
import op_amp_logo from '../assets/op_amp_logo.png'
import leg_2_logo from '../assets/2_legged_logo.png'
import leg_3_logo from '../assets/3_legged_logo.png'


export function ToolGrid_General() {

    return (
        <div className="grid grid-cols-3 gap-4 justify-items-center h-2/6 content-center bg-zinc-150">
            <Tool tool_logo={IV_logo} tool_name="I-V" />
            <Tool tool_logo={IVX_logo} tool_name="I-V X" />
            <Tool tool_logo={bode_logo} tool_name="bode" />
            <Tool tool_logo={function_generator_logo} tool_name="function generator" to="signalGenerator" />
            <Tool tool_logo={oscilloscope_logo} tool_name="Oscilloscope" />
            <Tool tool_logo={logic_analyzer_logo} tool_name="Logic Analyzer" />
        </div>
    )
}

export function ToolGrid_Component() {

    return (
        <div className="grid grid-cols-3 gap-4 justify-items-center h-2/4 content-center bg-zinc-150">
            <Tool tool_logo={resistor_logo} tool_name="reisto" />
            <Tool tool_logo={capacitor_logo} tool_name="capacitor" />
            <Tool tool_logo={inductor_logo} tool_name="inductor" />
            <Tool tool_logo={diode_logo} tool_name="diode" />
            <Tool tool_logo={transistor_logo} tool_name="bjt" />
            <Tool tool_logo={mosfet_logo} tool_name="fet" />
            <Tool tool_logo={op_amp_logo} tool_name="op_amp" />
            <Tool tool_logo={leg_2_logo} tool_name="leg_2" />
            <Tool tool_logo={leg_3_logo} tool_name="leg_3" />
        </div>
    )
}