import { SortBy,User } from "../types.d";

interface Props {
  users: User[];
  haveRowsColor: boolean;
  onDelete: (email: string) => void
  onSort: (sort:SortBy ) => void

}

export function UsersList({ users, haveRowsColor, onDelete,onSort}: Props) {
  const paintRow = (index: number) =>
    haveRowsColor
      ? { backgroundColor: index % 2 === 0 ? "#999" : "#666" }
      : undefined;

  return (
    <table>
      <thead>
        <tr>
          <th>Foto</th>
          <th onClick={()=>onSort(SortBy.NAME)}>Nombre</th>
          <th onClick={()=>onSort(SortBy.LAST)}>Apellido</th>
          <th onClick={()=>onSort(SortBy.COUNTRY)}>País</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {users.map((user, index) => {
          return (
            <tr key={user.email} style={paintRow(index)}>
              <td>
                <img src={user.picture.thumbnail} />
              </td>
              <td >{user.name.first}</td>
              <td >{user.name.last}</td>
              <td >{user.location.country}</td>
              <td>
                <button onClick={() => onDelete(user.email)}>Borrar</button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

