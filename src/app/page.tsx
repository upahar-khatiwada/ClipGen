"use client";

import { useEffect, useState } from "react";
import { trpc } from "./_trpc/client";

export default function Hello() {
  const [sum, setSum] = useState<number | null>(null);

  const hello = trpc.hello.useQuery();

  useEffect(() => {
    alert(hello.error);
    if (hello.error?.data?.code === "TOO_MANY_REQUESTS") {
      alert("Rate limit reached! Try again later!");
    }
  }, [hello.error]);

  const echo = trpc.echo.useMutation({
    onError: (err) => {
      if (err.data?.code === "TOO_MANY_REQUESTS") {
        alert("Rate limit reached! Try again later.");
      }
    },
  });

  const addMutation = trpc.add.useMutation({
    onSuccess: (data) => setSum(data.result),
    onError: (err) => {
      if (err.data?.code === "TOO_MANY_REQUESTS") {
        alert("Rate limit reached! Try again later.");
      }
    },
  });

  return (
    <div>
      <p>5 + 7 = {sum}</p>
      <button
        className="text-white"
        onClick={() => addMutation.mutate({ a: 5, b: 7 })}
      >
        Calculate 5 + 7
      </button>

      <button onClick={() => echo.mutate({ message: "Hi!" })}>Echo Hi!</button>
    </div>
  );
}
