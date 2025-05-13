import BigButton from "../components/BigButton";

export default function Cajero() {

  return (
    <div className="flex-1 p-6 bg-white">
      <h2 className="text-8xl font-bold my-4">Cajero</h2>
      <div className="grid grid-cols-2 gap-4 max-w-md">
        <BigButton
          label="Nueva entrada"
          // color="#d36f2d"
          color="warning"
        />
        <BigButton
          label="Nueva venta"
          // color="#49a775"
          color="success"
        />
        <div className="col-span-2">
          <BigButton
            label="Ver Stock"
            // color="#1c2b3a"
            color="secondary"
          />
        </div>
      </div>
    </div>
  );
}

