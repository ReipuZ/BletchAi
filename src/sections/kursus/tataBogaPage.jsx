import JurusanPage from "../../components/JurusanPage.jsx";
import { getJurusanById } from "../../components/jurusan.js";

export default function TataBogaPage() {
  return <JurusanPage jurusan={getJurusanById("tataboga")} />;
}