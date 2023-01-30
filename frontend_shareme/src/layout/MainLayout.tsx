import {FC, ReactNode, useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
// import {client} from "../client";
import {Sidebar} from "../components";
// import {userQuery} from "../utils/data";
import {HiMenu} from "react-icons/hi";
import {AiFillCloseCircle} from "react-icons/ai";
import logo from "../assets/logo.png";
import {useUser} from "../hooks/UserProvider";

const MainLayout: FC<{ children: ReactNode }> = ({children}) => {

    const [toggleSidebar, setToggleSidebar] = useState(false);
    // const [user, setUser] = useState<any>(null);
    const scrollRef = useRef<HTMLDivElement>(null!);
    const {user} = useUser();

    // const userInfo = typeof localStorage.getItem("user") !== "undefined" ? JSON.parse(localStorage.getItem("user") as string) : localStorage.clear();

    // useEffect(() => {
    //     const getUserDetails = async () => {
    //         const query = userQuery(userInfo?.googleId);
    //         const result = await client.fetch(query);
    //         setUser(result[0]);
    //     };
    //     getUserDetails();
    // }, []);

    useEffect(() => {
        scrollRef.current.scrollTo(0, 0);
    }, [])

    return (
        <div className="flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out">
            <div className="hidden md:flex h-screen flex-initial">
                <Sidebar user={user && user}/>
            </div>
            <div className="flex md:hidden flex-row">
                <div className="p-2 w-full flex flex-row justify-between items-center shadow-md">
                    <HiMenu fontSize={40} className="cursor-pointer" onClick={() => setToggleSidebar(true)}/>
                    <Link to={"/"}>
                        <img src={logo} alt="Logo" className="w-28"/>
                    </Link>
                    <Link to={`/user-profile/${user?._id}`}>
                        <img src={user?.image} alt={user?.userName} className="w-28"/>
                    </Link>
                </div>
                {toggleSidebar && (
                    <div className="fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
                        <div className="absolute w-full flex justify-end items-center p-2">
                            <AiFillCloseCircle fontSize={30} className="cursor-pointer"
                                               onClick={() => setToggleSidebar(false)}/>
                        </div>
                        <Sidebar user={user && user} closeToggle={setToggleSidebar}/>
                    </div>
                )}
            </div>
            <div className="pb-2 flex-1 h-screen overflow-y-scroll" ref={scrollRef}>
                {children}
            </div>
        </div>
    )
};

export default MainLayout;
