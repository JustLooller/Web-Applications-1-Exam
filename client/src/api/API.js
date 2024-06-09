import dayjs from "dayjs";

const API_URL = "http://localhost:3001/api";

async function getPages() {
  const response = await fetch(API_URL + "/pages/all", {
    credentials: "include",
  });
  const pages = await response.json();
  if (response.ok) {
    return pages.map((p) => ({
      id: p.id,
      title: p.title,
      author: p.author,
      creation_date: dayjs(p.creation_date).format("YYYY-MM-DD"),
      publication_date:
        p.publication_date !== null
          ? dayjs(p.publication_date).format("YYYY-MM-DD")
          : null,
      blocks: p.blocks,
    }));
  } else {
    throw pages;
  }
}

async function getPublishedPages() {
  const response = await fetch(API_URL + "/pages/all/published", {
    credentials: "include",
  });
  const pages = await response.json();
  if (response.ok) {
    return pages.map((p) => ({
      id: p.id,
      title: p.title,
      author: p.author,
      creation_date: dayjs(p.creation_date).format("YYYY-MM-DD"),
      publication_date:
        p.publication_date !== null
          ? dayjs(p.publication_date).format("YYYY-MM-DD")
          : null,
      blocks: p.blocks,
    }));
  } else {
    throw pages;
  }
}
async function getPagebyID(req) {
  const response = await fetch(API_URL + "/pages/" + req.params.id, {
    credentials: "include",
  });
  const page = await response.json();
  if (response.ok) {
    return {
      id: page.id,
      title: page.title,
      author: page.author,
      creation_date: dayjs(page.creation_date).format("YYYY-MM-DD"),
      publication_date:
        page.publication_date !== null
          ? dayjs(page.publication_date).format("YYYY-MM-DD")
          : null,
      blocks: page.blocks,
    };
  } else {
    throw page;
  }
}

async function getAllAuthors() {
  const response = await fetch(API_URL + "/authors/all", {
    credentials: "include",
  });
  const authors = await response.json();
  if (response.ok) {
    return authors.map((a) => ({
      name: a,
    }));
  } else {
    throw authors;
  }
}

async function createPage(page) {
  const response = await fetch(API_URL + "/pages", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(page),
  });
  const newPageId = await response.json();
  if (response.ok) {
    return newPageId;
  } else {
    throw newPageId;
  }
}

async function editPage(page) {
  const response = await fetch(API_URL + "/pages/" + page.id, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(page),
  });
  const editedPage = await response.json();
  if (response.ok) {
    return editedPage;
  } else {
    throw editedPage;
  }
}

async function deletePage(id) {
  const response = await fetch(API_URL + "/pages/" + id, {
    method: "DELETE",
    credentials: "include",
  });
  if (response.ok) {
    return response.json();
  } else {
    throw response.json();
  }
}

async function login(email, password) {
  const response = await fetch(API_URL + "/login", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: email, password }),
  });
  const user = await response.json();
  if (response.ok) {
    return user;
  } else {
    throw user;
  }
}

async function logout() {
  await fetch(API_URL + "/logout", {
    method: "DELETE",
    credentials: "include",
  });
}

async function whoami() {
  const response = await fetch(API_URL + "/session", {
    method: "GET",
    credentials: "include",
  });
  const user = await response.json();
  if (response.ok) {
    return user;
  } else {
    throw user;
  }
}

async function getSiteTitle() {
  const response = await fetch(API_URL + "/title", {
    credentials: "include",
  });
  const title = await response.json();
  if (response.ok) {
    return title;
  } else {
    throw title;
  }
}

async function editSiteTitle(title) {
  const response = await fetch(API_URL + "/title", {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: title }),
  });
  const editedTitle = await response.json();
  if (response.ok) {
    return editedTitle;
  } else {
    throw editedTitle;
  }
}
async function getImagesList() {
  const response = await fetch(API_URL + "/images/all", {
    credentials: "include",
  });
  const images = await response.json();
  if (response.ok) {
    return images.images.map((i) => ({
      name: i,
    }));
  } else {
    throw images.images;
  }
}

const API = {
  getPages,
  getPagebyID,
  getPublishedPages,
  getAllAuthors,
  createPage,
  editPage,
  deletePage,
  login,
  logout,
  whoami,
  getSiteTitle,
  editSiteTitle,
  getImagesList,
};

export default API;
