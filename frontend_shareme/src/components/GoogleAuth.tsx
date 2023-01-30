import {FC} from "react";
import {GoogleLogout, GoogleLogin, GoogleLoginProps, GoogleLogoutProps} from "react-google-login";
import {AiOutlineLogout} from "react-icons/ai";
import {FcGoogle} from "react-icons/fc";

interface IGoogleAuth extends Omit<GoogleLoginProps, "clientId">{
    operation: ("LOGIN" | "LOGOUT")
}

const GoogleAuth:FC<IGoogleAuth & (Omit<GoogleLogoutProps, "clientId">)> = ({operation, ...props}) => {
    if (operation === "LOGIN") {
        return (
            <GoogleLogin
                clientId={process.env.REACT_APP_GOOGLE_API_TOKEN as string}
                {...props}
                cookiePolicy="single_host_origin"
                render={(renderProps) => (
                    <button onClick={() => renderProps.onClick()} disabled={renderProps.disabled}
                            type="button"
                            className="bg-mainColor flex justify-center items-center py-2 px-3 rounded-md mt-1 cursor-pointer outline-none text-sm w-full">
                        <FcGoogle className="text-xl "/><span className="mx-auto">Sign in with Google</span>
                    </button>
                )}
            />
        )
    }
    return (
        <GoogleLogout
            clientId={process.env.REACT_APP_GOOGLE_API_TOKEN as string}
            {...props}
            render={(renderProps) => (
                <button onClick={() => renderProps.onClick()}
                        disabled={renderProps.disabled}
                        type="button"
                        className="bg-white p-2 rounded-full cursor-pointer outline-none shadow-md">
                    <AiOutlineLogout color="red" fontSize={21}/>
                </button>
            )}
        />
    )
};

export default GoogleAuth;
