"use server";

export default async function connectHono() {
  const resp = await fetch("http://localhost:8787/");
  const data = await resp.json();
  console.log(data);
}
