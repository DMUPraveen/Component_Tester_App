import { Link } from 'react-router-dom'
import IV_logo from '../assets/IV_logo.png'

export default function Tool({ tool_logo = IV_logo, tool_name = "I-V", to = "/iv" }) {

    return (
        <Link to={to} className="flex flex-col w-1/3 aspect-square justify-center items-center
         bg-white 
         border-2  rounded-lg 
         hover:border-zinc-400
         drop-shadow-lg
         ">
            <img src={tool_logo} alt="IV_logo" className='p-1 w-4/5' />
        </Link>
    )


}
