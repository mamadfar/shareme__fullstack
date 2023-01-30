import {ChangeEvent, FormEvent, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useUser} from "../../../hooks/UserProvider";
import {AiOutlineCloudUpload} from "react-icons/ai";
import {MdDelete} from "react-icons/md";
import {urlFor} from "../../../client";
import {categories} from "../../../utils/data";
import {createPinService, uploadImageService} from "../../../service/pins.service";
import {Spinner} from "../../../components";

const CreatePin = () => {

    const [title, setTitle] = useState<string>("");
    const [about, setAbout] = useState<string>("");
    const [destination, setDestination] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [fields, setFields] = useState<boolean>(false);
    const [category, setCategory] = useState<string>("");
    const [imageAsset, setImageAsset] = useState<any>(null);
    const [wrongImageType, setWrongImageType] = useState<boolean>(false);

    const navigate = useNavigate();
    const {user} = useUser();

    const uploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files && e.target?.files[0];

        if (selectedFile?.type === "image/png" || selectedFile?.type === "image/svg" || selectedFile?.type === "image/jpeg" || selectedFile?.type === "image/gif" || selectedFile?.type === "image/tiff") {
            setWrongImageType(false);
            setLoading(true);
            try {
                const document = await uploadImageService(selectedFile);
                setImageAsset(document);
                setLoading(false);
            } catch (e) {
                console.log("Image upload error: ", e)
            }
        } else {
            setWrongImageType(true);
        }
    };

    const createPin = async () => {
        if (title && about && destination && imageAsset?._id && category) {
            const doc = {
                _type: "pin",
                title,
                about,
                destination,
                image: {
                    _type: "image",
                    asset: {
                        _type: "reference",
                        _ref: imageAsset?._id
                    }
                },
                userId: user?._id,
                postedBy: {
                    _type: "postedBy",
                    _ref: user?._id
                },
                category
            };
            await createPinService(doc);
            navigate("/");
        } else {
            setFields(true);
            setTimeout(() => {
                setFields(false)
            }, 2000)
        }
    }

    return (
        <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
            {fields && (
                <p className="text-red-500 mb-5 text-xl transition-all duration-150 ease-in">
                    Please fill in all the fields.
                </p>
            )}
            <div className="flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full">
                <div className="bg-secondaryColor p-3 flex fle0.7 w-full">
                    <div
                        className="flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420">
                        {loading && <Spinner/>}
                        {wrongImageType && <p>Wrong image type</p>}
                        {!imageAsset ? (
                            <label htmlFor="upload-image" className="w-full h-full cursor-pointer">
                                <div className="flex flex-col items-center justify-center w-full h-full">
                                    <div className="flex flex-col justify-center items-center">
                                        <p className="font-bold text-2xl">
                                            <AiOutlineCloudUpload/>
                                        </p>
                                        <p className="text-lg">Click to upload</p>
                                    </div>
                                    <p className="mt-32 text-gray-400 text-sm">Use high-quality JPG, SVG, PNG, GIF, TIFF
                                        less than 20 MB</p>
                                </div>
                                <input type="file" id="upload-image" name="upload-image" onChange={uploadImage}
                                       className="w-0 h-0"/>
                            </label>
                        ) : (
                            <div className="relative h-full">
                                <img src={urlFor(imageAsset).url()} alt="uploaded-pic" className="h-full w-full"/>
                                <button
                                    type="button"
                                    className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                                    onClick={() => {
                                        setImageAsset(null)
                                    }}>
                                    <MdDelete/>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
                    <input type="text" placeholder="Add your title here" value={title}
                           onChange={e => setTitle(e.target.value)}
                           className="outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2"/>
                    {user && (
                        <div className="flex gap-2 my-2 items-center bg-white rounded-lg">
                            <img src={user.image} alt={user.userName} className="w-10 h-10 rounded-full"/>
                            <p className="font-bold">{user.userName}</p>
                        </div>
                    )}
                    <input type="text" placeholder="What is your pin about" value={about}
                           onChange={e => setAbout(e.target.value)}
                           className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"/>
                    <input type="text" placeholder="Add a destination link" value={destination}
                           onChange={e => setDestination(e.target.value)}
                           className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"/>
                    <div className="flex flex-col">
                        <div>
                            <p className="mb-2 font-semibold text-lg sm:text-xl">Choose pin category</p>
                            <select onChange={e => setCategory(e.target.value)}
                                    className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer">
                                <option value="other" className="bg-white">Select Category</option>
                                {categories.map(category => (
                                    <option key={category.name} value={category.name}
                                            className="text-base border-0 outline-none capitalize bg-white text-black">{category.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end items-end mt-5">
                            <button type="button" onClick={createPin}
                                    className="bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none">
                                Save Pin
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default CreatePin;
