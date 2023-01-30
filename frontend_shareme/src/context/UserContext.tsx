import {createContext} from "react";
import {IUser} from "../model/user.model";

interface IUserContext {
    user: IUser | null,
    isLoading: boolean
}

export const UserContext = createContext<IUserContext>({
    user: null,
    isLoading: false
});
