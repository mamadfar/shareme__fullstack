import {FC, ReactNode} from 'react';
import './App.scss';
import {Navigate, Route, Routes} from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import UserProvider from "./hooks/UserProvider";
import {Login, NotFount, Pins, UserProfile} from "./view";
import {CreatePin, Feed, PinDetail, Search} from "./view/pins/components";

const Guard: FC<{ children: ReactNode }> = ({children}) => {
    const isAuthenticated = !!localStorage.getItem("user");

    if (!isAuthenticated) {
        return <Navigate to={"/login"} replace={true}/>
    }
    return (
        <UserProvider>
            <MainLayout>{children}</MainLayout>
        </UserProvider>
    )
};

const App = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/" element={<Guard><Pins/></Guard>}>
                <Route index={true} path="" element={<Feed/>}/>
                <Route path={"category/:categoryId"} element={<Feed/>}/>
                <Route path={"pin-detail/:pinId"} element={<PinDetail/>}/>
                <Route path={"create-pin"} element={<CreatePin/>}/>
                <Route path={"search"} element={<Search/>}/>
            </Route>
            <Route path="/user-profile/:userId" element={<Guard><UserProfile/></Guard>}/>
            <Route path={"*"} element={<NotFount/>}/>
        </Routes>
    );
}

export default App;
