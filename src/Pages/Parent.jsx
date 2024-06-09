
import { Outlet } from "react-router-dom"
import Navbar from "../Components/Navbar"
import { useState, createContext } from "react"

export const SerialPortContext = createContext(null);
export const SerialReaderContext = createContext(null);

export default function () {
    const [port, setPort] = useState(null);
    return (
        <SerialPortContext.Provider value={{ port, setPort }}>
            <div className="flex flex-col h-screen bg-white">
                <Navbar />
                <Outlet />
            </div>
        </SerialPortContext.Provider>
    )
}
