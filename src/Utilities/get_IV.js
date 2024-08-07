
import { write_serial_port, read_serial_port } from "./Serial_Port";
const IV_COMMAND = 13;

const GROUND = 0;

const VC = 1

const CC = 2;

export function how_to_connect(Channel1, Channel2, Channel3) {

    return (Channel1 << 0) | (Channel2 << 2) | (Channel3 << 4);
}

export async function set_values(port, connection, voltage, current) {
    // IV_COMMAND|How to connect|Voltage Value| Current Value
    let buffer = new ArrayBuffer(10);
    let view = new DataView(buffer);
    // current = current * 1e6;
    console.log(voltage, current);
    view.setUint8(0, IV_COMMAND);
    view.setUint8(1, connection);
    view.setFloat32(2, voltage, true);
    view.setFloat32(2 + 4, current, true);
    // console.log(buffer)
    await write_serial_port(port, buffer);
    //now we will read voltage and current values for each of the three channels
    //that is 4x6 = 24 bytes
    let data = new ArrayBuffer(24);
    data = await read_serial_port(port, data, 24);
    //convert data to a array of floats
    let view_data = new DataView(data);
    console.log(view_data.length);
    let values = [];
    for (let i = 0; i < 24; i += 4) {
        values.push(view_data.getFloat32(i, true));
    }
    return values;
}


export async function IV_curve_current_control(port, max_current_neg, max_current_pos, data_points) {
    //create an array of values with smallest value -max_current_neg and largest value max_current_pos
    //at intervals of (max_current_pos - max_current_neg)/data_points
    let values = Array.from({ length: data_points }, (_, i) => max_current_neg + i * (max_current_pos - max_current_neg) / data_points);
    //iterate over the values
    let I_values = [];
    let V_values = [];
    for (let current of values) {
        let voltage = 0;
        console.log(current);
        let IV = await set_values(port, how_to_connect(CC, GROUND, GROUND), voltage, current);
        if (current < 1) {
            I_values.push(current)
        }
        else {
            I_values.push(IV[4])
        }
        V_values.push(IV[5]);
    }

    // for (let current of values) {
    //     let voltage = 0;
    //     console.log(current);
    //     let IV = await set_values(port, how_to_connect(GROUND, CC, GROUND), voltage, current);
    //     I_values.push(-IV[4]);
    //     V_values.push(IV[5]);
    // }
    console.log(I_values, V_values);

    await set_values(port, how_to_connect(GROUND, CC, GROUND), 0, 0);
    return [I_values, V_values];
}


export async function IVX_curve_current_control(port, max_current_neg, max_current_pos, data_points) {
    //create an array of values with smallest value -max_current_neg and largest value max_current_pos
    //at intervals of (max_current_pos - max_current_neg)/data_points
    //iterate over the values
    let I_values = [];
    let V_values = [];

    let current_vals = Array.from({ length: 11 }, (_, i) => 50 + i * 20);
    let voltage_vals = Array.from({ length: 30 }, (_, i) => (6.6) / 30 * i);
    for (let current of current_vals) {
        for (let voltage of voltage_vals) {
            let IV = await set_values(port, how_to_connect(GROUND, CC, GROUND), voltage, current);
            I_values.push(IV[2]);
            V_values.push(IV[3]);
        }
    }

    await set_values(port, how_to_connect(GROUND, CC, GROUND), 0, 0);
    return [I_values, V_values];
}

export async function IVX_control(port, max_current_mA, min_current_mA, max_voltage_V, min_voltage_V, data_points_I, data_points_IV) {
    let I_values = [];
    let V_values = [];
    let current_vals = Array.from({ length: data_points_I }, (_, i) => min_current_mA + (max_current_mA - min_current_mA) / data_points_I * i);
    let voltage_vals = Array.from({ length: data_points_IV }, (_, i) => min_voltage_V + (max_voltage_V - min_voltage_V) / data_points_IV * i);
    for (let current of current_vals) {
        for (let voltage of voltage_vals) {
            let IV = await set_values(port, how_to_connect(GROUND, CC, GROUND), voltage, current);
            I_values.push(IV[2]);
            V_values.push(IV[3]);
        }
    }
    await set_values(port, how_to_connect(GROUND, CC, GROUND), 0, 0);

    return [I_values, V_values];
}