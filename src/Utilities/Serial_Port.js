
export async function create_serial_port(baud_rate = 9600) {
    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: baud_rate });
    return port;
}

export async function destroy_serial_port(port) {
    await port.close();
}

export async function read_serial_port(port, buffer) {
    let offset = 0;
    let reader = null;
    try {

        reader = await port.readable.getReader();
    }
    catch (error) {
        console.error(error);
        return null;
    }
    if (reader == null) return null;
    try {
        while (offset < buffer.byteLength) {
            const { value, done } = await reader.read(
                new Uint8Array(buffer, offset)
            );
            if (done) {
                break;
            }
            buffer = value.buffer;
            offset += value.byteLength;
        }
        reader.releaseLock();
        return buffer
    }
    catch (error) {
        reader.releaseLock();
    } finally {
        reader.releaseLock();
    }
}

export async function write_serial_port(port, data) {
    const writer = port.writable.getWriter();
    await writer.write(data);
    writer.releaseLock();
}