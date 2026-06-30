import JurusanPage from "../../components/jurusanPage.jsx";
import { getJurusanById } from "../../components/jurusan.js";

export default function OtomotifPage() {
  return <JurusanPage jurusan={getJurusanById("otomotif")} />;
}