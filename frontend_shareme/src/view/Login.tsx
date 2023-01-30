import {useNavigate} from "react-router-dom";
import shareVideo from "../assets/share.mp4";
import logo from "../assets/logowhite.png";
import {useEffect} from "react";
import {gapi} from "gapi-script";
import {client} from "../client";
import {GoogleAuth} from "../components";

const Login = () => {
    const navigate = useNavigate();

    const responseGoogle = async (res: any) => {
        localStorage.setItem("user", JSON.stringify(res.profileObj));
        const {name, googleId, imageUrl} = res.profileObj;

        const doc = {
            _id: googleId,
            _type: "user", //? schema name in sanity
            userName: name,
            image: imageUrl
        };
        await client.createIfNotExists(doc);
        navigate("/", {replace: true});
    }

    useEffect(() => {
        if (localStorage.getItem("user")) navigate("/", {replace: true});
        //! calling gapi to connect to Google for initializing
        function start() {
            gapi.client.init({
                clientId: process.env.REACT_APP_GOOGLE_API_TOKEN,
                scope: 'email',
            });
        }

        gapi.load('client:auth2', start);
    }, []);

    return (
        <div className="flex justify-start items-center flex-col h-screen">
            <div className="relative w-full h-full">
                <video src={shareVideo} className="w-full h-full object-cover" typeof="video/mp4" loop controls={false}
                       muted autoPlay/>
                <div
                    className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
                    <div className="p-5">
                        <img src={logo} width="130px" alt="Logo"/>
                    </div>
                    <div className="shadow-2xl w-190">
                        <GoogleAuth operation="LOGIN" onSuccess={responseGoogle}
                                    onFailure={() => alert("Something went wrong!")}/>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Login;
