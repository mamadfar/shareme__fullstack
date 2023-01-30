import {IUser} from "./user.model";

export interface IPin {
    _id: string,
    postedBy: IUser,
    image: string,
    destination: string,
    save?: {
        postedBy: { _id: string },
    }[]
}
