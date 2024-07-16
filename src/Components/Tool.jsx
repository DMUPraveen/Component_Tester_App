import { Link } from 'react-router-dom'
import IV_logo from '../assets/IV_logo.png'

export default function Tool({ tool_logo = IV_logo, tool_name = "I-V", to = "/iv", additional_classes = "" }) {

    return (
        <Link to={to} className={"flex flex-col w-3/5 aspect-square justify-center items-center\
         bg-white \
         border-2  rounded-lg \
         hover:border-zinc-400\
         drop-shadow-lg\
         "+ additional_classes}>
            <img src={tool_logo} alt="IV_logo" className='p-1 w-4/5' />
            <p className="font-black text-lg text-center">{tool_name}</p>
        </Link>
    )


}
