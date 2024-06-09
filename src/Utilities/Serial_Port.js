
export async function create_serial_port(baud_rate = 115200) {
    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: baud_rate });
    return port;
}

export async function destroy_serial_port(port) {
    await port.close();
}

export async function read_serial_port(port, buffer, size) {
    let offset = 0;
    let reader = null;
    console.log(buffer.byteLength);
    let bufferView = new Uint8Array(buffer, 0);
    try {

        reader = await port.readable.getReader();
    }
    catch (error) {
        console.error(error);
        return null;
    }
    if (reader == null) return null;
    try {
        while (offset < size) {
            const { value, done } = await reader.read(
                // new Uint8Array(buffer, offset)
            );
            if (done) {
                break;
            }
            // buffer = value.buffer;
            // console.log(buffer);
            let valueView = new Uint8Array(value);
            // console.log("value");
            // console.log(value);
            // console.log(bufferView);
            // console.log(size, offset);
            // console.log("value end");
            bufferView.set(valueView, offset);
            offset += value.byteLength;
        }
        // console.log("returning")
        reader.releaseLock();
        console.log(buffer);
        return buffer
    }
    catch (error) {
        console.log(error);
        reader.releaseLock();
    } finally {
        reader.releaseLock();
    }
}

export async function write_serial_port(port, data) {
    const writer = port.writable.getWriter();
    await writer.write(data);
    // console.log(data);
    writer.releaseLock();
}

