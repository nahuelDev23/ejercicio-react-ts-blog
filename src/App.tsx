import { SortBy, User } from "./types.d";

import { UsersList } from "./components/UsersList";
import { useEffect, useMemo, useRef, useState } from "react";

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [haveRowsColor, setHaveRowsColor] = useState<boolean>(false);
  const [sortingBy, setSortingBy] = useState<SortBy>(SortBy.NONE);
  const [filterCountry, setFilterCountry] = useState<string | null>(null);
  const originalData = useRef<User[]>([])

  useEffect(() => {
    fetch("https://randomuser.me/api?results=100")
      .then(async (res) => await res.json())
      .then((res) => {
        setUsers(res.results);
        originalData.current = res.results;
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const filteredDataByCountry = useMemo(() => {
    return filterCountry !== null && filterCountry.length > 0
      ? users.filter(user => user.location.country.toLowerCase().includes(filterCountry.toLowerCase()))
      : users
  }, [users, filterCountry])

  const handleDelete = (email: string) => {
    const filteredUsers = users.filter((user) => user.email !== email)
    setUsers(filteredUsers)
  }

  const handleToggleSortByCountry = () => {
    sortingBy === SortBy.NONE
      ? setSortingBy(SortBy.COUNTRY)
      : setSortingBy(SortBy.NONE);
  };

  const handleToggleRowsColor = () => {
    setHaveRowsColor(!haveRowsColor);
  };

  const handleRestoreData = () => {
    setUsers(originalData.current)
  }

  const sortedData = useMemo(() => {
    if (sortingBy === SortBy.NONE) return filteredDataByCountry

    const compareProperty :Record<string,(user:User)=>any> = {
      [SortBy.COUNTRY]: user => user.location.country,
      [SortBy.NAME]: user => user.name.first,
      [SortBy.LAST]: user => user.name.last,

    }

    return [...filteredDataByCountry].sort((a, b) => {
      const extractProperty = compareProperty[sortingBy]
      return extractProperty(a).localeCompare(extractProperty(b))
    })

  }, [sortingBy, filteredDataByCountry]);

  return (
    <div className="App">
      <div>
        <button onClick={handleToggleRowsColor}>Toggle Rows Color</button>
        <button onClick={handleToggleSortByCountry}>Toggle Sort Country</button>
        <button onClick={handleRestoreData}>RestoreData</button>
        <input onChange={(e) => setFilterCountry(e.target.value)} />
      </div>
      <UsersList
        users={sortedData}
        haveRowsColor={haveRowsColor}
        onDelete={handleDelete}
        onSort={setSortingBy}
      />
    </div>
  );
}

