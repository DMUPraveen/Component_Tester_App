import { write_serial_port } from "./Serial_Port";
export function simple_clamp(x, min, max) {
    if (x < min) {
        return min;
    }
    if (x > max) {
        return max;
    }
    return x;
}

export async function green_led_on(port) {
    await write_serial_port(port, new Uint8Array([183, 3]));
}


export async function green_led_off(port) {
    await write_serial_port(port, new Uint8Array([183, 1]));
}
