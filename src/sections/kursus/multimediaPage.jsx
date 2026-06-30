import JurusanPage from "../../components/JurusanPage.jsx";
import { getJurusanById } from "../../components/jurusan.js";

export default function MultimediaPage() {
  return <JurusanPage jurusan={getJurusanById("multimedia")} />;
}