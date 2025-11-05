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
export const ForgotPassword = async (id: number, passwordData: { password: string; confirmPassword: string }) => {
  try {
    const response = await fetch(`${baseUrl}/Login/forgotpassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        password: passwordData.password,
        confirmPassword: passwordData.confirmPassword,
      }),
    });

    // Check response
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Password reset failed:", errorText);
      throw new Error(`Password reset failed with status ${response.status}`);
    }

    // Try to parse JSON safely
    const text = await response.text();
    let data = {};
    if (text && text.trim() !== "") {
      try {
        data = JSON.parse(text);
      } catch (parseErr) {
        console.warn("⚠️ Could not parse response JSON:", parseErr);
      }
    }

    console.log("✅ Password updated successfully:", data);
    return { status: response.status, data };
  } catch (error) {
    console.error("Error in ForgotPassword:", error);
    throw error;
  }
};


export const createBooking = async (bookingData: any) => {
  try {
    const response = await fetch(`${baseUrl}/Booking`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...bookingData,
        id: 0,
        createdDate: new Date().toISOString(),
        modifiedDate: new Date().toISOString(),
        isActive: true,
        services: bookingData.services?.map((s: any) => ({
          deptId: s.deptId,
          serviceId: s.serviceId,
          serviceTypeId: s.serviceTypeId,
        })) || [],
      }),
    });

   
    if (response.status < 200 || response.status >= 300) {
      const errorText = await response.text();
      console.error("Booking creation failed:", errorText);
      throw new Error(`Booking creation failed with status ${response.status}`);
    }

  
    const text = await response.text();
    let data = {};
    if (text && text.trim() !== "") {
      try {
        data = JSON.parse(text);
      } catch (parseErr) {
        console.warn("⚠️ Could not parse response JSON:", parseErr);
      }
    }

    console.log("✅ Booking created successfully:", data);
    return { status: response.status, data };
  } catch (error) {
    console.error("Error in createBooking:", error);
    throw error;
  }
};



export const getAllDepartments = async() =>{
    try {
        const response = await fetch(`${baseUrl}/Master/getallmasterData`);
        if (!response.ok) throw new Error("Failed to getAllDepartments");
        const data = await response.json();
        return data.departments || [];
    } catch (error) {
        console.error("Error getAllDepartments:", error);
        return[];
    }
}

export const getAllMasterData = async () => {
  try {
    const response = await fetch(`${baseUrl}/Master/getallmasterData`);
    if (!response.ok) throw new Error("Failed to fetch master data");

    const result = await response.json();
    console.log("Master API result:", result);

    
    return Array.isArray(result?.departments) ? result.departments : [];
  } catch (error) {
    console.error("Error fetching Master Data:", error);
    return [];
  }
};
export const Sendresetlink = async (Email: any) => {
  try {
    const response = await fetch(`${baseUrl}/Login/forgotpasswordlink`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Email),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Failed : ${err}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const createMasterData = async (masterData: any) => {
  try {
    const response = await fetch(`${baseUrl}/Master/createmasterData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(masterData),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Failed to create master data: ${err}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error createMasterData:", error);
    throw error;
  }
};
export const updateMasterData = async (id: number, updatedData: any) => {
  try {
     const response = await fetch(`${baseUrl}/Master/createmasterData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(" Update failed:", errText);
      console.error("GettigDetails",id)
      throw new Error(`Failed to update master data (${response.status})`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updateMasterData:", error);
    throw error;
  }
};


// export const getAllServices = async() =>{
//     try {
//         const response = await fetch(`${baseUrl}/Master/getallservices`);
//         if (!response.ok) throw new Error("Failed to getAllServices");
//         const data = await response.json();
//         return data;
//     } catch (error) {
//         console.error("Error getAllServices:", error);
//     }
// }

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
        const response = await fetch(`${baseUrl}/Master/getallmasterData`);
        if (!response.ok) throw new Error("Failed to getAllRoles");
        const data = await response.json();
        return data.roles||[];
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

export const sendOtp = async (mobileNumber: any) => {
  try {
    const options: any = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(`${baseUrl}/Otp/send?phoneNumber=${mobileNumber}`, options);
    if (!response.ok) throw new Error("Failed to send OTP");

    const data = await response.text();
    console.log("OTP Response:", data); 

    return data;
  } catch (error) {
    console.error("Error sendOtp:", error);
  }
};


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
export const deleteEmployeeById = async (id: number) => {
  try {
    const response = await fetch(
      `${baseUrl}/User/deleteuser?id=${id}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(JSON.stringify(errorBody));
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleteEmployeeById:", error);
    throw error;
  }
};



export const serviceForm = async(bookingId:any ,deptId:any ,serviceId:any,slotId:any,createdBy:any,full_name:any ,modifiedBy:any ,email:any ,phone:any ,address:any ,services:any,isActive:any, preferredDate:any,is_regular: boolean, is_premium: boolean, is_ultimate: boolean ) =>{
    try {
        const options:any = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ bookingId, deptId, serviceId, slotId, createdBy, full_name, modifiedBy, email, phone, address, services, isActive, preferredDate, is_regular, is_premium, is_ultimate, status_id: 1 }),
        }
        const response = await fetch(`${baseUrl}/Booking`,options);
        if (!response.ok) throw new Error("Failed to createBooking");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error createBooking:", error);
    }
}

export const getallBookings = async() => {
    try {
        const response = await fetch(`${baseUrl}/Booking/getall`
          ,{
            method:"POST",
            headers:{
              "Content-Type": "application/json",
            },
            body:JSON.stringify(
              {
  "limit": 300,
  "offset": 0
}
            ),
            
            
          }
        );
        if (!response.ok) {
            throw new Error(`Failed to fetch bookings: ${response.status}`);
        }
        
        const bookings = await response.json();
        
        if (!Array.isArray(bookings)) {
            console.warn('Bookings API did not return an array:', bookings);
            return [];
        }

        console.log('Raw bookings from API:', bookings);

        const [allDepartments] = await Promise.all([
            getAllDepartments(),
           // getAllServices()
        ]);

        // Enrich bookings with additional details if needed
        const enrichedBookings = await Promise.all(
            bookings.map(async (booking: any) => {
                try {
                    if (!booking.department && booking.dept_id) {
                        const dept = allDepartments?.find((d: any) => d.id === booking.dept_id);
                        if (dept) {
                            booking.department = dept;
                        }
                    }

                    if (Array.isArray(booking.services)) {
                        booking.services = booking.services.map((s: any) => {
                            const dept = allDepartments?.find((d: any) => d.id === s.dept_id); 
                            //const service = allServices?.find((serv: any) => serv.id === s.service_id);
                            
                            return {
                                ...s,
                                department_name: s.department_name || dept?.department_name || null,
                                //service_name: s.service_name || service?.service_name || null,
                            };
                        });
                    }

                    if (!booking.assigned_employee && booking.employee_id) {
                        try {
                            const employee = await getAllUsersById(booking.employee_id);
                            if (employee) {
                                booking.assigned_employee = {
                                    id: employee.id,
                                    first_name: employee.first_name,
                                    last_name: employee.last_name,
                                    email: employee.email,
                                    mobile: employee.mobile,
                                };
                            }
                        } catch (err) {
                            console.warn(`Could not fetch employee ${booking.employee_id}:`, err);
                        }
                    }

                    return booking;
                } catch (err) {
                    console.error('Error enriching booking:', err);
                    return booking; // Return original if enrichment fails
                }
            })
        );

        console.log('Enriched bookings:', enrichedBookings);
        return enrichedBookings;

    } catch (error) {
        console.error("Error fetching bookings:", error);
        throw error;
    }
}

/**
 * Get bookings filtered by status
 */
export const getBookingsByStatus = async(status: string) => {
    try {
        const allBookings = await getallBookings();
        
        if (status === 'all') {
            return allBookings;
        }

        const filtered = allBookings.filter((booking: any) => {
            const bookingStatus = booking.status?.status?.toLowerCase() || '';
            return bookingStatus === status.toLowerCase();
        });

        return filtered;
    } catch (error) {
        console.error("Error filtering bookings by status:", error);
        throw error;
    }
}

export const getallBookingsByUserId = async(id:any) =>{
    try {
        const response = await fetch(`${baseUrl}/Booking/getallbookingsbyuserID?user_id=0&emp_id=${id}`);
        if (!response.ok) throw new Error("Failed to fetch bookings");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching getBookings:", error);
        throw error;
    }
}

// Helper to safely parse JSON or return text/null if empty
async function safeParseResponse(res: Response) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (err) {
    return text;
  }
}

export const assignEmployeeToBooking = async (bookingId: number, userId: number) => {
  try {
    const assignRes = await fetch(`${baseUrl}/User/assignemployee`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: bookingId,
        user_id: userId,
      }),
    });

    if (assignRes.status === 204) {
      return { assigned: true, assignData: null };
    }

    if (!assignRes.ok) {
      const maybeErr = await safeParseResponse(assignRes);
      const errMessage =
        (maybeErr && (maybeErr.message || JSON.stringify(maybeErr))) ||
        `Assign failed with status ${assignRes.status}`;
      throw new Error(errMessage);
    }

    const assignData = await safeParseResponse(assignRes);

    // ✅ At this point, booking is assigned to employee
    // Default ticket status remains "Pending" (backend should handle that)

    return { assigned: true, assignData, status: "Pending" };
  } catch (err) {
    console.error("assignEmployeeToBooking error:", err);
    throw err;
  }
};

// -- add near other exports in app/services/auth.ts --

/**
 * Try to fetch completed reports from a dedicated endpoint if available.
 * If that endpoint does not exist, fallback to fetching all bookings and filter by status.
 */
export const getCompletedReports = async () => {
  try {
    // If you have a dedicated endpoint, uncomment and use that:
    // const response = await fetch(`${baseUrl}/Booking/getallcompleted`);
    // if (response.ok) return response.json();

    // Fallback: reuse getallBookings and filter on client
    const allBookings = await getallBookings();
    if (!Array.isArray(allBookings)) return [];

    // Adjust depending on how status appears in booking objects
    const completed = allBookings.filter((b: any) => {
      const status = b?.status?.status?.toString().toLowerCase?.();
      return status === "completed" || status === "complete" || b.status_id === 3;
    });

    return completed;
  } catch (err) {
    console.error("Error getCompletedReports:", err);
    return [];
  }
};



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

export const getAllLocations = async () => {
  try {
    const response = await fetch(`${baseUrl}/Master/getallmasterData`);
    if (!response.ok) throw new Error("Failed to fetch locations");
    const data = await response.json();
    return data.locations || [];
  } catch (error) {
    console.error("Error fetching locations:", error);
    return [];
  }
};



export const otpSend = async (mobileNumber: any) => {
  try {
    const options: any = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(`${baseUrl}/Otp/send?phoneNumber=%2B91${mobileNumber}`, options);
    if (!response.ok) throw new Error("Failed to send OTP");

    
    const data = await response.text();
    console.log("OTP Response:", data);

    return data;
  } catch (error) {
    console.error("Error fetching otpSend:", error);
  }
};


export const otpSendAPi = async (mobileNumber: any, code: any) => {
  try {
    const options: any = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(`${baseUrl}/Otp/verify?phoneNumber=%2B91${mobileNumber}&code=${code}`, options);
    if (!response.ok) throw new Error("Failed to verify OTP");

    const data = await response.text(); 
    console.log("OTP Verify Response:", data);

    return data;
  } catch (error) {
    console.error("Error fetching otpSendAPi:", error);
  }
};


export const updateTicketByEmployeeCompleted = async(id:any) =>{
    try {
        let options:any = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
        }
        const response = await fetch(`${baseUrl}/Booking/UpdateTicketByEmployeeCompleted/${id}`,options);
        if (!response.ok) throw new Error("Failed to fetch otpSend");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching otpSend:", error);
    }
}

export const updateTicketByEmployeeInprogress = async(id:any) =>{
    try {
        let options:any = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
        }
        const response = await fetch(`${baseUrl}/Booking/UpdateTicketByEmployeeInprogress/${id}`,options);
        if (!response.ok) throw new Error("Failed to fetch otpSend");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching otpSend:", error);
    }
}
