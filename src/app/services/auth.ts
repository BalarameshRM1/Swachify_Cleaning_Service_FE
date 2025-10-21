import { baseUrl } from "../../utils/constants/config";

export const getAllUsers = async() =>{
    try {
        const response = await fetch(`${baseUrl}/User/getallusers`);
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}

export const getAllUsersById = async(userId:any) =>{
    try {
        const response = await fetch(`${baseUrl}/User/getuserbyid?id=${userId}`);
        if (!response.ok) throw new Error("Failed to getAllUsersById");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error getAllUsersById:", error);
    }
}

export const getAllDepartments = async() =>{
    try {
        const response = await fetch(`${baseUrl}/Master/getalldepartments`);
        if (!response.ok) throw new Error("Failed to getAllDepartments");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error getAllDepartments:", error);
    }
}

export const getAllServices = async() =>{
    try {
        const response = await fetch(`${baseUrl}/Master/getallservices`);
        if (!response.ok) throw new Error("Failed to getAllServices");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error getAllServices:", error);
    }
}

export const getAlllocations = async() =>{
    try {
        const response = await fetch(`${baseUrl}/Master/getalllocations`);
        if (!response.ok) throw new Error("Failed to getAlllocations");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error getAlllocations:", error);
    }
}

export const getAllRoles = async() =>{
    try {
        const response = await fetch(`${baseUrl}/Master/getallroles`);
        if (!response.ok) throw new Error("Failed to getAllRoles");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error getAllRoles:", error);
    }
}

export const getAllSlots = async() =>{
    try {
        const response = await fetch(`${baseUrl}/Master/getallslots`);
        if (!response.ok) throw new Error("Failed to getAllSlots");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error getAllSlots:", error);
    }
}

export const sendOtp = async(mobileNumber:any) =>{
    try {
        const options:any = {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
        }
        const response = await fetch(`${baseUrl}/Otp/send?phoneNumber=${mobileNumber}`,options);
        if (!response.ok) throw new Error("Failed to sendOtp");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error sendOtp:", error);
    }
}

export const otpVerify = async(mobileNumber:any,otp:any) =>{
    try {
        const options:any = {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
        }
        const response = await fetch(`${baseUrl}/Otp/verify?phoneNumber=${mobileNumber}&code=${otp}`,options);
        if (!response.ok) throw new Error("Failed to otpVerify");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error otpVerify:", error);
    }
}

export const createEmployee = async (
  first_name: string,
  last_name: string,
  email: string,
  mobile: string,
  dept_id: number,
  role_id: number,
  location_id: number,
  services: string[]
) => {
  try {
    const payload = {
      empCommandDto: {
        first_name,
        last_name,
        email,
        mobile,
        dept_id,
        role_id,
        location_id,
        services
      }
    };

    const response = await fetch(`${baseUrl}/User/createemployee`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("❌ Server validation error:", err);
      throw new Error("Failed to createEmployee");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error createEmployee:", error);
    throw error;
  }
};


export const serviceForm = async(bookingId:any ,deptId:any ,serviceId:any,slotId:any,createdBy:any,first_name:any ,modifiedBy:any ,email:any ,mobile:any ,location:any ,services:any,isActive:any, preferredDate:any, ) =>{
    try {
        const options:any = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ bookingId, deptId, serviceId, slotId, createdBy, first_name, modifiedBy, email, mobile, location, services, isActive, preferredDate }),
        }
        const response = await fetch(`${baseUrl}/Booking`,options);
        if (!response.ok) throw new Error("Failed to createBooking");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error createBooking:", error);
    }
}

// bookings api
export const getallBookings = async() =>{
    try {
        const response = await fetch(`${baseUrl}/Booking/getall`);
        if (!response.ok) throw new Error("Failed to getAllBookings");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error getAllBookings:", error);
    }
}