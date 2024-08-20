import React from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';
import { matchSorter } from 'match-sorter';

const MojProfil = () => {
  const { user, loading, error } = useUserProfile();

  const columns = React.useMemo(
    () => [
      {
        Header: 'Lokacija',
        accessor: 'location',
      },
      {
        Header: 'Datum i Vreme',
        accessor: 'time',
      },
      {
        Header: 'Distanca (km)',
        accessor: 'distance',
      },
    ],
    []
  );

  const data = React.useMemo(() => user?.run_plans || [], [user]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, 
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    setPageSize,
    state,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
      globalFilter: (rows, columnIds, filterValue) => {
        return matchSorter(rows, filterValue, { keys: columnIds });
      },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { globalFilter, pageIndex, pageSize } = state;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="profil-container">
      <div className="profil-content">
        {user ? (
          <div>
            <div className="profil-header">
              {user.profile_photo_url && (
                <img src={user.profile_photo_url} alt="Profile" className="profil-img" />
              )}
              <div className="profil-info">
                <h1>{user.name}</h1>
                <p>Email: {user.email}</p>
                <p>Uloga: {user.role_id === 1 ? 'Admin' : 'Korisnik'}</p>
              </div>
            </div>

            <h2>Planovi Trčanja</h2>
            <input
              value={globalFilter || ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Pretraži planove trčanja"
              style={{ marginBottom: '10px', padding: '5px', width: '100%' }}
            />
            {user.run_plans.length > 0 ? (
              <>
                <div className="profil-table-container">
                  <table {...getTableProps()} className="profil-table">
                    <thead>
                      {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                          {headerGroup.headers.map(column => (
                            <th
                              {...column.getHeaderProps(column.getSortByToggleProps())}
                            >
                              {column.render('Header')}
                              <span>
                                {column.isSorted
                                  ? column.isSortedDesc
                                    ? ' 🔽'
                                    : ' 🔼'
                                  : ''}
                              </span>
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                      {page.map(row => {
                        prepareRow(row);
                        return (
                          <tr {...row.getRowProps()}>
                            {row.cells.map(cell => (
                              <td {...cell.getCellProps()}>
                                {cell.render('Cell')}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="pagination-container">
                  <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                    Prethodna
                  </button>
                  <button onClick={() => nextPage()} disabled={!canNextPage}>
                    Sledeća
                  </button>
                  <span>
                    Strana{' '}
                    <strong>
                      {pageIndex + 1} od {pageOptions.length}
                    </strong>{' '}
                  </span>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                  >
                    {[10, 20, 30, 40, 50].map(pageSize => (
                      <option key={pageSize} value={pageSize}>
                        Prikaži {pageSize}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <p>Nema planova trčanja.</p>
            )}
          </div>
        ) : (
          <p>Nema dostupnih podataka o korisniku.</p>
        )}
      </div>
    </div>
  );
};

export default MojProfil;
