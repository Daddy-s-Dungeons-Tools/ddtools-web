import { Image, ImageProps } from "@chakra-ui/react";
import logo from "../../assets/img/ddtools-logo.svg";

type LogoPropTypes = {
  width?: ImageProps["width"];
};
/** DDTools logo image */
export function Logo(props: LogoPropTypes) {
  return <Image src={logo} w={props.width ?? "30px"} />;
}
