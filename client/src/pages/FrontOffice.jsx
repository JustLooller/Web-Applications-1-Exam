import { useContext } from "react";
import { useLoaderData } from "react-router-dom";
import HeaderComponent from "../components/HeaderComponent";
import { UserContext } from "../contexts/UserContext";
import PageGrid from "../components/PageGrid";
import CreatePageButton from "../components/CreatePageButton";
import LoadingSpinner from "../components/LoadingSpinner";

export default function FrontOffice() {
  const { user } = useContext(UserContext);
  const backoffice = false;
  const pages = useLoaderData();


  return (
    <>
      {pages.length === 0 && <LoadingSpinner />}
      <HeaderComponent />
      {user && <CreatePageButton />}
      <PageGrid pages={pages} type={backoffice} />
    </>
  );
}
