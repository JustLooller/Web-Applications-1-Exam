import PageEditForm from "../components/PageEditForm";
import HeaderComponent from "../components/HeaderComponent";
import { useLoaderData } from "react-router-dom";

export default function EditPage() {
  const pageToEdit = useLoaderData();

  return (
    <>
      <HeaderComponent />
      <PageEditForm pageToEdit={pageToEdit} />
    </>
  );
}
