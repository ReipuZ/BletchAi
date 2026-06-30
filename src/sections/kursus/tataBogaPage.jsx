import JurusanPage from "../../components/jurusanPage.jsx";
import { getJurusanById } from "../../components/jurusan.js";

export default function TataBogaPage() {
  return <JurusanPage jurusan={getJurusanById("tataboga")} />;
}