//nav bar toggle button
const button = document.querySelector("#menu-button");
const menu = document.querySelector("#menu");
button.addEventListener("click", () => {
  menu.classList.toggle("hidden");
});

/* Setting the current date in the local storage. */
const date = new Date();
localStorage.setItem("day", date.getDate());
localStorage.setItem("month", date.getMonth() * 1 + 1);
localStorage.setItem("year", date.getFullYear());

/**
 * It returns true if the date is available, and false if it is not.
 */
const dateIsAvailable = (date) => {
  fetch("http://localhost:3000/student")
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].date === date) {
          return true;
        }
      }
    });
};

/**
 * It returns true if the day and month passed to it match any of the day and month pairs in the
 * holydays array.
 */
const Holyday = (day, month) => {
  const holydays = [
    { day: 1, month: 1 },
    { day: 11, month: 1 },
    { day: 1, month: 5 },
  ];
  for (let i = 0; i < holydays.length; i++) {
    if (day == holydays[i].day && month == holydays[i].month) {
      return true;
    }
  }
};
const nameOfDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
/* Checking if the day is a weekend day. */
const isWeekend = (date) => {
  console.log(date);
  const day = date.getDay();
  const nameOfDay = nameOfDays[day];
  if (nameOfDay === "Fri" || nameOfDay === "Sun" || nameOfDay === "Sat") {
    console.log("weekend");
    return true;
  }
  return false;
};

var randomTopic;
const generateRandomStudent = async () => {
  let month = localStorage.getItem("month") * 1;
  let day = localStorage.getItem("day") * 1;
  let year = localStorage.getItem("year") * 1;

  generateRandomTopic();

  await fetch("http://localhost:4400/studentList")
    .then((response) => response.json())
    .then((data) => {
      /* Checking if the data is empty in topics & studentList */
      if (data.length === 0) {
        StudentsEmpty = true;
        alert("Please Students to the list first");
      } else if (TopicsEmpty) {
        alert("Please add topics to the list first");
      } else {
        /* Checking if the month is December and the day is 31, if it is, it sets the month to January, the
    day to 1, and it increments the year by 1. */
        if (month === 12 && day === 31) {
          month = 1;
          day = 1;
          year++;
          localStorage.setItem("year", year);
          localStorage.setItem("month", month);
          localStorage.setItem("day", day);
        } /* Checking if the day is 31, if it is, it sets the day to 1, and it increments the month by
        1. */ else if (day === 31) {
          day = 1;
          month++;
          localStorage.setItem("month", month);
          localStorage.setItem("day", day);
        } else {
          /* Checking if the month is February and the day is 28, if so, it will set the day to 1 and the
        month to the next month. If the month is April, June, September, or November and the day is
        30, it will set the day to 1 and the month to the next month. */
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
          } /* Checking if the day is a holiday or a weekend. If it is a holiday, it will add 1 to the
          day. If it is a weekend, it will add 1, 2, or 3 to the day depending on the day of the
          week. */ else if (Holyday(day, month)) {
            day++;
            localStorage.setItem("day", day);
          } else if (isWeekend(new Date(year, month - 1, day))) {
            if (nameOfDays[new Date(year, month - 1, day).getDay()] === "Fri") {
              console.log("friday");
              day += 3;
              localStorage.setItem("day", day);
            } else if (
              nameOfDays[new Date(year, month - 1, day).getDay()] === "Sat"
            ) {
              console.log("saturday");
              day += 2;
              localStorage.setItem("day", day);
            } else {
              console.log("sunday");
              day += 1;
              localStorage.setItem("day", day);
            }
          } /*
            if none of the above conditions are met, it will add 1 to the day. 
          */ else {
            day++;
            localStorage.setItem("day", day);
          }
        }
        const randomStudent = data[Math.floor(Math.random() * data.length)];
        const fullDate = `${localStorage.getItem("day")}/${localStorage.getItem(
          "month"
        )}/${localStorage.getItem("year")}`;
        setTimeout(() => {
          /* 
          now we send the data to the server to be saved in the database.
          and delete the student that was selected from the list.
      */
          saveStudent(randomStudent.name, fullDate, randomTopic.name);
          console.log(randomTopic);
          deleteStudent(randomStudent.id);
          // deleteTopic(randomTopic.id);
        }, 500);
        /* Calling the getLastStudent() function after 2 seconds.
         */
        setTimeout(() => {
          getLastStudent();
        }, 1000);
      }
    })
    .catch((error) => console.log(error));
};

/**
 * It takes three arguments, sends a POST request to the server, and logs the response
 */
const saveStudent = async (studentName, fullDate, randomTopic) => {
  await axios
    .post("http://localhost:3000/student", {
      nom: studentName,
      date: fullDate,
      topic: randomTopic,
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
};

/**
 * It takes the value of the input field and sends it to the server.
 */
const TopicInput = document.querySelector("#TopicInput");
const addTopic = async () => {
  const topic = TopicInput.value;
  const date = new Date();
  const fullDate = `${date.getDate()}/${
    date.getMonth() * 1 + 1
  }/${date.getFullYear()}`;
  console.log(topic);
  await axios
    .post("http://localhost:4000/Topics", {
      name: topic,
      createdAt: fullDate,
    })
    .then((response) => {
      console.log(response);
      toggleModal("modal-id");
      GetLastTopic();
      TopicInput.value = "";
    })
    .catch((error) => {
      console.log(error);
    });
};

/**
 * It fetches data from the server and displays it on the table
 */
const getTopic = async () => {
  // console.log("Im here to get the topic");
  fetch("http://localhost:4000/Topics")
    .then((response) => response.json())
    .then((data) => {
      const TopicTbody = document.querySelector("#TopicTb");
      const TopicTbodyHtml = data.map((topic) => {
        return `<tr>
          <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-semibold text-gray-900 sm:pl-6">${topic.id}</td>
          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${topic.name}</td>
          <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-semibold text-gray-900 sm:pl-6">${topic.createdAt}</td>
          <td class="whitespace-nowrap px-3 py-4 text-sm">
          <span class="flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-green-500" viewBox="0 0 20 20"
                  fill="currentColor">
                  <path fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd" />
              </svg>
          </span>
      </td>
    </tr>`;
      });
      for (let i = 0; i < data.length; i++) {
        TopicTbody.innerHTML += TopicTbodyHtml[i];
      }
    })
    .catch((error) => console.log(error));
};
getTopic();

const getStudent = async () => {
  fetch("http://localhost:3000/student")
    .then((response) => response.json())
    .then((data) => {
      const StudentTbody = document.querySelector("#StudentTb");
      const StudentTbodyHtml = data.map((student) => {
        return `<tr>
          <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-semibold text-gray-900 sm:pl-6">${student.id}</td>
          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${student.nom}</td>
          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${student.date}</td>
          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${student.topic}</td>
    </tr>`;
      });
      for (let i = 0; i < data.length; i++) {
        StudentTbody.innerHTML += StudentTbodyHtml[i];
      }
    })
    .catch((error) => console.log(error));
};
getStudent();

/**
 * It fetches the data from the database, then it checks if the data is empty, if it is, it sets the
 * TopicsEmpty variable to true, if it isn't, it sets the randomTopic variable to a random topic from
 * the database.
 */
let TopicsEmpty = false;
const generateRandomTopic = async () => {
  fetch("http://localhost:4000/Topics")
    .then((response) => response.json())
    .then((data) => {
      if (data.length === 0) {
        TopicsEmpty = true;
      } else {
        randomTopic = data[Math.floor(Math.random() * data.length)];
      }
    })
    .catch((error) => console.log(error));
};
generateRandomTopic();

/**
 * It fetches the last data from the server, then it adds the last student to the table
 */
const getLastStudent = async () => {
  fetch("http://localhost:3000/student")
    .then((response) => response.json())
    .then((data) => {
      const TopicTbody = document.querySelector("#StudentTb");
      const lastStudent = data[data.length - 1];
      const lastStudentHtml = `<tr>
      <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-semibold text-gray-900 sm:pl-6">${lastStudent.id}</td>
      <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${lastStudent.nom}</td>
      <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${lastStudent.date}</td>
      <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${lastStudent.topic}</td>
</tr>`;
      TopicTbody.innerHTML += lastStudentHtml;
    })
    .catch((error) => console.log(error));
};

const GetLastTopic = async () => {
  fetch("http://localhost:4000/Topics")
    .then((response) => response.json())
    .then((data) => {
      const TopicTbody = document.querySelector("#TopicTb");
      const lastTopic = data[data.length - 1];
      const lastTopicHtml = `<tr>
      <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-semibold text-gray-900 sm:pl-6">${lastTopic.id}</td>
      <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${lastTopic.name}</td>
      <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-semibold text-gray-900 sm:pl-6">${lastTopic.createdAt}</td>
      <td class="whitespace-nowrap px-3 py-4 text-sm">
      <span class="flex justify-center">
          <svg xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-green-500" viewBox="0 0 20 20"
              fill="currentColor">
              <path fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd" />
          </svg>
      </span>
  </td>
</tr>`;
      TopicTbody.innerHTML += lastTopicHtml;
    })
    .catch((error) => console.log(error));
};
/**
 * It takes an id as an argument, and then it makes a DELETE request to the server, and then it logs
 * the response to the console.
 * @param id - The id of the student you want to delete.
 */

const deleteStudent = async (id) => {
  fetch(`http://localhost:4400/studentList/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => console.log(error));
};
