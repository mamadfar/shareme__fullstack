import {useState, useEffect, useCallback} from "react";
import {useSearchOutlet} from "../Pins";
import MasonryLayout from "../../../layout/MasonryLayout";
import {client} from "../../../client";
import {feedQuery, searchQuery} from "../../../utils/data";
import {Spinner} from "../../../components";
import {IPin} from "../../../model/pin.model";

const Search = () => {
    const [pins, setPins] = useState<ReadonlyArray<IPin>>([]);
    const [loading, setLoading] = useState(false);

    const {searchTerm} = useSearchOutlet()

    const getPins = useCallback(async () => {
        if (searchTerm) {
            setLoading(true);
            const query = searchQuery(searchTerm.toLowerCase());
            const data = await client.fetch(query);
            setPins(data);
            setLoading(false);
        } else {
            const data = await client.fetch(feedQuery);
            setPins(data);
            setLoading(false);
        }
    }, [searchTerm]);

    useEffect(() => {
        getPins();
    }, [searchTerm]);

    return (
        <div>
            {loading && <Spinner message="Searching for Pins..."/>}
            {pins?.length ? <MasonryLayout pins={pins}/> : null}
            {(pins?.length === 0 && searchTerm !== "" && !loading) && (
                <div className="mt-10 text-center text-xl">No Pins Found!</div>
            )}
        </div>
    )
};

export default Search;
