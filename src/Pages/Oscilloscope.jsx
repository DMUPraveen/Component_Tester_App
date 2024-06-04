import { useRef } from "react"
import { useEffect } from "react";
import { useState } from "react";
import DrawChart from "../Utilities/Draw_Chart";

export default function Oscilloscope() {
    const canvasRef = useRef(null);
    const x_val = Array.from({ length: 10001 }, (_, i) => i - 100);
    const chartref = useRef(null);

    function update_function() {
        setInterval(() => {
            if (chartref.current == null) return;
            let y_val = Array.from({ length: 10001 }, (_, i) => Math.random() / 10);
            chartref.current.data.labels = x_val;
            chartref.current.data.datasets[0].data = y_val;
            chartref.current.update('none');
        }, 1);
    }
    useEffect(() => { update_function() }, []);
    useEffect(() => { return DrawChart(canvasRef, x_val, x_val, chartref) });
    return (
        <canvas ref={canvasRef}></canvas>
    )
}