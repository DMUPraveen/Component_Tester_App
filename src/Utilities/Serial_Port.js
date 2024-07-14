
export async function create_serial_port(baud_rate = 115200, vendor_ids = null) {
    let port = null
    // vendor_ids = null;
    if (vendor_ids == null) {

        port = await navigator.serial.requestPort();
    }
    else {
        console.log(vendor_ids);
        let filters = Array.from(vendor_ids, (id, _) => { return { usbVendorId: id } });
        console.log(filters);
        port = await navigator.serial.requestPort({ filters: filters });
    }
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
            console.log(value);
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

export async function clear_serial_port(port) {
    let reader = null;
    try {
        reader = await port.readable.getReader();
    }
    catch (error) {
        console.error(error);
        return;
    }
    let reader_cancelled = false;
    while (true) {
        const timer = setTimeout(async () => {
            await reader.cancel();
            reader_cancelled = true;
        }, 10);
        const { value, done } = await reader.read(
        );
        if (reader_cancelled) {
            break;
        }
        clearTimeout(timer);
        if (done) {
            break;
        }
        console.log(value)
    }
    await reader.releaseLock();
}