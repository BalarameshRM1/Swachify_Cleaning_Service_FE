import React, { useEffect} from "react"
import { getUserDetails } from "../utils/helpers/storage"
import { redirect } from "react-router-dom";

export const ProtectedRoutes = (prop:any) =>{

    useEffect(()=>{
        let userData:any = getUserDetails()

        if(userData != null){
            redirect('/app/dashboard')
        }

    },[])

    return <>{prop.children}</>
}