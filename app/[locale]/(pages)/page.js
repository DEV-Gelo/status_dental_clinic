import Skeleton from "@mui/material/Skeleton";

const Home = () => {
  return (
    <>
      <div className="flex flex-col w-[100%] h-[100vh] justify-center items-center">
        <h1 className="font-bold mb-10 text-[45px]">Page for test</h1>
        <div>
          <Skeleton variant="rounded" width={210} height={60} />
        </div>
      </div>
    </>
  );
};

export default Home;
