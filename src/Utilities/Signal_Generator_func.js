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
    wave = new Array(400);
    for (let i = 0; i < 400; i++) { wave[i] = Math.floor(Math.abs(Math.sin(i / 400 * 2 * Math.PI)) * 255) };
    console.log(wave);
    let buffer = new ArrayBuffer(10 + wave.length);
    let view = new DataView(buffer);
    view.setUint8(0, 1);
    view.setUint8(1, 2);
    view.setUint32(2, 0, true);
    view.setUint32(6, wave.length, true);
    //no amplitude
    for (let i = 0; i < wave.length; i++) {
        view.setUint8(10 + i, wave[i]);
    }
    return buffer;
}