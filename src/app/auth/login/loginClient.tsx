"use client";

import { loginServer } from "@/lib/actions";
import { LoginSchema } from "@/lib/zod";
import { FormEvent, useState } from "react";
import { z } from "zod";

export default function LoginClient() {
  const [input, setInput] = useState<z.infer<typeof LoginSchema>>({
    username: "",
    password: "",
  });
  const [status, setStatus] = useState({
    loading: false,
    error: "",
  });

  async function loginClient(e: FormEvent) {
    e.preventDefault();

    const parsed = LoginSchema.safeParse(input);

    if (!parsed.success) {
      return setStatus(
        (prev) => (prev = { ...prev, error: parsed.error.errors[0].message })
      );
    }

    setStatus((prev) => (prev = { ...prev, loading: true, error: "" }));

    await loginServer(parsed.data)
      .then((response) => {
        if (response.err) {
          setStatus(
            (prev) => (prev = { ...prev, loading: false, error: response.err! })
          );
        } else {
          setStatus((prev) => (prev = { ...prev, loading: false, error: "" }));
          window.location.reload();
        }
      })
      .catch((err: string) =>
        setStatus((prev) => (prev = { ...prev, loading: false, error: err }))
      );
  }

  return (
    <form
      onSubmit={loginClient}
      className="w-[380px] max-w-[85%] mx-auto mt-[15dvh] bg-white p-[20px] rounded-lg shadow-lg flex flex-col focus:outline-none"
    >
      <h4 className="text-center text-xl font-semibold text-gray-700">
        Admin Login
      </h4>
      <div className="flex flex-col gap-[5px] mt-[20px]">
        <label className="text-sm lg:text-base text-gray-600">Brukernavn</label>
        <input
          value={input.username}
          onChange={(e) =>
            setInput((prev) => (prev = { ...prev, username: e.target.value }))
          }
          type="text"
          className="text-sm lg:text-base rounded-md border border-gray-300 px-[10px] py-[6px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex flex-col gap-[5px] mt-[15px]">
        <label className="text-sm lg:text-base text-gray-600">Passord</label>
        <input
          value={input.password}
          onChange={(e) =>
            setInput((prev) => (prev = { ...prev, password: e.target.value }))
          }
          type="password"
          className="text-sm lg:text-base rounded-md border border-gray-300 px-[10px] py-[6px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {status.loading && (
        <p className="text-sm lg:text-base text-gray-600 mt-[10px]">
          Logger inn...
        </p>
      )}
      {status.error && (
        <p className="text-sm lg:text-base text-red-500 mt-[10px]">
          {status.error}
        </p>
      )}
      <input
        className={`bg-blue-500 text-gray-50 py-[8px] text-sm lg:text-base cursor-pointer rounded-md hover:bg-blue-600 transition-colors duration-200 ${
          !status.loading && !status.error ? "mt-[20px]" : "mt-[10px]"
        }`}
        type="submit"
        value="Login"
      />
    </form>
  );
}
