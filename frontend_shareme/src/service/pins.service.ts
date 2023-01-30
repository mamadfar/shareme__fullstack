import {client} from "../client";
import {v4 as uuidv4} from "uuid";
import {IUser} from "../model/user.model";
import {feedQuery, searchQuery} from "../utils/data";

export const getPinsService = (categoryId?: string) => {
    if (categoryId) {
        const query = searchQuery(categoryId);
        return client.fetch(query);
    } else {
        return client.fetch(feedQuery);
    }
};

export const savePinService = (id: string, user: IUser | null) => {
    return client.patch(id).setIfMissing({save: []}).insert("after", "save[-1]", [{
        _key: uuidv4(),
        userId: user?._id,
        postedBy: {
            _type: "postedBy",
            _ref: user?._id
        }
    }]).commit()
}

export const deletePinService = (id: string) => {
    return client.delete(id);
};

export const uploadImageService = (selectedFile: any) => {
    return client.assets.upload("image", selectedFile, {
        contentType: selectedFile?.type,
        filename: selectedFile?.name
    });
};

export const createPinService = (doc: any) => {
    return client.create(doc);
}
