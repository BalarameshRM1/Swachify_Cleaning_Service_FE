import { useEffect} from "react"
import { getUserDetails } from "../utils/helpers/storage"
import { useNavigate } from "react-router-dom";

export const ProtectedRoutes = (prop:any) =>{
     const navigate = useNavigate()
    
        useEffect(()=>{
            // let userData:any = getUserDetails('user')
                navigate('/app/dashboard')
                
            // if(userData != null){
            //     navigate('/app/dashboard')
            // }else{
            //     navigate('/landing')
            //     navigate('/landing')
            // }
    
        },[])
        

    return <>{prop.children}</>
}