import { useRef, useState } from "react";
import logo from "./whatsapp.webp";

const App = () => {
  const numbersRef = useRef();
  const nameRef = useRef();
  const [contactsToWork, setContactsToWork] = useState([]);
  const phoneNumberRegex =
    /^(\+\d{1,2} ?\(\d{3}\) ?\d{3}-\d{4}|\+\d{2} \d{5} \d{5})$/;

  const handleSanitise = () => {
    const inputData = numbersRef.current.value;
    if (inputData) {
      let sanitisedContacts = inputData
        .replace('<span title="BIM,  ', "")
        .replace("</span>", "")
        .split(",");

      let outputContacts = sanitisedContacts.filter((element) => {
        try {
          return phoneNumberRegex.test(element.trim());
        } catch (e) {
          return false;
        }
      });
      outputContacts = [...new Set(outputContacts)];
      setContactsToWork(outputContacts);
    } else {
      alert("No Contacts Selected");
    }
  };

  const handleExportCSV = () => {
    if (contactsToWork) {
      convertContactListsToCSVString(contactsToWork);
    } else {
      alert("No Contacts Selected");
    }
  };

  // Execute the List to CSV String
  const convertContactListsToCSVString = (list) => {
    if (!list) return alert("LIST DB not provided");
    list = convertJsonToCsv(
      list.map((number, index) => {
        return {
          Name: nameRef.current.value
            ? `${nameRef.current.value} ${index}`
            : "GROUP_NAME",
          "Given Name,Additional Name,Family Name,Yomi Name,Given Name Yomi,Additional Name Yomi,Family Name Yomi,Name Prefix,Name Suffix,Initials,Nickname,Short Name,Maiden Name,Birthday,Gender,Location,Billing Information,Directory Server,Mileage,Occupation,Hobby,Sensitivity,Priority,Subject,Notes,Language,Photo,Group Membership,E-mail 1 - Type,E-mail 1 - Value,Phone 1 - Type,":
            ",,,,,,,,,,,,,,,,,,,,,,,,,,,* myContacts,* ,,",
          "Phone 1 - Value": number,
        };
      })
    );
    const csvContent = list;
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "data.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Convert JSON to CSV
  function convertJsonToCsv(jsonData) {
    const header = Object.keys(jsonData[0]).join(",");
    const csvRows = jsonData.map((obj) => Object.values(obj).join(","));

    return `${header}\n${csvRows.join("\n")}`;
  }

  return (
    <div class="bg-gray-200 h-screen flex flex-row items-center justify-center">
      <div class="max-w-lg mx-auto p-6 bg-white rounded-md shadow-md space-y-6">
        <div className=" mb-4 flex gap-4  justify-center items-center">
          <img src={logo} className="App-logo h-12" alt="logo" />
          <h2 class="text-2xl font-semibold">Whatsapp Contacts</h2>
        </div>
        <textarea
          ref={numbersRef}
          id="contactInput"
          class="w-full h-48 px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-300"
          placeholder="Enter unsanitized phone number data..."
        ></textarea>

        <input
          class="w-full h-10 px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-300"
          ref={nameRef}
          placeholder="Custom Name"
        ></input>
        <div class="flex space-x-4">
          <button
            onClick={handleSanitise}
            id="sanitizeButton"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
          >
            Sanitize Data
          </button>

          <button
            onClick={handleExportCSV}
            id="downloadButton"
            class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring focus:border-green-300"
          >
            Download Contacts
          </button>
        </div>
      </div>

      <div class="max-w-lg mx-auto mt-8 p-6 bg-white rounded-md shadow-md max-h-80 min-w-32">
        <h2 class="text-2xl font-semibold mb-4">Contacts List</h2>

        <ul
          id="contactsList"
          class=" max-h-48 min-w-10 list-disc pl-4 overflow-y-scroll"
        >
          {contactsToWork.length ? "" : "No Contacts"}
          {contactsToWork.map((contacts, index) => (
            <li key={index}>{contacts}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
