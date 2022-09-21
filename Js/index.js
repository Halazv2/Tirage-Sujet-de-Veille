//nav bar toggle button
const button = document.querySelector("#menu-button");
const menu = document.querySelector("#menu");
button.addEventListener("click", () => {
  menu.classList.toggle("hidden");
});

const generateRandomStudent = () => {
  fetch("../Data/StudentList.json")
    .then((response) => response.json())
    .then((data) => {
      const randomStudent = data[Math.floor(Math.random() * data.length)];
      console.log(randomStudent.name);
      // return;
      // const studentName = document.querySelector("#student-name");
      // studentName.innerHTML = randomStudent.name;
      saveStudent(randomStudent.name);
    })
    .catch((error) => console.log(error));
};

const saveStudent = async (studentName) => {
  const data = {
    id: randID(),
    name: studentName,
  };
  await axios
    .post("http://localhost:3000/student", {
      nom: studentName,
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
};

const getStudent = () => {
  fetch("./data.json")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => console.log(error));
};

const randID = () => {
  return Math.floor(Math.random() * 1000000000);
};
