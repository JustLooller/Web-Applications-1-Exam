import HeaderComponent from "../components/HeaderComponent";
import { useLoaderData } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import PageGrid from "../components/PageGrid";
import CreatePageButton from "../components/CreatePageButton";

export default function BackOffice() {
  const backoffice = true;
  const { user } = useContext(UserContext);
  const pages = useLoaderData();

  return (
    <>
      <HeaderComponent />
      {user !== null && (
        <>
          <CreatePageButton />
          <PageGrid pages={pages} type={backoffice} />
        </>
      )}
    </>
  );
}
