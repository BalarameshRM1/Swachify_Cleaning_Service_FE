import { useEffect} from "react"
import { getUserDetails } from "../utils/helpers/storage"
import { useNavigate } from "react-router-dom";

export const ProtectedRoutes = (prop:any) =>{
     const navigate = useNavigate()
    
        useEffect(()=>{
                navigate('/app/dashboard')

            // let userData:any = getUserDetails('user')
    
            // if(userData != null){
            //     navigate('/app/dashboard')
            // }else{
            //     navigate('/landing')
            // }
    
        },[])
        

    return <>{prop.children}</>
}