import React, { useEffect} from "react"
import { getUserDetails } from "../utils/helpers/storage"
import { useNavigate } from "react-router-dom";

export const ProtectedRoutes = (prop:any) =>{
    const navigate = useNavigate()

    useEffect(()=>{
        let userData:any = getUserDetails()

        if(userData == null){
            navigate('/app/profile')
        }else{
            navigate('/login')
        }

    },[])

    return <>{prop.children}</>
}