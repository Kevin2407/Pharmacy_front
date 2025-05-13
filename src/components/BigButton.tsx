import { Button } from "primereact/button";

interface BigButtonProps {
  label: string;
  color: string;
}

export default function BigButton({ label, color }: BigButtonProps) {
  return (
    <Button
      label={label}
      className={`p-button-lg `}
      // style={{ backgroundColor: color, border: "none" }}
      severity={color}
      />
  )
}