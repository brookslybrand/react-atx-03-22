import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { createUserSession, loginUser } from "~/utils/session.server";
import { LockClosedIcon } from "@heroicons/react/20/solid";

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

  console.log("login?");

  return (
    <>
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h1>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{" "}
              <Link
                to="/signup"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                register a new account
              </Link>
            </p>
          </div>
          <Form className="mt-8 space-y-6" action="#" method="post">
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon
                    className="h-5 w-5 text-indigo-400 group-hover:text-indigo-300"
                    aria-hidden="true"
                  />
                </span>
                Sign in
              </button>
            </div>
            {actionData?.error ? (
              <p className="text-red-500 text-lg" aria-live="assertive">
                {actionData.error}
              </p>
            ) : null}
          </Form>
        </div>
      </div>
    </>
  );
}
