"use client";
import { trpc } from "./_trpc/client";

export default function Hello() {
  const { data, isLoading } = trpc.hello.useQuery();

  if (isLoading) return <p>Loading...</p>;
  return <p>{data?.greeting}</p>;
}
