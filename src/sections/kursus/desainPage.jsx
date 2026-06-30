import JurusanPage from "../../components/JurusanPage.jsx";
import { getJurusanById } from "../../components/jurusan.js";

export default function DesainPage() {
  return <JurusanPage jurusan={getJurusanById("desain")} />;
}