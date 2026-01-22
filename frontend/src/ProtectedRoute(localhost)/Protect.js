import { Navigate }  from "react-router-dom";

const Protect=({children})=>{
    const auth=localStorage.getItem("token");
    if(!auth) return <Navigate to="/login" replace/>
    return children;
};

export default Protect;