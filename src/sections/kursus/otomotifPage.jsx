import JurusanPage from "../../components/JurusanPage.jsx";
import { getJurusanById } from "../../components/jurusan.js";

export default function OtomotifPage() {
  return <JurusanPage jurusan={getJurusanById("otomotif")} />;
}