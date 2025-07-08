
import logo from '../assets/img/trosense.png';
import petronasLogo from '../assets/img/petronas-logo.png';

const Sidebar = () => {
  return (
    <header className="bg-white text-black w-full shadow-3xl flex items-center justify-between px-6 py-3">
      {/* Left logo */}
      <div className=" p-2 rounded ">
        <img src={logo} alt="TROSENSE Logo" className="h-12" />
      </div>

     
      <div>
        <img src={petronasLogo} alt="Petronas Logo" className="h-12" />
      </div>
    </header>
  );
};

export default Sidebar;
