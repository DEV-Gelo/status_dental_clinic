import Link from "next/link";

export function Menu() {
  return (
    <nav className="flex fixed top-[5rem] justify-center items-center w-[50%] h-[100vh] p-[2rem] bg-[#ccdde4]">
      <ul className="flex flex-col gap-4">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/">Home</Link>
        </li>
      </ul>
    </nav>
  );
}
