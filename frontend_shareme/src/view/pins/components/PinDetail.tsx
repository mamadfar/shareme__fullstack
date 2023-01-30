import {useState, useEffect, useCallback, SyntheticEvent} from "react";
import {useParams, Link} from "react-router-dom";
import {useUser} from "../../../hooks/UserProvider";
import {MdDownloadForOffline} from "react-icons/md";
import {v4 as uuidv4} from "uuid";
import {client, urlFor} from "../../../client";
import MasonryLayout from "../../../layout/MasonryLayout";
import {pinDetailMorePinQuery, pinDetailQuery} from "../../../utils/data";
import {Spinner} from "../../../components";
import {IPin} from "../../../model/pin.model";

const PinDetail = () => {

    const [pins, setPins] = useState<ReadonlyArray<IPin>>([]);
    const [pinDetail, setPinDetail] = useState<any>(null);
    const [comment, setComment] = useState("");
    const [addingComment, setAddingComment] = useState(false);

    const {user} = useUser();
    const {pinId} = useParams();

    const fetchPinDetails = useCallback(async (cache = true) => {
        let query = pinDetailQuery(pinId || "");
        if (query) {
            const data = await client.config({
                useCdn: cache
            }).fetch(query);
            setPinDetail(data[0]);
            if (data[0]) {
                query = pinDetailMorePinQuery(data[0]);
                const res = await client.fetch(query);
                setPins(res);
            }
        }
    }, [pinDetail]);

    const addComment = async () => {
        if (comment) {
            setAddingComment(true);
            await client.patch(pinId || "").setIfMissing({comments: []}).insert("after", "comments[-1]", [{
                comment,
                _key: uuidv4(),
                postedBy: {
                    _type: "postedBy",
                    _ref: user?._id
                }
            }]).commit();
            await fetchPinDetails(false);
            setComment("");
            setAddingComment(false);
        }
    };

    useEffect(() => {
        fetchPinDetails();
    }, [pinId]);

    if (!pinDetail) return <Spinner message="Loading Pin..."/>

    return (
        <>
            <div className="flex xl-flex-row flex-col m-auto bg-white" style={{maxWidth: 1500, borderRadius: 32}}>
                <div className="flex justify-center items-center md:items-start flex-initial">
                    <img src={pinDetail?.image && urlFor(pinDetail.image).url()} alt="user-post"
                         className="rounded-t-3xl rounded-b-lg"/>
                </div>
                <div className="w-full p-5 flex-1 xl:min-w-620">
                    <div className="flex items-center justify-between">
                        <div className="flex gap-2 items-center">
                            <a download href={`${urlFor(pinDetail.image).url()}?dl=`}
                               onClick={(e: SyntheticEvent) => e.stopPropagation()}
                               className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-black text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                            >
                                <MdDownloadForOffline/>
                            </a>
                        </div>
                        <a href={pinDetail?.destination} target="_blank" rel="noreferrer">{pinDetail?.destination}</a>
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold break-words mt-3">{pinDetail?.title}</h1>
                        <p className="mt-3">{pinDetail.about}</p>
                    </div>
                    <Link to={`/user-profile/${pinDetail.postedBy?._id}`}
                          className="flex items-center gap-2 mt-5 bg-white rounded-lg">
                        <img src={pinDetail.postedBy?.image} alt={user?.userName}
                             className="w-8 h-8 rounded-full object-cover"/>
                        <p className="font-semibold capitalize">{pinDetail.postedBy?.userName}</p>
                    </Link>
                    <h2 className="mt-5 text-2xl">Comments</h2>
                    <div className="max-h-370 overflow-y-auto">
                        {pinDetail?.comments?.map((comment: any, index: number) => (
                            <div key={index} className="flex gap-2 mt-5 items-center bg-white rounded-lg">
                                <img src={comment.postedBy.image} alt="user-profile"
                                     className="w-10 h-10 rounded-full cursor-pointer"/>
                                <div className="flex flex-col">
                                    <p className="font-bold">{comment.postedBy.userName}</p>
                                    <p>{comment.comment}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-wrap mt-6 gap-3">
                        <Link to={`/user-profile/${pinDetail.postedBy?._id}`}>
                            <img src={pinDetail.postedBy?.image} alt={user?.userName}
                                 className="w-10 h-10 rounded-full cursor-pointer"/>
                        </Link>
                        <input type="text"
                               className="flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
                               placeholder="Add a comment"
                               value={comment} onChange={e => setComment(e.target.value)}/>
                        <button type="button"
                                className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
                                onClick={addComment}>
                            {addingComment ? "Posting the comment..." : "Post"}
                        </button>
                    </div>
                </div>
            </div>
            {pins.length > 0 ? (
                <>
                    <h2 className="text-center font-bold text-2xl mt-8 mb-4">More Like This</h2>
                    <MasonryLayout pins={pins}/>
                </>
            ) : <Spinner message="Loading more pins..."/>}
        </>
    )
};

export default PinDetail;
