import React, { useState } from "react";
import { useRouter } from "next/router";
import cookies from "next-cookies";
import Notice from "../components/notice";
import Input from "../components/input";

interface FormData {
  password: string;
}

interface ResetPasswordPageProps {
  query: {
    token: string;
  };
}

const form = {
  id: "resetPassword",
  inputs: [
    {
      id: "password",
      type: "password",
      label: "New Password",
      required: true,
      value: "",
    },
  ],
  submitButton: {
    type: "submit",
    label: "Set New Password",
  },
};

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ query }) => {
  const RESET_NOTICE = { type: "", message: "" };
  const [notice, setNotice] = useState(RESET_NOTICE);
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
        `${process.env.NEXT_PUBLIC_API}/users/resetPassword`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            password: formData.password,
            resetToken: query.token,
          }),
        }
      );
      const data = await response.json();
      if (data.errCode) {
        setNotice({ type: "ERROR", message: data.message });
      } else {
        setNotice({
          type: "SUCCESS",
          message: data.message + " You will be signed in and redirected.",
        });
        setTimeout(() => {
          router.push("/pages");
        }, 3000);
      }
    } catch (err) {
      console.log(err);
      setNotice({ type: "ERROR", message: "Something unexpected happened." });
    }
  };

  return (
    <>
      <h1 className="pageHeading">Reset Password</h1>
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
      </form>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<ResetPasswordPageProps> = (
  context
) => {
  const { token } = cookies(context);
  const res = context.res;
  if (token) {
    res?.writeHead(302, { Location: "/pages" });
    res?.end();
  }
  return { props: {} };
};

export default ResetPasswordPage;
