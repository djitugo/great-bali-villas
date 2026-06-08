import { getTypes, getAreas, getAllProperties } from "@/lib/properties";
import { Navbar } from "./Navbar";

export function SiteHeader() {
  const types = getTypes();
  const areas = getAreas().slice(0, 8);
  const total = getAllProperties().length;
  return <Navbar types={types} areas={areas} total={total} />;
}
