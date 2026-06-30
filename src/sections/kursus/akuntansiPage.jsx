import JurusanPage from "../../components/jurusanPage.jsx";
import { getJurusanById } from "../../components/jurusan.js";

export default function AkuntansiPage() {
  return <JurusanPage jurusan={getJurusanById("akuntansi")} />;
}