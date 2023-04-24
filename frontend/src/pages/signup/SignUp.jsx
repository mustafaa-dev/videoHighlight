import React, { useState } from "react";
import Style from "./AuthStyle.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const SignUp = () => {

  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const[profilePic,setProfilePic] = useState();
  

  const navigate = useNavigate();

  const handleChange = (event) => {
    const file = event.target.files[0];
    //const url = URL.createObjectURL(file);
    setProfilePic(file);
    console.log(file);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    setError(null)

    let response = await axios.post(
      "http://localhost:8080/signup",
      {
        firstName: e.target.firstName.value,
        lastName: e.target.secondName.value,
        email: e.target.email.value,
        password: e.target.password.value,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    let res2 = await axios.post(
      "localhost:8080/profile/uploadProfilePic",
      {
         profilePic
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
      );


    let user = await response.data;
    console.log(user);
    
    //console.log(res2);

    if (response.status === 200){

      setIsLoading(false);

      navigate('/login');
    }
    else{
      console.log("snjdnjkan");
      setIsLoading(false)
      setError("Email is already exist")
    }
    

  };
  return (
    <div className={Style.Auth_form_container}>
      <form className={Style.Auth_form} onSubmit={handleSubmit}>
        <div className={Style.Auth_form_content}>
          <h3 className={Style.Auth_form_title}>Sign up</h3>

          <div className="form-group mt-3">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              className="form-control mt-1"
              placeholder="Enter FirstName"
              required
            />
          </div>

          <div className="form-group mt-3">
            <label>Second Name</label>
            <input
              type="text"
              name="secondName"
              className="form-control mt-1"
              placeholder="Enter SecondName"
              required
            />
          </div>

          <div className="form-group mt-3">
            <label>Email address</label>
            <input
              type="email"
              name="email"
              className="form-control mt-1"
              placeholder="Enter email"
              required
            />
          </div>

          <div className="form-group mt-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control mt-1"
              placeholder="Enter password"
              name="password"
              required
            />
          </div>
          <input type="file" name="image" multiple accept="image/*"   onChange={handleChange}/>

          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>

            {error && <div class="alert alert-danger" role="alert">
                            error
                       </div>
            }
          </div>
          <p
            className="forgot-password text-center mt-2"
            style={{ paddingTop: "10px" }}
          >
            <b>
              <a href="/login">login?</a>
            </b>
          </p>
        </div>
      </form>
      {profilePic && <img src={profilePic} width={600}
          height={305} alt="pp" />}
    </div>
  );
}

export default SignUp;
