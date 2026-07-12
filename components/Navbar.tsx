import Link from "next/link";

function Navbar() {
  return (
    <header>
      <nav>
        <Link className="logo" href="/">
          <img src="icons/logo.png" alt="Logo" />

          <p>DevEvent</p>
        </Link>

        <ul>
          <Link href="/">Home</Link>
          <Link href="/">Events</Link>
          <Link href="/">Create Event</Link>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
