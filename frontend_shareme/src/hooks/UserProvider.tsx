import {FC, ReactNode, useContext, useEffect, useState} from "react";
import {UserContext} from "../context/UserContext";
import {userQuery} from "../utils/data";
import {client} from "../client";
import {IUser} from "../model/user.model";

export const useUser = () => {
    const userContext = useContext(UserContext);

    if (!userContext) throw new Error("Something went wrong!");

    return userContext;
};

const UserProvider: FC<{ children: ReactNode }> = ({children}) => {

    const [user, setUser] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const userInfo = typeof localStorage.getItem("user") !== "undefined" ? JSON.parse(localStorage.getItem("user") as string) : localStorage.clear();

    const getUserDetails = async () => {
        setIsLoading(true);
        try {
            const query = userQuery(userInfo?.googleId);
            const result = await client.fetch(query);
            setUser(result[0] || userInfo);
            setIsLoading(false);
        } catch (e) {
            setIsLoading(false);
            console.log(e);
        }
    };

    useEffect(() => {
        getUserDetails();
    }, []);

    const value = {
        user,
        isLoading
    };
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
};

export default UserProvider;
