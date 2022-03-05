import type { NextPage } from "next";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <div>
      <h3>Example</h3>
      <Link href="/1024">
        <a>/1024</a>
      </Link>
    </div>
  );
};

export default Home;
