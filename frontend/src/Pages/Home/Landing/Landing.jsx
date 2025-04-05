import React, { useState, useEffect } from "react";
import "./Landing.css";
import Classroom from "../../Images/Classroom.svg";
import Plant from "../../Images/Plant.svg";
import Plant2 from "../../Images/Plant2.svg"
import Contact from "../Contact/Contact.jsx";
import Footer from "../../Footer/Footer.jsx";
import Header from "../Header/Header.jsx";
import { CgProfile } from "react-icons/cg";
import { IoSchoolSharp } from "react-icons/io5";
import { FaSchool } from "react-icons/fa";
import { NavLink , useNavigate} from "react-router-dom";

function Landing() {
  const [LClass, setLClass] = useState(false);
  const [EMentor, setEMentor] = useState(false);
  const [subject, setSubject] = useState('');
  const [facList, setFacList] = useState([]);
  const [loading, setLoading] = useState(true);
  // State for popup visibility
  const [showPopup, setShowPopup] = useState(true);

  const navigate = useNavigate();

  // Effect to handle popup timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Redirect function for the popup button
  const handleCookGptRedirect = () => {
    window.open('https://cook-gpt-self.vercel.app/', '_blank');
    setShowPopup(false);
  };

  const handleSearch = ()=>{
    navigate(`/Search/${subject}`)
  }

  const AA = ()=>{
    setEMentor(true);
    setLClass(false);
  }

  const BB = ()=>{
    setEMentor(false);
    setLClass(true);
  }

  const teachersList = async(sub)=>{
    setLoading(true);

    const response = await fetch(`/api/course/${sub}`, {
      method: 'GET',
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      }
    });

    const data = await response.json();
    setFacList(data.data);
    setLoading(false);
  }


  return (
    <>
    <Header/>
    
    {/* New Feature Popup */}
    {showPopup && (
      <div className="fixed inset-0 flex items-center justify-center z-50 px-4 md:px-0">
        <div className="absolute inset-0 bg-black bg-opacity-60" onClick={() => setShowPopup(false)}></div>
        <div className="relative bg-gradient-to-br from-blue-900 to-indigo-800 rounded-xl shadow-2xl p-6 max-w-md w-full mx-auto transform transition-all overflow-hidden">
          {/* Progress bar for 5 seconds timer */}
          <div className="absolute top-0 left-0 h-1.5 bg-amber-400 animate-[shrink_6s_linear_forwards]" style={{width: '100%'}}></div>
          
          <button 
            className="absolute top-2 right-2 text-white hover:text-gray-300"
            onClick={() => setShowPopup(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="flex flex-col items-center text-white">
            <div className="mb-4 rounded-full bg-blue-700 p-3 bg-opacity-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold mb-2">New Feature Alert!</h2>
            <p className="text-center mb-4 text-gray-200">
              Try our new AI-powered cooking assistant that helps you prepare delicious meals with ingredients you have!
            </p>
            
            <button 
              onClick={handleCookGptRedirect}
              className=" w-[60%] mt-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              Explore Cook-GPT
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Top Section */}
      <div className="top">
        <div className="left">
          <h1>
          Empowering Minds, Inspiring Futures: <br />Your Gateway to Online Learning with <span className="font-semibold text-amber-400 font-serif text-5xl">Saarathi</span>
          </h1>
          {/*  Search  */}

          <div className="search mb-10">
            <img src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/6c476f454537d7f27cae2b4d0f31e2b59b3020f5" width={30} alt="" />
            <input type="text" placeholder='Ex: Math ...' value={subject} onChange={(e)=>setSubject(e.target.value)}/>
            <button className='w-32' onClick={handleSearch}>Find Teacher</button>
          </div>

        </div>
        <div className="right">
          <img src={Classroom} width={500} alt="" />
        </div>
      </div>

      {/* Features */}
      <div className="features ">
        <p>Why You Choose Us</p>
        {/* <hr className="underLine"/> */}
        <div className="fets2">
          <div className="fet cursor-pointer mb-5" onClick={AA}>
            <img
              src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/622a85ea75414daadf6055613c074c5280b95444"
              alt=""
            />
            <h4>Expert Mentor</h4>
            <p>
              Our expert mentors are the cornerstone of our educational
              approach. With a wealth of knowledge they support our students on
              their journey to success.
            </p>
          </div>

          <div className="fet cursor-pointer mb-5" onClick={BB}>
            <img
              src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/1478ee1b2a35123ded761b65c3ed2ceaece0d20f"
              alt=""
            />
            <h4>High Quality Live Class</h4>
            <p>
              We deliver high-quality live classes to our students, providing
              interactive learning experiences led by experienced instructors.{" "}
            </p>
          </div>

          <NavLink to='/contact'>
            <div className="fet cursor-pointer">
              <img
                src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/c412120e39b2095486c76978d4cd0bea88fd883b"
                alt=""
              />
              <h4>24/7 Live Support</h4>
              <p>
                We offer our students 24/7 live support. Whether it's a question
                or a challenge at midnight, our dedicated team is here to provide
                guidance, assistance.
              </p>
            </div>
          </NavLink>
        </div>
        {LClass && (
          <div className="flex items-center justify-center">
            <div className="flex gap-5 items-center my-5">
              <img src="https://lh3.googleusercontent.com/kq1PrZ8Kh1Pomlbfq4JM1Gx4z-oVr3HG9TEKzwZfqPLP3TdVYrx0QrIbpR-NmMwgDzhNTgi3FzuzseMpjzkfNrdHK5AzWGZl_RtKB80S-GZmWOQciR9s=w1296-v1-e30" alt="" width={300}/>
              <div className="text-white flex flex-col items-center">
                <h1>High Quality Live Class</h1>
                <p>We deliver high-quality live classes to our students,<br /> providing interactive learning experiences <br />led by experienced instructors.</p>
              </div>
            </div>
          </div>
        )}

        {EMentor && (
          <div className="flex items-center justify-center mt-7 gap-5">
            <div className="bg-[#0E3A59] m-2 p-5 rounded-3xl overflow-hidden flex flex-col items-center justify-center">
              <img className=" rounded-full" src="https://media.istockphoto.com/id/1310210662/photo/portrait-of-indian-woman-as-a-teacher-in-sari-standing-isolated-over-white-background-stock.jpg?s=612x612&w=0&k=20&c=EMI42nCFpak1c4JSFvwfN0Qllyxt19dlihYEXAdnCXY=" alt="" width={200}/>

              <div className="flex items-center justify-start">
                <CgProfile/>
                <p>Prof. Dina Sharma</p>
              </div>
              <div className="flex items-center">
                <FaSchool />
                <p>Galaxy University</p>
              </div>
              <div className="flex items-center">
                <IoSchoolSharp />
                <p>Ph.D. in Astrophysics</p>
              </div>
            </div>
            <div className="bg-[#0E3A59] m-2 p-5 rounded-3xl overflow-hidden flex flex-col items-center justify-center">
              <img className=" rounded-full" src="https://media.istockphoto.com/id/1324558913/photo/confident-young-man-in-casual-green-shirt-looking-away-standing-with-crossed-arms-isolated-on.jpg?s=612x612&w=0&k=20&c=NOrKRrUuxvePKijL9sFBHlDwHESv7Van68-hoS-_4hQ=" alt="" width={200}/>

              <div className="flex items-center justify-start">
                <CgProfile/>
                <p>Dr. Anand Mishra</p>
              </div>
              <div className="flex items-center">
                <FaSchool />
                <p>Maharishi University</p>
              </div>
              <div className="flex items-center">
                <IoSchoolSharp />
                <p>Ph.D. in Quantum Physics</p>
              </div>
            </div>
            <div className="bg-[#0E3A59] m-2 p-5 rounded-3xl overflow-hidden flex flex-col items-center justify-center">
              <img className=" rounded-full" src="https://media.istockphoto.com/id/1663458254/photo/portrait-of-beautiful-indian-woman-in-sari.jpg?s=612x612&w=0&k=20&c=raeTJOEyA4sFX_GwrgboXt9ZxtAZ8RkFuljPJnL9sCU=" alt="" width={200}/>

              <div className="flex items-center justify-start">
                <CgProfile/>
                <p>Prof. Sunita Patel</p>
              </div>
              <div className="flex items-center">
                <FaSchool />
                <p>Ramanujan Institute</p>
              </div>
              <div className="flex items-center">
                <IoSchoolSharp />
                <p>D.Phil. in Number Theory</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Courses */}
      <div className="courses">
      <p>Faculty List</p>
      <hr className="underLine"/>
      <div className="subjects">
        <div className="subject" onClick={()=>teachersList("physics")}>
          <img src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/8e9bf690d23d886f63466a814cfbec78187f91d2" alt="Physics" />
          <p>Physics</p>
        </div>
        <div className="subject" onClick={()=>teachersList("chemistry")}>
          <img src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/3e546b344774eb0235acc6bf6dad7814a59d6e95" alt="Chemistry" />
          <p>Chemistry</p>
        </div>
        <div className="subject" onClick={()=>teachersList("biology")}>
          <img src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/28ac70002ae0a676d9cfb0f298f3e453d12b5555" alt="Zoology" />
          <p>Biology</p>
        </div>
        <div className="subject" onClick={()=>teachersList("math")}>
          <img src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/61930117e428a1f0f7268f888a84145f93aa0664" alt="Math" />
          <p>Math</p>
        </div>
        <div className="subject" onClick={()=>teachersList("computer")}>
          <img src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/a64c93efe984ab29f1dfb9e8d8accd9ba449f272" alt="Computer" />
          <p>Computer</p>
        </div>
        
      </div>

      <div className="flex items-center justify-center gap-10">
        {!loading && facList && (
          facList.map(fac => (
          <div key={fac._id} className="bg-[#99afbc] p-5 rounded-md ">
            <div className="flex gap-3 items-center mb-2 ">
            <img src="https://www.pngall.com/wp-content/uploads/5/Profile-Male-PNG.png" alt="profile_img" width={50} />
            <div className="flex flex-col justify-center items-start pl-3">
            <p>{fac.enrolledteacher.Firstname} {fac.enrolledteacher.Lastname}</p>
            <h4 className="text-blue-900">{fac.enrolledteacher.Email}</h4>
            </div>
            </div>
            { fac.enrolledteacher.Email === "urttsg@gmail.com" ?
              <h4><span className="font-bold text-brown-800">Education :</span> Post graduate from Calcutta University</h4> 
              : 
              <h4><span className="font-bold text-brown-800">Education :</span> Post graduate from Sister Nivedita university</h4>
            }
            { fac.enrolledteacher.Email === "urttsg@gmail.com" ? <h4>1 years of teaching experience</h4> : <h4>2 years of teaching experience</h4>}
          </div>
        )))}
      </div>

      </div>

      {/* About Us */}
      <div className="about" style={{backgroundColor: "#042439"}}>
        <h4>About Us</h4>
        <hr className="underLine"/>
        <div className="content">
          <div className="left-svg">
            <img src={Plant2} width={300} alt="" />
          </div>
          <p>
            At Saarathi, we believe in the power of education to transform lives. Our platform is designed to be a gateway to knowledge, offering a diverse range of courses and learning experiences for students.
            <h1 className=" bg-blue-700 w-fit py-1 px-3 rounded-sm my-2">Our Story</h1>
            Saarathi was born out of a passion for learning and a desire to make quality education accessible to everyone. We understand the challenges faced by modern learners and strive to provide a solution that is both convenient and effective.
            <h1 className=" bg-blue-700 w-fit py-1 px-3 rounded-sm my-2">Our Mission</h1>
            Our mission is simple yet profound: to empower individuals through education. We aim to create a global learning community where students can discover new passions, enhance their skills, and achieve their academic and professional goals. By leveraging technology and innovative teaching methods, we strive to make learning engaging, interactive, and enjoyable.
          </p>
          <div className="right-svg">
            <img src={Plant} width={400} alt="" />
          </div>
        </div>
      </div>

      {/* Contact Us */}
      <div className="contact-us">
        <Contact/>
      </div>

      {/* Footer */}
      <Footer/>
    </>
  );
}

export default Landing;
