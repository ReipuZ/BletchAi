import JurusanPage from "../../components/jurusanPage.jsx";
import { getJurusanById } from "../../components/jurusan.js";

export default function RplPage() {
  return <JurusanPage jurusan={getJurusanById("rpl")} />;
}