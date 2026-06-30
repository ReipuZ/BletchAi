import JurusanPage from "../../components/JurusanPage.jsx";
import { getJurusanById } from "../../components/jurusan.js";

export default function RplPage() {
  return <JurusanPage jurusan={getJurusanById("rpl")} />;
}