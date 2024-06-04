import { read_serial_port, write_serial_port } from "./Serial_Port";

export async function get_pulse_measurement(port) {
    if (port == null) {
        console.log("Port is null")
        return;
    }

    await write_serial_port(port, new Uint8Array([101]));
    let buffer = new ArrayBuffer(4);

    buffer = await read_serial_port(port, buffer, 4);
    //convert the buffer to a float
    const view = new DataView(buffer);
    const value = view.getFloat32(0, true);
    return value;

}