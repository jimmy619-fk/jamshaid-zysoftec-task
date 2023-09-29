import React,
{
  useState,
  useEffect
}

  from 'react';

import {
  db
}

  from './firebase'; // Import Firebase configuration
import './App.css'; // Import your custom CSS for styling

function App() {
  const dashboardStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
  }

    ;

  const tableStyles = {
    width: '80%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  }
  

    ;




  const [csvData,
    setCsvData] = useState([]);
  const [selectedFile,
    setSelectedFile] = useState(null);
  const [dataUploaded,
    setDataUploaded] = useState(false);
  const [loading,
    setLoading] = useState(false);
  const [error,
    setError] = useState(null);
  const [editIndex,
    setEditIndex] = useState(null);
  const [deleteIndex,
    setDeleteIndex] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    const reader = new FileReader();

    reader.onload = async (e) => {
      const text = e.target.result;
      const rows = text.split('\n');

      const students = rows.map((row) => {
        const [name, age, grade] = row.split(',');

        return {
          name, age, grade
        }

          ;
      });

      setCsvData(students);
    }

      ;

    reader.readAsText(file);
  }

    ;

  const uploadToFirebase = async () => {
    const studentsRef = db.collection('students');

    // Filter out records with missing age field
    const validStudents = csvData.filter((student) => student.age !== undefined);

    try {
      setLoading(true);

      // Upload each valid student record to Firebase
      for (const student of validStudents) {
        await studentsRef.add(student);
      }

      // Clear the CSV data and mark data as uploaded
      setCsvData([]);
      setSelectedFile(null);
      setDataUploaded(true);
      setLoading(false);
    }

    catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

    ;

  const handleEdit = (index) => {
    // Open a modal for editing the student data or navigate to an edit page
    setEditIndex(index);
  }

    ;

  const handleDelete = (index) => {
    // Show a confirmation dialog for deleting the student data
    setDeleteIndex(index);
  }

    ;

  const confirmDelete = async () => {
    try {
      setLoading(true);

      // Delete the student record from Firebase
      const studentToDelete = csvData[deleteIndex];
      const studentsRef = db.collection('students');
      const querySnapshot = await studentsRef.where('name', '==', studentToDelete.name).get();

      querySnapshot.forEach(async (doc) => {
        await doc.ref.delete();
      });

      // Clear the CSV data and close the confirmation dialog
      setCsvData((prevData) => prevData.filter((_, index) => index !== deleteIndex));
      setDeleteIndex(null);
      setLoading(false);
    }

    catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

    ;

  // State to manage edited student data
  const [editedStudent,
    setEditedStudent] = useState({
      name: '',
      age: '',
      grade: '',
    });

  // Function to handle changes in the edit form
  const handleEditFormChange = (event) => {
    const {
      name,
      value
    }

      = event.target;

    setEditedStudent((prevStudent) => ({
      ...prevStudent,
      [name]: value,
    }));
  }

    ;

  // Function to save the edited student data
  const saveEditedStudent = async () => {
    try {
      setLoading(true);

      // Update the student record in Firebase
      const studentToEdit = csvData[editIndex];
      const studentsRef = db.collection('students');
      const querySnapshot = await studentsRef.where('name', '==', studentToEdit.name).get();

      querySnapshot.forEach(async (doc) => {
        await doc.ref.update(editedStudent);
      });

      // Update the csvData state with the edited data
      const updatedCsvData = [...csvData];
      updatedCsvData[editIndex] = editedStudent;
      setCsvData(updatedCsvData);

      // Clear the edit state and close the edit modal
      setEditedStudent({
        name: '',
        age: '',
        grade: '',
      });
      setEditIndex(null);
      setLoading(false);
    }

    catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

    ;

  useEffect(() => {
    if (dataUploaded) {
      setLoading(true);
      setError(null);

      // Fetch data from Firestore here and update csvData state
      const fetchDataFromFirestore = async () => {
        try {
          const studentsRef = db.collection('students');
          const snapshot = await studentsRef.get();

          const studentsData = [];

          snapshot.forEach((doc) => {
            studentsData.push(doc.data());
          });

          setCsvData(studentsData);
          setLoading(false);
        }

        catch (error) {
          setError(error.message);
          setLoading(false);
        }
      }

        ;

      fetchDataFromFirestore();
    }
  }

    , [dataUploaded]);

  return (<div className="app" > <h1>Student Records Dashboard</h1> <input type="file" accept=".csv" onChange={
    handleFileUpload
  }

  /> {
      selectedFile && (<button onClick={
        uploadToFirebase
      }

        disabled={
          loading
        }

      > Upload to Firebase </button>)
    }

    {
      error && <p className="error" > {
        error
      }

      </p>
    }

    {
      loading && <p>Loading...</p>
    }

    {
      dataUploaded && !loading && (<div style={
        dashboardStyles
      }

      > <table style={
        tableStyles
      }

      > <tbody> <tr> <th className='' >Name</th> <th>Age</th> <th>Gender</th> </tr> {
        csvData.map((student, index) => (<tr key={
          index
        }

        > <td> {
          student.name
        }

          </td> <td> {
            student.age
          }

          </td> <td> {
            student.grade
          }

          </td> <td> <button onClick={
            () => handleEdit(index)
          }

          >Edit</button> <button onClick={
            () => handleDelete(index)
          }

          >Delete</button> </td> </tr>))
      }

          </tbody> </table> </div>)
    }

    {
      editIndex !== null && (<div className="modal" > {
        /* Edit Student Data Modal */
      }

        <h2>Edit Student Data</h2> <form> <label>Name:</label> <input type="text"
          name="name"

          value={
            editedStudent.name
          }

          onChange={
            handleEditFormChange
          }

        /> <label>Age:</label> <input type="text"
          name="age"

          value={
            editedStudent.age
          }

          onChange={
            handleEditFormChange
          }

          /> <label>Grade:</label> <input type="text"
            name="grade"

            value={
              editedStudent.grade
            }

            onChange={
              handleEditFormChange
            }

          /> </form> <button onClick={
            saveEditedStudent
          }

          >Save</button> <button onClick={
            () => setEditIndex(null)
          }

          >Cancel</button> </div>)
    }

    {
      deleteIndex !== null && (<div className="confirmation-dialog" > {
        /* Delete Confirmation Dialog */
      }

        <p>Are you sure you want to delete this student?</p> <button onClick={
          confirmDelete
        }

          disabled={
            loading
          }

        > Confirm </button> <button onClick={
          () => setDeleteIndex(null)
        }

        >Cancel</button> </div>)
    }

  </div >);
}

export default App;