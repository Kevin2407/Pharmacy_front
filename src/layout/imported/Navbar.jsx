import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <div className="flex justify-between">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-xl font-bold">Pedidos</h1>
        <div className="flex items-center space-x-2">
            <Button
              className="rounded-[26px] mr-2"
              variant="outline"
              onClick={() => console.log("click")}
            >Nueva garantía (express)</Button>
            <Button
              className="text-white rounded-[26px]"
              onClick={() => console.log("click")}
            >Nuevo Pedido</Button>
          </div>
        </div>
      </div>
  );
};

export default Navbar;