const [csvData, setCSVData] = useState([]);
const handleFileUpload = (event) => {
    const file = event.target.files[0];
    
    Papa.parse(file, {
      complete: (result) => {
        const headers = result.data[0];
        const dataRows = result.data.slice(1); // Skip the header row
        
        const arrayOfObjects = dataRows.map((row) => {
          const obj = {};
          headers.forEach((header, index) => {
            obj[header] = row[index];
          });
          return obj;
        });
        
        setCSVData(arrayOfObjects);
      }
    });
  };
