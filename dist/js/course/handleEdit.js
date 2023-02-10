async function handleFormSubmit(e) {
  e.preventDefault();
  const form = document.querySelector("form");
  const endpoint = `/api/v1/course/edit/course/${form.dataset.doc}`;

  console.log(form.values);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
    });
    const data = await response.json();
    alert(data.message);
    // window.location.href = data.redirect;
  } catch (error) {
    console.log(error);
  }
}

form.addEventListener("submit", handleFormSubmit);
