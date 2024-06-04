import { useRef } from "react"
import DrawChart from "../Utilities/Draw_Chart";

export default function Oscilloscope() {
    const canvasRef = useRef(null);
    useEffect(() => { return DrawChart(canvasRef) });
    return (
        <canvas ref={canvasRef}></canvas>
    )
}