import { cosine_wave } from "./Signal_Generator_func";
import { write_serial_port } from "./Serial_Port";


let BODE_SENDING_MAGNITUDE = 0;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export async function read_oscilloscope_stream(reader, port) {

    const data_buffer = new Uint8Array(new ArrayBuffer(1024 * 2));
    if (reader == null) {
        console.log("Reader is null");
        return;
    }
    let offset = 0;
    await write_serial_port(port, new Uint8Array([73]));
    console.log("waiting to read data");
    while (true) {
        const { value, done } = await reader.read();
        if (done) {
            console.log("Reader Done");
        }
        data_buffer.set(new Uint8Array(value.buffer), offset);
        offset += value.buffer.byteLength;
        if (offset >= 1024 * 2) {
            // console.log(offset);
            break;
        }
    }
    let data = new Uint16Array(data_buffer.buffer);
    let y_val = Array.from(data, (byte) => byte / 4096 * 3.3);
    return y_val;
}

export async function oscilloscope_magnitude_estimate(reader, port) {
    let y_val = await read_oscilloscope_stream(reader, port);
    let max = Math.max(...y_val);
    let min = Math.min(...y_val);
    return max - min;
}

export async function get_bode_magnitude(freq, reader, port) {
    /*
        Bode magnitude for a single frequency value
     */
    let buffer = cosine_wave(freq, BODE_SENDING_MAGNITUDE);
    await write_serial_port(port, new Uint8Array(buffer));
    await sleep(100);
    let magnitude = await oscilloscope_magnitude_estimate(reader, port);
    return magnitude;
}

export async function get_total_bode(port) {
    let reader = await port.readable.getReader();
    const DELTA_FREQ = 500;
    const MAX_FREQ = 100000;
    const MIN_FREQ = 500;
    const frequencies = [];
    const magnitudes = []

    for (let freq = MIN_FREQ; freq < MAX_FREQ; freq += DELTA_FREQ) {
        console.log("Running for ", freq)
        let magnitude = await get_bode_magnitude(freq, reader, port);
        console.log(freq, magnitude);
        frequencies.push(freq);
        magnitudes.push(magnitude);
    }
    await reader.cancel();
    return [frequencies, magnitudes];
}

