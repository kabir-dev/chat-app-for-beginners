import React, { useEffect, useState } from "react";
import Theme from "../components/Theme";
import Link from "next/link";
import Modal from "../components/Modal";
import { useRouter } from "next/router";
import Cookie from "js-cookie";
import decode from "jwt-decode";
import { instance } from "../components/axios/axiosInstance";

export default function Signup() {
  const router = useRouter();

  const token = Cookie.get("acces");
  const [isLoading, setLoding] = useState(true);

  const [passwordToggle, setPasswordToggle] = useState(false);
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (token) {
      setLoding(true);
      router.push("/messenger");
      return;
    }
    setLoding(false);
  }, []);

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let errors = {};

    if (!values.name.trim()) {
      errors.name = "Name is required!";
    } else if (values.name.length < 2) {
      errors.email = "Name must be ";
    }

    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Enter a valid email";
    }

    if (!values.password) {
      errors.password = "Password is required!";
    } else if (values.password.length < 6) {
      errors.password = "Password is greater than 6 character!";
    }

    if (!values.password2) {
      errors.password2 = "Confirm password is required!";
    } else if (values.password !== values.password2) {
      errors.password2 = "Confirm password doesn't match!";
    }

    setErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        const obj = {
          name: values.name,
          email: values.email,
          password: values.password,
        };
        const { data } = await instance.post("/api/signup", obj);
        Cookie.set("acces", data.access_token, { expires: 1 });
        Cookie.set("refresh", data.refresh_token, { expires: 1 });
        const userId = decode(data.access_token).aud;
        router.push(`/messenger`);
      } catch (error) {
        if (!error?.response) {
          setServerError("Internal server error");
        } else if (error.response?.status === 401) {
          setServerError(error.response.data.error.message);
        } else if (error.response?.status === 422) {
          setServerError(error.response.data.error.message);
        } else if (error.response?.status === 409) {
          setServerError(error.response.data.error.message);
        } else {
          setServerError("Internal server error");
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className=" flex justify-center items-center w-full h-screen dark:bg-slate-800">
        <p className=" dark:text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className=" h-screen dark:bg-slate-800">
      <div className=" p-4 text-right">
        <Theme />
      </div>
      <div className=" sm:shadow-md dark:shadow-none w-full sm:p-4 rounded-md mt-32 sm:w-96 m-auto">
        <form onSubmit={handleSubmit}>
          <div>{serverError && <Modal text={serverError} />}</div>
          <div className=" my-2 px-3">
            <label className=" my-1 block dark:text-white" htmlFor="name">
              Name
            </label>
            <input
              className="border dark:border-slate-500 dark:text-white w-full block px-1 py-2 outline-none rounded-md dark:bg-slate-800"
              type="text"
              name="name"
              id="name"
              placeholder="Jone doe"
              value={values.name}
              onChange={handleChange}
            />
            <p className=" text-red-500 dark:text-red-400">
              {errors.name && errors.name}
            </p>
          </div>
          <div className=" my-2 px-3">
            <label className=" my-1 block dark:text-white" htmlFor="email">
              Email
            </label>
            <input
              className="border dark:border-slate-500 dark:text-white w-full block px-1 py-2 outline-none rounded-md dark:bg-slate-800"
              type="email"
              name="email"
              id="email"
              placeholder="example@gmail.com"
              value={values.email}
              onChange={handleChange}
            />
            <p className=" text-red-500 dark:text-red-400">
              {errors.email && errors.email}
            </p>
          </div>
          <div className=" my-2 px-3">
            <label className=" my-1 block dark:text-white" htmlFor="password">
              Password
            </label>
            <div className=" relative">
              <input
                className="border dark:border-slate-500 dark:text-white w-full block px-1 py-2 outline-none rounded-md dark:bg-slate-800"
                type={passwordToggle ? "text" : "password"}
                name="password"
                id="password"
                placeholder="******"
                value={values.password}
                onChange={handleChange}
              />
              <p className=" text-red-500 dark:text-red-400">
                {errors.password && errors.password}
              </p>
              <button
                type="button"
                onClick={() => setPasswordToggle(!passwordToggle)}
                className=" absolute top-2 right-2 outline-none dark:text-white"
              >
                {passwordToggle ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div className=" my-2 px-3">
            <label className=" my-1 block dark:text-white" htmlFor="password2">
              Confirm password
            </label>

            <input
              className="border dark:border-slate-500 dark:text-white w-full block px-1 py-2 outline-none rounded-md dark:bg-slate-800"
              type={passwordToggle ? "text" : "password"}
              name="password2"
              id="password2"
              placeholder="******"
              value={values.password2}
              onChange={handleChange}
            />
            <p className=" text-red-500 dark:text-red-400">
              {errors.password2 && errors.password2}
            </p>
          </div>
          <div className=" text-center my-3">
            <p className=" dark:text-white">
              Alredy have an account ?
              <Link href="/">
                <a className=" underline"> Login</a>
              </Link>
            </p>
          </div>
          <div className=" w-11/12 mx-auto">
            <input
              className=" w-full px-4 cursor-pointer py-3 outline-none rounded-lg text-white bg-sky-600"
              type="submit"
              value="Signup"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
