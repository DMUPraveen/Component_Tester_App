import { ssrModuleExportsKey } from "vite/runtime";
const SINE_WAVE_COMMAND = 10
const ARBITRARY_WAVE_COMMAND = 11
const ARBITRARY_WAVE_BUFFER_SIZE = 2048
export function cosine_wave(freq, amplitude) {
    //create an array of bytes first byte is 1 second byte is 0 next four bytes is the frequency
    // in little endian format and final byte is the amplitude

    let buffer = new ArrayBuffer(7);
    let view = new DataView(buffer);
    view.setUint8(0, SINE_WAVE_COMMAND);
    view.setUint32(1, freq, true);
    view.setUint8(5, amplitude);
    return buffer;
}



const MAX_FREQ = 1000000;
export let clamper = (x) => {
    if (x > 1) { return 1; }
    if (x < 0) { return 0; }
    return x;
}
export function arbitrary_wave_extended(freq, func) {
    /*
    This function takes in a frequency, and a function that maps [0,1]->[0,1]
    and returns a buffer that can be sent to the signal generator to generate the wave
    */

    let samples = ARBITRARY_WAVE_BUFFER_SIZE;
    let sampling_frequency = samples * freq;
    if (sampling_frequency > MAX_FREQ) {
        sampling_frequency = MAX_FREQ;
        samples = Math.floor(MAX_FREQ / freq);
    }
    let time_array = Array.from({ length: samples }, (x, i) => i / samples);
    let wave = Array.from(time_array, (x) => Math.floor(clamper(func(x)) * 255));
    console.log(wave)
    let buffer = new ArrayBuffer(9 + ARBITRARY_WAVE_BUFFER_SIZE);
    let view = new DataView(buffer);
    view.setUint8(0, ARBITRARY_WAVE_COMMAND);
    // view.setUint8(1, 2);
    view.setUint32(1, sampling_frequency, true);
    view.setUint32(5, wave.length, true);
    //no amplitude
    for (let i = 0; i < wave.length; i++) {
        view.setUint8(9 + i, wave[i]);
    }
    return buffer;


}