const deleteTopic = async (id) => {
  fetch(`http://localhost:4000/topics/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => console.log(error));
};
