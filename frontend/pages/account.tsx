import { useState, FormEvent } from "react";
import cookies from "next-cookies";

import Input from "../components/input";
import Notice from "../components/notice";

interface InputField {
  id: string;
  type: string;
  label: string;
  required: boolean;
  value: string;
}

interface SubmitButton {
  type: string;
  label: string;
}

interface Form {
  id: string;
  inputs: InputField[];
  submitButton: SubmitButton;
}

interface NoticeState {
  type: string;
  message: string;
}

interface FormData {
  name: string;
  email: string;
  password: string;
}

interface User {
  name: string;
  email: string;
}

const form: Form = {
  id: "signup",
  inputs: [
    {
      id: "name",
      type: "text",
      label: "Name",
      required: true,
      value: "",
    },
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
      required: false,
      value: "",
    },
  ],
  submitButton: {
    type: "submit",
    label: "Update Account",
  },
};

const AccountPage = ({ user }: { user: User }) => {
  const RESET_NOTICE: NoticeState = { type: "", message: "" };
  const [notice, setNotice] = useState<NoticeState>(RESET_NOTICE);
  const values: FormData = {
    [form.inputs[0].id]: user ? user.name : form.inputs[0].value,
    [form.inputs[1].id]: user ? user.email : form.inputs[1].value,
    [form.inputs[2].id]: form.inputs[2].value,
  };
  const [formData, setFormData] = useState<FormData>(values);

  const handleInputChange = (id: string, value: string) => {
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNotice(RESET_NOTICE);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/users/account`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        }
      );
      const data = await response.json();
      if (data.errCode) {
        setNotice({ type: "ERROR", message: data.message });
      } else {
        setNotice({ type: "SUCCESS", message: "Successfully updated." });
      }
    } catch (err) {
      console.log(err);
      setNotice({ type: "ERROR", message: "Something unexpected happened." });
    }
  };

  return (
    <>
      <h1 className="pageHeading">Account</h1>
      <form id={form.id} method="post" onSubmit={handleSubmit}>
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

export const getServerSideProps = async (context: any) => {
  const { token } = cookies(context);
  const res = context.res;
  const req = context.req;

  if (!token) {
    res.writeHead(302, { Location: `/login` });
    res.end();
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/users/account`,
      {
        method: "GET",
        credentials: "include",
        // Forward the authentication cookie to the backend
        headers: {
          "Content-Type": "application/json",
          Cookie: req ? req.headers.cookie : undefined,
        },
      }
    );
    const data = await response.json();
    return {
      props: { user: { name: data.name, email: data.email } },
    };
  } catch (err) {
    console.log(err);
    return { props: {} };
  }
};

export default AccountPage;
