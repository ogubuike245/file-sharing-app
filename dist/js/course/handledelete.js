const trashcan = document.querySelector("button.delete");

trashcan.addEventListener("click", (e) => {
  const endpoint = `/api/v1/course/delete/${trashcan.dataset.doc}`;

  fetch(endpoint, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      window.location.href = data.redirect;
    })
    .catch((error) => console.log(error));
});
