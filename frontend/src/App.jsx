import { useState } from "react";
import axios from "axios";

export default function App() {

    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value)
    }

    function getResults(e) {
        e.preventDefault();
        axios.get(process.env.REACT_APP_API_URL, { params: { q: searchTerm } })
            .then(({ data }) => setResults(data))
            .catch(error => console.log(error));
    }

    return (
        <>
            <input type="text" placeholder="Search" value={searchTerm} onChange={handleSearch} />
            <button onClick={getResults} type='Submit'>Search</button>
            {results.map((result, index) =>
                <>
                    <strong><p>Result {index + 1}</p></strong>
                    <p>{result}</p>
                </>
            )}
        </>
    );
}