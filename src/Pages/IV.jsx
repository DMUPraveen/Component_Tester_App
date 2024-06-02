import { useContext } from "react"
import { SerialPortContext } from "./Parent"
import { read_serial_port, write_serial_port } from "../Utilities/Serial_Port";


export default function IV() {
    const { port, setPort } = useContext(SerialPortContext);
    async function on_click2() {
        if (port == null) {
            console.log("Port is null")
            return;
        }
        await write_serial_port(port, new Uint8Array([0x01]));
        console.log("Serial Port Written");
        let buffer = new ArrayBuffer(1);
        await read_serial_port(port, buffer);
        console.log(buffer);

    }
    return (
        <>
            <div>IV</div>
            <button onClick={on_click2}>IV</button>
        </>
    )
}