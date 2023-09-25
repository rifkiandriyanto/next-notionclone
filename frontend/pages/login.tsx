import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import cookies from "next-cookies";

import { UserDispatchContext } from "../context/UserContext";
import Notice from "../components/notice";
import Input from "../components/input";

interface FormData {
  email: string;
  password: string;
}

interface NoticeData {
  type: string;
  message: string;
}

const form = {
  id: "login",
  inputs: [
    {
      id: "email",
      type: "email",
      label: "E-Mail Address",
      required: true,
      value: "",
    },
    {
      id: "password",
      type: "password",
      label: "Password",
      required: true,
      value: "",
    },
  ],
  submitButton: {
    type: "submit",
    label: "Login",
  },
  button: {
    type: "button",
    label: "Forgot password ?",
  },
};

const LoginPage: React.FC = () => {
  const RESET_NOTICE: NoticeData = { type: "", message: "" };
  const [notice, setNotice] = useState<NoticeData>(RESET_NOTICE);
  const dispatch = useContext(UserDispatchContext);
  const router = useRouter();

  const initialValues: FormData = {};
  form.inputs.forEach((input) => (initialValues[input.id] = input.value));
  const [formData, setFormData] = useState<FormData>(initialValues);

  const handleInputChange = (id: string, value: string) => {
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNotice(RESET_NOTICE);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/users/login`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );
      const data = await response.json();
      if (data.errCode) {
        setNotice({ type: "ERROR", message: data.message });
      } else {
        dispatch({ type: "LOGIN" });
        router.push("/pages");
      }
    } catch (err) {
      console.log(err);
      setNotice({ type: "ERROR", message: "Something unexpected happened." });
      dispatch({ type: "LOGOUT" });
    }
  };

  const handlePasswordReset = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push("/forgotPassword");
  };

  return (
    <>
      <h1 className="pageHeading">Login</h1>
      <form id={form.id} onSubmit={handleSubmit}>
        {form.inputs.map((input, key) => {
          return (
            <Input
              key={key}
              formId={form.id}
              id={input.id}
              type={input.type}
              label={input.label}
              required={input.required}
              value={formData[input.id]}
              setValue={(value) => handleInputChange(input.id, value)}
            />
          );
        })}
        {notice.message && (
          <Notice status={notice.type} mini>
            {notice.message}
          </Notice>
        )}
        <button type={form.submitButton.type}>{form.submitButton.label}</button>
        <button type={form.button.type} onClick={handlePasswordReset}>
          {form.button.label}
        </button>
      </form>
      <p>
        Don't have an account yet?{" "}
        <a href="/signup" rel="noreferrer noopener">
          <strong>Sign up here.</strong>
        </a>
      </p>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = (context) => {
  const { token } = cookies(context);
  const res = context.res;
  if (token) {
    res?.writeHead(302, { Location: `/account` });
    res?.end();
  }
  return { props: {} };
};

export default LoginPage;
