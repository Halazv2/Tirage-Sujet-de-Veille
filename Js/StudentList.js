/**
 * It fetches the data from the server and then displays it in the table.
 */
const getStudents = async () => {
  fetch("http://localhost:4400/studentList")
    .then((response) => response.json())
    .then((data) => {
      const StudentTbody = document.querySelector("#StudentTb");
      const StudentTbodyHtml = data.map((student) => {
        return `<tr>
            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-semibold text-gray-900 sm:pl-6">${student.id}</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${student.name}</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm" 
            onclick="deleteStudent(${student.id})">
            <span class="flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-red-500" viewBox="0 0 20 20"
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

getStudents();

/**
 * It takes an id as an argument, and then it makes a DELETE request to the server, and then it
 * refreshes the page.
 * @param id - the id of the student you want to delete
 */
const deleteStudent = async (id) => {
  await fetch(`http://localhost:4400/studentList/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      refreshPage();
    })
    .catch((error) => console.log(error));
};

//refresh page after delete
const refreshPage = () => {
  window.location.reload();
};

const addStudent = async () => {
  const studentName = document.querySelector("#studentName").value;
  await axios
    .post("http://localhost:4400/studentList", {
      name: studentName,
    })
    .then((response) => {
      console.log(response);
      toggleModal("modal-id");
      getLastStudent();
    })
    .catch((error) => console.log(error));
};


const getLastStudent = async () => {
  await fetch("http://localhost:4400/studentList")
    .then((response) => response.json())
    .then((data) => {
      const TopicTbody = document.querySelector("#StudentTb");
      const lastStudent = data[data.length - 1];
      const lastStudentHtml = `<tr>
      <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-semibold text-gray-900 sm:pl-6">${lastStudent.id}</td>
      <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${lastStudent.name}</td>
      <td class="whitespace-nowrap px-3 py-4 text-sm" 
      onclick="deleteStudent(${lastStudent.id})">
      <span class="flex justify-center">
          <svg xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-red-500" viewBox="0 0 20 20"
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
