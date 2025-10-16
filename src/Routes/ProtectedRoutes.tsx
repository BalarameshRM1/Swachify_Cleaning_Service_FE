import React, { useEffect} from "react"
import { getUserDetails } from "../utils/helpers/storage"
import { useNavigate, useLocation } from "react-router-dom";

export const ProtectedRoutes = (prop:any) =>{
    // const navigate = useNavigate()
    // const location = useLocation()

    // useEffect(()=>{
    //     let userData: any = getUserDetails()

        if(userData == null){
            navigate('/app/services')
        }else{
            navigate('/login')
        }

    // },[])

    return <>{prop.children}</>
}