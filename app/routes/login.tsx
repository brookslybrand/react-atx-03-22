import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { createUserSession, loginUser } from "~/utils/session.server";

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  // Validation
  if (!email || typeof email !== "string") {
    return json({ error: "Email is required" });
  }
  if (!password || typeof password !== "string") {
    return json({ error: "Password is required" });
  }

  try {
    const user = await loginUser({ email, password });
    // createUserSession automatically handles redirects
    return await createUserSession(user, request.headers);
  } catch (error) {
    return json({
      error:
        error instanceof Error
          ? error.message
          : "Something went wrong, please try again.",
    });
  }
}

export default function Login() {
  const actionData = useActionData<typeof action>();

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "2rem 1rem",
        width: 300,
      }}
    >
      <label>
        Email:
        <input type="email" name="email" />
      </label>
      <label>
        Password:
        <input type="password" name="password" />
      </label>
      <button type="submit">Login!</button>
      {actionData?.error ? (
        <p style={{ color: "red" }} aria-live="assertive">
          {actionData.error}
        </p>
      ) : null}
      <Link to="/signup">New? Signup</Link>
    </Form>
  );
}
