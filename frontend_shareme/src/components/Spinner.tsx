import {FC} from "react";
import {Circles} from "react-loader-spinner";

const Spinner:FC<{message?: string}> = ({message}) => {
    return (
        <div className="flex flex-col justify-center items-center w-full h-full">
            <Circles color="#00BFFF" height={50} width={200} wrapperClass="m-5"/>
            {message && <p className="text-lg text-center px-2">{message}</p>}
        </div>
    )
};

export default Spinner;
