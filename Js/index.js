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
const randomTopic = "";
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
    } else if (Holyday(day, month)) {
      day++;
      localStorage.setItem("day", day);
    } else if (isWeekend(new Date(year, month - 1, day))) {
      day = day + 3;
      localStorage.setItem("day", day);
    } else {
      day++;
      localStorage.setItem("day", day);
    }
  }
  generateRandomTopic();

  // return;
  const fullDate = `${localStorage.getItem("day")}/${localStorage.getItem(
    "month"
  )}/${localStorage.getItem("year")}`;
  fetch("../Data/StudentList.json")
    .then((response) => response.json())
    .then((data) => {
      const randomStudent = data[Math.floor(Math.random() * data.length)];
      console.log(randomStudent.name);
      // return;
      // const studentName = document.querySelector("#student-name");
      // studentName.innerHTML = randomStudent.name;
      saveStudent(randomStudent.name, fullDate);
      setTimeout(() => {
        getLastStudent();
      }, 1000);
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
      toggleModal('modal-id');
      GetLastTopic();
    })
    .catch((error) => {
      console.log(error);
    });
};

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
          <td class="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
          <div class="inline-block text-left" x-data="{ menu: false }">
              <button x-on:click="menu = ! menu" type="button"
                  class="flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  id="menu-button" aria-expanded="true" aria-haspopup="true">
                  <span class="sr-only"></span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path
                          d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
              </button>
              <div x-show="menu" x-on:click.away="menu = false"
                  class="origin-top-right absolute right-32 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none"
                  role="menu" aria-orientation="vertical"
                  aria-labelledby="menu-button" tabindex="-1">
                  <div class="" role="none">
                      <a onclick="toggleModal('modal-id')"
                          class="text-gray-500 font-medium hover:text-gray-900 hover:bg-gray-50 block px-4 py-2 text-sm"
                          role="menuitem" tabindex="-1" id="menu-item-0">
                          Add topic
                      </a>
                      <a href="#"
                          class="text-red-500 font-medium hover:text-gray-900 hover:bg-gray-50 block px-4 py-2 text-sm"
                          role="menuitem" tabindex="-1" id="menu-item-0">
                          Delete
                      </a>
                  </div>
              </div>
          </div>
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
          <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-semibold text-gray-900 sm:pl-6">${student.date}</td>
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
        StudentTbody.innerHTML += StudentTbodyHtml[i];
      }
    })
    .catch((error) => console.log(error));
};
getStudent();

const generateRandomTopic = async () => {
  console.log(randomTopic);
  fetch("http://localhost:4000/Topics")
    .then((response) => response.json())
    .then((data) => {
      const randomTopicName = data[Math.floor(Math.random() * data.length)];
      randomTopic = randomTopicName.name;
      console.log(randomTopic);
    })
    .catch((error) => console.log(error));
};
// generateRandomTopic();

const getLastStudent = async () => {
  fetch("http://localhost:3000/student")
    .then((response) => response.json())
    .then((data) => {
      const TopicTbody = document.querySelector("#StudentTb");
      const lastStudent = data[data.length - 1];
      const lastStudentHtml = `<tr>
      <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-semibold text-gray-900 sm:pl-6">${lastStudent.id}</td>
      <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${lastStudent.nom}</td>
      <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-semibold text-gray-900 sm:pl-6">${lastStudent.date}</td>
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
      <td class="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
      <div class="inline-block text-left" x-data="{ menu: false }">
          <button x-on:click="menu = ! menu" type="button"
              class="flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
              id="menu-button" aria-expanded="true" aria-haspopup="true">
              <span class="sr-only"></span>
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path
                      d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
          </button>
          <div x-show="menu" x-on:click.away="menu = false"
              class="origin-top-right absolute right-32 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none"
              role="menu" aria-orientation="vertical"
              aria-labelledby="menu-button" tabindex="-1">
              <div class="" role="none">
                  <a onclick="toggleModal('modal-id')"
                      class="text-gray-500 font-medium hover:text-gray-900 hover:bg-gray-50 block px-4 py-2 text-sm"
                      role="menuitem" tabindex="-1" id="menu-item-0">
                      Add topic
                  </a>
                  <a href="#"
                      class="text-red-500 font-medium hover:text-gray-900 hover:bg-gray-50 block px-4 py-2 text-sm"
                      role="menuitem" tabindex="-1" id="menu-item-0">
                      Delete
                  </a>
              </div>
          </div>
      </div>
  </td>
</tr>`;
      TopicTbody.innerHTML += lastTopicHtml;
    })
    .catch((error) => console.log(error));
};
