import {FC} from "react";
import Masonry from "react-masonry-css";
import Pin from "../view/pins/components/Pin";
import {IPin} from "../model/pin.model";

const breakpointObj: any = {
    default: 4,
    3000: 6,
    2000: 5,
    1200: 3,
    1000: 2,
    500: 1,
}

const MasonryLayout: FC<{ pins: ReadonlyArray<IPin> }> = ({pins}) => {
    return (
        <Masonry className="flex animate-slide-fwd" breakpointCols={breakpointObj}>
            {pins?.map((pin: IPin) => <Pin key={pin._id} pin={pin} className="w-max"/>)}
        </Masonry>
    )
};

export default MasonryLayout;
