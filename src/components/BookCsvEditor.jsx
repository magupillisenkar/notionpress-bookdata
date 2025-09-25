import React, { useState } from "react";
import Papa from "papaparse";
import { faker } from "@faker-js/faker";

const BookCsvEditor = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 20;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setData(results.data);
        setOriginalData(results.data);
        setLoading(false);
      },
    });
  };

  const generateFakeData = () => {
    const books = [];
    for (let i = 0; i < 10000; i++) {
      books.push({
        Title: faker.lorem.words(3),
        Author: faker.person.fullName(),
        Genre: faker.music.genre(),
        PublishedYear: faker.date.past({ years: 50 }).getFullYear(),
        ISBN: faker.string.numeric(13),
      });
    }
    setData(books);
    setOriginalData(books);
  };

  const handleDownload = () => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "edited_books.csv";
    a.click();
  };

  const resetEdits = () => window.location.reload();
  // const resetEdits = () => setData(originalData);

  

  const handleEdit = (rowIndex, key, value) => {
    const newData = [...data];
    newData[rowIndex][key] = value;
    setData(newData);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    const sorted = [...data].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setData(sorted);
  };

  const filteredData = data.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  const startIndex = (page - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Book CSV Editor</h1>

      <div className="flex gap-2 mb-4 flex-wrap">
         <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">

          <input
            type="file" accept=".csv" onChange={handleFileUpload}
            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
          />

        </div>
        <button onClick={generateFakeData} className="bg-blue-500 text-white px-3 py-1 rounded">
          Generate Fake 10k Data
        </button>
        <button onClick={handleDownload} className="bg-green-500 text-white px-3 py-1 rounded">
          Download CSV
        </button>
        <button onClick={resetEdits} className="bg-red-500 text-white px-3 py-1 rounded">
          Reset All Edits
        </button>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-2 py-1"
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p className="mb-2">Rows: {filteredData.length} | Page: {page}</p>
          <table className="table-auto border-collapse border w-full text-sm">
            <thead>
              <tr>
                {data[0] &&
                  Object.keys(data[0]).map((key) => (
                    <th
                      key={key}
                      onClick={() => handleSort(key)}
                      className="border px-2 py-1 cursor-pointer bg-gray-100"
                    >
                      {key} {sortConfig?.key === key ? (sortConfig.direction === "asc" ? "⬆" : "⬇") : ""}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.entries(row).map(([key, value]) => (
                    <td key={key} className="border px-2 py-1">
                      <input
                        value={value}
                        onChange={(e) => handleEdit(startIndex + rowIndex, key, e.target.value)}
                        className="w-full border-none outline-none"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between mt-2">
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
            <button disabled={startIndex + rowsPerPage >= filteredData.length} onClick={() => setPage(page + 1)}>Next</button>
          </div>
        </>
      )}
    </div>
  );
};

export default BookCsvEditor;