import NavBar from "./Navbar";

const AppNavBar = ({ children }) => {
  return (
    <div className="flex flex-col">
      <header className="sticky px-6 py-3 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {children}
      </header>
    </div>
  );
};

export default AppNavBar;