import logo from "../../assets/45bea7bf610b630764249912d73900471ba2b503.png";

export function Logo({ className = "h-10" }: { className?: string }) {
  return (
    <img src={logo} alt="InterVox" className={className} />
  );
}