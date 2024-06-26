import { ssrModuleExportsKey } from "vite/runtime";

export function cosine_wave(freq, amplitude) {
    //create an array of bytes first byte is 1 second byte is 0 next four bytes is the frequency
    // in little endian format and final byte is the amplitude

    let buffer = new ArrayBuffer(7);
    let view = new DataView(buffer);
    view.setUint8(0, 1);
    view.setUint8(1, 0);
    view.setUint32(2, freq, true);
    view.setUint8(6, amplitude);
    return buffer;
}


export function arbitrary_wave(freq, wave) {
    //create an array of bytes first byte is 1 second byte is 2 next four bytes is the frequency
    // the next bytes is the wave values as uint8
    //thats it
    const wave_sample_length = 2048;
    wave = new Array(wave_sample_length);
    for (let i = 0; i < wave_sample_length; i++) { wave[i] = Math.floor(Math.abs(Math.sin(i / wave_sample_length * 2 * Math.PI)) * 120) };
    console.log(wave);
    let buffer = new ArrayBuffer(10 + wave.length);
    let view = new DataView(buffer);
    view.setUint8(0, 1);
    view.setUint8(1, 2);
    view.setUint32(2, freq, true);
    view.setUint32(6, wave.length, true);
    //no amplitude
    for (let i = 0; i < wave.length; i++) {
        view.setUint8(10 + i, wave[i]);
    }
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

    let samples = 2048;
    let sampling_frequency = samples * freq;
    if (sampling_frequency > MAX_FREQ) {
        sampling_frequency = MAX_FREQ;
        samples = Math.floor(MAX_FREQ / freq);
    }
    let time_array = Array.from({ length: samples }, (x, i) => i / samples);
    let wave = Array.from(time_array, (x) => Math.floor(clamper(func(x)) * 255));
    console.log(wave)
    let buffer = new ArrayBuffer(10 + wave.length);
    let view = new DataView(buffer);
    view.setUint8(0, 1);
    view.setUint8(1, 2);
    view.setUint32(2, sampling_frequency, true);
    view.setUint32(6, wave.length, true);
    //no amplitude
    for (let i = 0; i < wave.length; i++) {
        view.setUint8(10 + i, wave[i]);
    }
    return buffer;


}