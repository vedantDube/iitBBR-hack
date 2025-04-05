import React, { useState } from "react";
import HR from "../Login/Images/HR.svg";
import "./Login.css";
import { NavLink, useNavigate } from "react-router-dom";
import Radiobtn from "../Components/RadioBtn/Radiobtn";
import Header from "../Home/Header/Header";

export default function Login() {
  // State to hold user input and errors
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [userType, setUserType] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Client-side validation
    const newErrors = {};

    if (!userType) {
      newErrors.userType = "Please select if you are a student or teacher";
    }

    if (!Email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(Email)) {
      newErrors.email = "Invalid email format";
    }

    if (!Password.trim()) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      // Update the errors state and prevent form submission
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    // Prepare data object to send to the backend
    const data = {
      Email: Email,
      Password: Password,
    };

    try {
      console.log("Logging in as:", userType);
      
      // Send data to backend
      const response = await fetch(`/api/${userType}/login`, {
        method: 'POST',
        credentials: "include", // Important for receiving cookies
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      console.log("Login response:", responseData);
      
      if (!response.ok) {
        setErr(responseData.message || "Login failed");
        setLoading(false);
        return;
      }
      
      // Store tokens in localStorage as a fallback
      if (responseData.data?.Accesstoken) {
        localStorage.setItem('accessToken', responseData.data.Accesstoken);
        console.log("Access token saved to localStorage");
      }
      
      if (responseData.data?.Refreshtoken) {
        localStorage.setItem('refreshToken', responseData.data.Refreshtoken);
        console.log("Refresh token saved to localStorage");
      }
      
      // Store user type and ID for future reference
      localStorage.setItem('userType', userType);
      localStorage.setItem('userId', responseData.data.user._id);
      
      console.log("Login successful");
      
      const userid = responseData.data.user._id;
      const userApprovalStatus = responseData.data.user.Isapproved;
      
      console.log("User approval status:", userApprovalStatus);
      
      // Handle different approval states
      if (userApprovalStatus === "pending") {
        if (responseData.data.user.Teacherdetails || responseData.data.user.Studentdetails) {
          navigate('/pending');
        } else {
          if (userType === 'student') {
            navigate(`/StudentDocument/${userid}`);
          } else if (userType === 'teacher') {
            navigate(`/TeacherDocument/${userid}`);
          }
        }
      } else if (userApprovalStatus === "approved") {
        if (userType === 'student') {
          navigate(`/Student/Dashboard/${userid}/Search`);
        } else if (userType === 'teacher') {
          navigate(`/Teacher/Dashboard/${userid}/Home`);
        }
      } else if (userApprovalStatus === "reupload") {
        navigate(`/rejected/${userType}/${userid}`);
      } else {
        setErr('You are banned from our platform!');
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ general: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header/>
      <section className="main">
        <div className="container">
          <div className="para1">
            <h2> WELCOME BACK!</h2>
          </div>

          <div className="para">
            <h5> Please Log Into Your Account.</h5>
          </div>

          <div className="form">
            <form onSubmit={handleSubmit}>
              <div className="input-1">
                <input
                  type="text"
                  placeholder="Email Address"
                  className="input-0"
                  value={Email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && (
                  <div className="error-message">{errors.email}</div>
                )}
              </div>
              <div className="input-2">
                <input
                  type="password"
                  placeholder="Password"
                  className="input-0"
                  value={Password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && (
                  <div className="error-message">{errors.password}</div>
                )}
              </div>

              {/* radio buttons */}
              <div className="radio-btn">
                <Radiobtn userType={userType} setUserType={setUserType} />
              </div>
              {errors.userType && (
                <div className="error-message">{errors.userType}</div>
              )}

              <div className="signup-link">
                <span>Don't have an account? </span>
                <NavLink to="/signup" className="link text-yellow-400 text-semibold text-md">
                  signup
                </NavLink>
              </div>

              <div className="text-yellow-400 text-semibold pt-3 cursor-pointer" onClick={()=>navigate('/forgetpassword')}>
                Forget Password?
              </div>

              {/* btns */}
              <div className="btns">
                <button type="submit" className="btns-1" disabled={loading}>
                  {loading ? "Logging in..." : "Log In"}
                </button>
              </div>
              {err !== '' && (
                <p className="text-red-400 text-sm">{err}</p>
              )}
              {errors.general && (
                <div className="error-message">{errors.general}</div>
              )}
            </form>
          </div>
        </div>

        {/* image */}
        <div className="img-3">
          <img src={HR} width={600} alt="" />
        </div>
      </section>
    </>
  );
}