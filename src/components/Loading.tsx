import React from "react";
import { ReactSVG } from "react-svg";

import loading from "@/icons/loading.svg";

const Loading: React.FC = () => {
    return (
        <div className="loading w-5 h-5 ml-auto mr-auto">
            <ReactSVG src={loading}/>
        </div>
    );
}

export default Loading;
