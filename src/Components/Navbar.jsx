import { Link } from "react-router-dom";
import { SerialPortContext } from "../Pages/Parent";
import { useContext } from "react";
import { create_serial_port, destroy_serial_port } from "../Utilities/Serial_Port";
const ESP_USB_VENDOR_ID = 4292;

export default function Navbar() {
    const { port, setPort } = useContext(SerialPortContext);
    function connect() {
        if (port == null) {
            create_serial_port(115200, ESP_USB_VENDOR_ID).then((port) => {
                console.log(port.getInfo())
                setPort(port);
            });
        } else {
            destroy_serial_port(port).then(() => {
                setPort(null);
            });
        }
    }
    return (
        <nav className="bg-zinc-950">
            <ul className="flex flex-row p-2 text-zinc-50 font-bold justify-item-center">
                <li className="basis-24">
                    <Link to="/">Home</Link>
                </li>
                <li className="basis-24">
                    <Link to="/about">About</Link>
                </li>
                <li className="w-full"></li>
                <li onClick={connect}><button> {(port == null) ? "🗲" : "⬜"}</button></li>
            </ul>
        </nav>
    );
}   