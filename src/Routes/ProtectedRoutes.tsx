import React, { useEffect} from "react"
import { getUserDetails } from "../utils/helpers/storage"
import { useNavigate, useLocation } from "react-router-dom";

export const ProtectedRoutes = (prop:any) =>{
     const navigate = useNavigate()
    
        useEffect(()=>{
            let userData:any = getUserDetails('user')
    
            if(userData != null){
                navigate('/app/dashboard')
            }else{
                navigate('/landing')
            }
    
        },[])
        

    return <>{prop.children}</>
}