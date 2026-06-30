import JurusanPage from "../../components/JurusanPage.jsx";
import { getJurusanById } from "../../components/jurusan.js";

export default function AkuntansiPage() {
  return <JurusanPage jurusan={getJurusanById("akuntansi")} />;
}