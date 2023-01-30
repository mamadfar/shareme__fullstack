import {Link} from "react-router-dom";

const NotFount = () => {
    return (
        <div className="flex flex-col justify-center items-center h-screen h-full">
            <h1 className="font-bold text-9xl">404</h1>
            <Link to={"/"} className="border rounded px-2 py-1 hover:bg-black hover:text-white transition-colors">Home</Link>
        </div>
    )
};

export default NotFount;
