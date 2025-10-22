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

export const createEmployee = async (empData:any) => {
  try {
    const response = await fetch(`${baseUrl}/User/createemployee`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(empData)
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


export const serviceForm = async(bookingId:any ,deptId:any ,serviceId:any,slotId:any,createdBy:any,full_name:any ,modifiedBy:any ,email:any ,phone:any ,address:any ,services:any,isActive:any, preferredDate:any, ) =>{
    try {
        const options:any = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ bookingId, deptId, serviceId, slotId, createdBy, full_name, modifiedBy, email, phone, address, services, isActive, preferredDate }),
        }
        const response = await fetch(`${baseUrl}/Booking`,options);
        if (!response.ok) throw new Error("Failed to createBooking");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error createBooking:", error);
    }
}

export const getallBookings = async() =>{
    try {
        const response = await fetch(`${baseUrl}/Booking/getall`);
        if (!response.ok) throw new Error("Failed to fetch bookings");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching getBookings:", error);
    }
}

export const getallBookingsByUserId = async(id:any) =>{
    try {
        const response = await fetch(`${baseUrl}/Booking/getallbookingsbyuserID?id=${id}`);
        if (!response.ok) throw new Error("Failed to fetch bookings");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching getBookings:", error);
    }
}

export const assignEmployeeToBooking = async (bookingId: number, userId: number) => {
  const response = await fetch(`${baseUrl}/User/assignemployee`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: bookingId,
      user_id: userId,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to assign employee");
  }

  return response.json();
};

// bookings api
export const getallBookingsTest = async(empData:any) =>{
    try {
        const options:any = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(empData),
        }
        const response = await fetch(`${baseUrl}/User/createemployee`,options);
        if (!response.ok) throw new Error("Failed to createEmployee");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error createEmployee:", error);
    }
}

export const deleteBookingById = async(bookingId: number) => {
    try {
        const response = await fetch(`${baseUrl}/Booking/${bookingId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const err = await response.text();
            console.error("❌ Server error:", err);
            throw new Error(err || "Failed to delete booking");
        }
        
       
        return { success: true };

    } catch (error) {
        console.error("Error deleteBookingById:", error);
        throw error; 
    }
}

export const getAllLocations = async() =>{
    try {
        const response = await fetch(`${baseUrl}/Master/getalllocations`);
        if (!response.ok) throw new Error("Failed to fetch locations");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching locations:", error);
    }
}

export const otpSend = async() =>{
    try {
        const response = await fetch(`${baseUrl}/Otp/send`);
        if (!response.ok) throw new Error("Failed to fetch locations");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching locations:", error);
    }
}