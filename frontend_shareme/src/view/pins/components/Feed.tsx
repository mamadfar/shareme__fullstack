import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import MasonryLayout from "../../../layout/MasonryLayout";
import {IPin} from "../../../model/pin.model";
import {getPinsService} from "../../../service/pins.service";
import {Spinner} from "../../../components";

const Feed = () => {

    const [loading, setLoading] = useState(false);
    const [pins, setPins] = useState<ReadonlyArray<IPin>>([]);
    const {categoryId} = useParams();

    const getPins = async () => {
        setLoading(true);
        try {
            const res = await getPinsService(categoryId)
            setPins(res);
            setLoading(false);
        } catch (e) {
            setLoading(false);
            console.log(e);
        }
    }

    useEffect(() => {
        getPins();
    }, [categoryId])

    if (loading) return <Spinner message="We are adding new ideas to your feed!"/>
    if (!pins?.length) return <h2>No Pins Available!</h2>
    return (
        <div>
            {pins && <MasonryLayout pins={pins}/>}
        </div>
    )
};

export default Feed;
