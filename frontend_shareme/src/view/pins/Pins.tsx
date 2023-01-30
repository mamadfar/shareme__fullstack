import {FC, useState} from "react";
import {useUser} from "../../hooks/UserProvider";
import {Navbar, Spinner} from "../../components";
import {Outlet, useOutletContext} from "react-router-dom";

export const useSearchOutlet = () => {
    return useOutletContext<{searchTerm: string | null}>();
}

const Pins: FC = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const {user, isLoading} = useUser();

    if (isLoading) return <Spinner/>

    return (
        <div className="px-2 md:px-5">
            <div className="bg-gray-50">
                <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} user={user}/>
            </div>
            <div className="h-full">
                <Outlet context={{searchTerm}}/>
            </div>
        </div>
    )
};
export default Pins;
