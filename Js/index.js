//nav bar toggle button
const button = document.querySelector("#menu-button");
const menu = document.querySelector("#menu");
button.addEventListener("click", () => {
  menu.classList.toggle("hidden");
});

const date = new Date();
localStorage.setItem("day", date.getDate());
localStorage.setItem("month", date.getMonth() * 1 + 1);
localStorage.setItem("year", date.getFullYear());

const generateRandomStudent = () => {
  let month = localStorage.getItem("month") * 1;
  let day = localStorage.getItem("day") * 1;
  let year = localStorage.getItem("year") * 1;
  if (month === 12 && day === 31) {
    month = 1;
    day = 1;
    year++;
    localStorage.setItem("year", year);
    localStorage.setItem("month", month);
    localStorage.setItem("day", day);
  } else if (day === 31) {
    day = 1;
    month++;
    localStorage.setItem("month", month);
    localStorage.setItem("day", day);
  } else {
    if (month === 2 && day === 28) {
      day = 1;
      month++;
      localStorage.setItem("month", month);
      localStorage.setItem("day", day);
    } else if (
      (month === 4 || month === 6 || month === 9 || month === 11) &&
      day === 30
    ) {
      day = 1;
      month++;
      localStorage.setItem("month", month);
      localStorage.setItem("day", day);
    } else {
      day++;
      localStorage.setItem("day", day);
    }
  }

  const fullDate = `${localStorage.getItem("day")}/${localStorage.getItem(
    "month"
  )}/${localStorage.getItem("year")}`;
  // console.log(fullDate);
  fetch("../Data/StudentList.json")
    .then((response) => response.json())
    .then((data) => {
      const randomStudent = data[Math.floor(Math.random() * data.length)];
      console.log(randomStudent.name);
      // return;
      // const studentName = document.querySelector("#student-name");
      // studentName.innerHTML = randomStudent.name;
      saveStudent(randomStudent.name, fullDate);
    })
    .catch((error) => console.log(error));
};

const saveStudent = async (studentName, fullDate) => {
  await axios
    .post("http://localhost:3000/student", {
      nom: studentName,
      date: fullDate,
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
    .then((data) => console.log(data))
    .catch((error) => console.log(error));
};

const TopicInput = document.querySelector("#TopicInput");

const addTopic = async () => {
  const topic = TopicInput.value;
  console.log(topic);
  await axios
    .post("http://localhost:4000/Topics", {
      name: topic,
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
};

const getTopic = async () => {
  console.log("getTopic");
  fetch("http://localhost:4000/Topics")
    .then((response) => {
      const data = response.json();
      console.log(data.data);
    })
    .catch((error) => {
      console.log(error);
    });
};
getTopic();
