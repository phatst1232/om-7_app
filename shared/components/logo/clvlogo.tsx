import Image from "next/image";
import clvLogo from "../../icon/clv_logo.png";

export default function ClvLogo() {
  return (
    <Image
      src={clvLogo}
      style={{
        width: 300,
        height: "auto",
      }}
      priority={false}
      alt="CyberLogitec Viet Nam - Logo"
    />
  );
}
