import {FC, SyntheticEvent, useCallback, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {v4 as uuidv4} from "uuid";
import {MdDownloadForOffline} from "react-icons/md";
import {AiTwotoneDelete} from "react-icons/ai";
import {BsFillArrowUpRightCircleFill} from "react-icons/bs";
import {urlFor, client} from "../../../client";
import {IPin} from "../../../model/pin.model";
import {useUser} from "../../../hooks/UserProvider";
import {deletePinService, savePinService} from "../../../service/pins.service";

interface IPinProps {
    pin: IPin,
    className: string
}

const Pin: FC<IPinProps> = ({pin, className}) => {

    const [postHovered, setPostHovered] = useState(false);
    // const [savingPost, setSavingPost] = useState(false);

    const navigate = useNavigate();
    const {user} = useUser();
    const {postedBy, image, _id, destination, save} = pin;
    const alreadySaved: boolean = !!save?.filter((item) => item?.postedBy?._id === user?._id)?.length

    const savePin = useCallback(async (e: SyntheticEvent, id: string) => {
        e.stopPropagation();
        if (!alreadySaved) {
            await savePinService(id, user);
            window.location.reload();
        }
    }, []);

    const deletePin = useCallback(async (e: SyntheticEvent, id: string) => {
        e.stopPropagation();
        await deletePinService(id);
        window.location.reload();
    }, []);

    return (
        <div className="mt-2">
            <div
                className="relative m-2 cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
                onMouseEnter={() => setPostHovered(true)}
                onMouseLeave={() => setPostHovered(false)}
                onClick={() => navigate(`/pin-detail/${_id}`)}
            >
                <img
                    src={urlFor(image).width(250).url()}
                    alt={`Posted By: ${postedBy?.userName}`}
                    className="rounded-lg w-full"/>
                {postHovered && (
                    <div
                        className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 py-2 z-50">
                        <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                                <a download href={`${urlFor(image).url()}?dl=`}
                                   onClick={(e: SyntheticEvent) => e.stopPropagation()}
                                   className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-black text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                                >
                                    <MdDownloadForOffline/>
                                </a>
                            </div>
                            <button onClick={(e: SyntheticEvent) => savePin(e, _id)}
                                    type="button"
                                    className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none">{alreadySaved ? `${save?.length} Saved` : "Save"}</button>
                            {/*{alreadySaved ? (*/}
                            {/*    <button*/}
                            {/*        type="button"*/}
                            {/*        className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none">{save?.length}Saved</button>*/}
                            {/*) : (*/}
                            {/*    <button*/}
                            {/*        onClick={(e: SyntheticEvent) => savePin(e, _id)}*/}
                            {/*        type="button"*/}
                            {/*        className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none">Save</button>*/}
                            {/*)}*/}
                        </div>
                        <div className="flex justify-between items-center gap-2 w-full">
                            {destination && (
                                <a href={destination}
                                   target="_blank"
                                   rel="noreferrer"
                                   className="bg-white flex items-center gap-2 text-black font-bold py-2 px-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md">
                                    <BsFillArrowUpRightCircleFill/>
                                    {destination.length > 15 ? `${destination.slice(0, 15)}...` : destination}
                                </a>
                            )}
                            {postedBy._id === user?._id && (
                                <button type="button"
                                        onClick={(e: SyntheticEvent) => deletePin(e, _id)}
                                        className="bg-white text-black opacity-70 hover:opacity-100 font-bold p-2 text-base rounded-3xl hover:shadow-md outline-none">
                                    <AiTwotoneDelete/>
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <Link to={`/user-profile/${postedBy?._id}`} className="flex items-center gap-2 mt-2">
                <img src={postedBy?.image} alt={user?.userName} className="w-8 h-8 rounded-full object-cover"/>
                <p className="font-semibold capitalize">{postedBy?.userName}</p>
            </Link>
        </div>
    )
};

export default Pin;
