import {useState, useEffect, MouseEvent} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {userCreatedPinsQuery, userQuery, userSavedPinsQuery} from "../utils/data";
import {client} from "../client";
import MasonryLayout from "../layout/MasonryLayout";
import {GoogleAuth, Spinner} from "../components";
import {useUser} from "../hooks/UserProvider";
import {IPin} from "../model/pin.model";

const randomImage = "https://source.unsplash.com/1600x900/?nature,photography,technology";
const activeBtnStyle = "bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none";
const notActiveBtnStyle = "bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none";

const UserProfile = () => {

    const [userProfile, setUserProfile] = useState<any>();
    const [pins, setPins] = useState<ReadonlyArray<IPin>>([]);
    const [text, setText] = useState<any>("Created");
    const [activeBtn, setActiveBtn] = useState("created");

    const navigate = useNavigate();
    const {userId} = useParams();
    const {user} = useUser();

    const getUserProfile = async () => {
        const query = userQuery(userId || "");
        const data = await client.fetch(query);
        setUserProfile(data[0]);
    }

    const logout = () => {
        localStorage.clear();
        navigate("/login");
    };

    useEffect(() => {
        getUserProfile();
    }, [userId]);

    useEffect(() => {
        const userCreatedPins = async () => {
            if (text === "created") {
                const createdPinsQuery = userCreatedPinsQuery(userId || "");
                const data = await client.fetch(createdPinsQuery);
                setPins(data);
            } else {
                const savedPinsQuery = userCreatedPinsQuery(userId || "");
                const data = await client.fetch(savedPinsQuery);
                setPins(data);
            }
        };
        userCreatedPins();
    }, [text, userId])

    if (!user) return <Spinner message="Loading Profile..."/>

    return (
        <div className="relative pb-2 h-full justify-center items-center">
            <div className="flex flex-col pb-5">
                <div className="relative flex flex-col mb-7">
                    <div className="flex flex-col justify-center items-center">
                        <img src={randomImage} alt="banner-pic"
                             className="w-full h-370 2xl:h-510 shadow-lg object-cover"/>
                        <img src={userProfile?.image} alt={userProfile?.userName}
                             className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"/>
                        <h1 className="font-bold text-3xl text-center mt-3">{userProfile?.userName}</h1>
                        <div className="absolute top-0 right-0 z-1 p-2">
                            {userId === userProfile?._id && (
                                <GoogleAuth operation="LOGOUT" onLogoutSuccess={logout}/>
                            )}
                        </div>
                    </div>
                    <div className="text-center mb-7">
                        <button
                            type="button" onClick={(e: MouseEvent<any>) => {
                            setText((e.target as HTMLElement).textContent);
                            setActiveBtn("created");
                        }} className={`${activeBtn === "created" ? activeBtnStyle : notActiveBtnStyle}`}>Created
                        </button>
                        <button type="button" onClick={(e: MouseEvent<any>) => {
                            setText((e.target as HTMLElement).textContent);
                            setActiveBtn("saved");
                        }} className={`${activeBtn === "saved" ? activeBtnStyle : notActiveBtnStyle}`}>Saved
                        </button>
                    </div>
                    {pins?.length ? (
                        <div className="px-2">
                            <MasonryLayout pins={pins}/>
                        </div>
                    ) : (
                        <div className="flex justify-center items-center font-bold w-full text-xl mt-2">No Pins
                            Found!</div>
                    )}
                </div>
            </div>
        </div>
    )
};
export default UserProfile;
