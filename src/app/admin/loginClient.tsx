"use client";

import { TServerActionResponse } from "@/libs/types";
import { FormEvent, useState } from "react";

export default function LoginClient(props: {
  loginServer: (input: {
    username: string;
    password: string;
  }) => Promise<TServerActionResponse>;
}) {
  const [input, setInput] = useState({ username: "", password: "" });
  const [status, setStatus] = useState({
    loading: false,
    error: "",
  });

  async function loginClient(e: FormEvent) {
    e.preventDefault();

    if (!input.username)
      return setStatus(
        (prev) => (prev = { ...prev, error: "Skriv inn brukernavn." })
      );

    if (!input.password)
      return setStatus(
        (prev) => (prev = { ...prev, error: "Skriv inn passord." })
      );

    setStatus((prev) => (prev = { loading: true, error: "" }));

    await props
      .loginServer(input)
      .then((response) => {
        if (response.err) {
          setStatus(
            (prev) => (prev = { loading: false, error: response.err! })
          );
        } else {
          setStatus((prev) => (prev = { loading: false, error: "" }));
        }
      })
      .catch((err: any) =>
        setStatus((prev) => (prev = { loading: false, error: err }))
      );
  }

  return (
    <form
      onSubmit={loginClient}
      className="w-[380px] max-w-[85%] mx-auto mt-[15dvh] bg-slate-100 shadow-md outline-gray-500 outline outline-1 p-[20px] lg:rounded-sm flex flex-col"
    >
      <h4 className="text-center text-lg lg:text-xl">Admin login</h4>
      <div className="flex flex-col gap-[3px] mt-[20px]">
        <label className="text-sm lg:text-base">Brukernavn</label>
        <input
          value={input.username}
          onChange={(e) =>
            setInput((prev) => (prev = { ...prev, username: e.target.value }))
          }
          type="text"
          className="text-sm lg:text-base rounded-sm shadow-sm px-[5px] py-[3px] outline-none"
        />
      </div>
      <div className="flex flex-col gap-[3px] mt-[15px]">
        <label className="text-sm lg:text-base">Passord</label>
        <input
          value={input.password}
          onChange={(e) =>
            setInput((prev) => (prev = { ...prev, password: e.target.value }))
          }
          type="password"
          className="text-sm lg:text-base rounded-sm shadow-sm px-[5px] py-[3px] outline-none"
        />
      </div>
      {status.loading && (
        <p className="text-sm lg:text-base text-gray-600 mt-[10px]">
          Logger inn...
        </p>
      )}
      {status.error && (
        <p className="text-sm lg:text-base text-red-400 mt-[10px]">
          {status.error}
        </p>
      )}
      <input
        className={`bg-blue-200 py-[5px] text-sm lg:text-base cursor-pointer rounded-sm shadow-sm ${
          !status.loading && !status.error ? "mt-[20px]" : "mt-[5px]"
        }`}
        type="submit"
        value="Login"
      />
    </form>
  );
}
