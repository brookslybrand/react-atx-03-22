import { Form, Link, Outlet } from "@remix-run/react";
import Logo from "~/icons/logo";

export default function DashboardLayout() {
  return (
    <main>
      <header className="bg-teal-100">
        <nav
          className="flex items-center justify-between p-6 lg:px-8 "
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <Link to="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Board Game Demo</span>
              <Logo aria-disabled className="w-6 h-6 fill-transparent" />
            </Link>
          </div>

          <Form
            action="/logout"
            className="lg:flex lg:flex-1 lg:justify-end"
            method="post"
          >
            <button
              type="submit"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Log out <span aria-hidden="true">&rarr;</span>
            </button>
          </Form>
        </nav>
      </header>
      <Outlet />
    </main>
  );
}
