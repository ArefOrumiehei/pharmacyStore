import { Outlet } from "react-router";


const AuthLayout: React.FC = () => {
  return (
    <div className="h-screen flex justify-center items-center bg-gray-50">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
