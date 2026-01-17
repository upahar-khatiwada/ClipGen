"use client";

import { useState } from "react";
import { trpc } from "./_trpc/client";

export default function Hello() {
  const hello = trpc.hello.useQuery();
  const echo = trpc.echo.useMutation();
  const random = trpc.randomNumber.useQuery();

  const [sum, setSum] = useState<number | null>(null);

  const addMutation = trpc.add.useMutation({
    onSuccess: (data) => {
      setSum(data.result);
    },
  });

  return (
    <>
      <div>
        <p>{hello.data?.greeting}</p>
        <p>5 + 7 = {sum}</p>
        <button className="text-white" onClick={() => addMutation.mutate({ a: 5, b: 7 })}>
          Calculate 5 + 7
        </button>
        <p>Random: {random.data?.value}</p>
        <button onClick={() => echo.mutate({ message: "Hi!" })}>
          Echo Hi!&quot;
        </button>
      </div>
    </>
  );
}
