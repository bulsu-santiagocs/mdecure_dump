import logo from '../assets/images/logo-transparent.png';

const Logo = () => {
  return (
    <div className="flex items-center space-x-2">
      {/* Logo Image */}
      <div className="h-10 w-10 flex items-center justify-center">
        <img
          src={logo}
          alt="MedCure Logo"
          className="h-full w-full object-contain"
        />
      </div>

      {/* Logo Text */}
      <div className="font-extrabold text-xl text-gray-800">
        <span className="logo-text">MedCure</span>
      </div>
    </div>
  );
};

export default Logo;