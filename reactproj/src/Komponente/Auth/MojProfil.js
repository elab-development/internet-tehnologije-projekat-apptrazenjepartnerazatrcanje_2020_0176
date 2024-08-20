import React, { useState } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';
import { matchSorter } from 'match-sorter';
import axios from 'axios';
import Modal from 'react-modal';

const MojProfil = () => {
  const { user, loading, error, setUser } = useUserProfile();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newPlan, setNewPlan] = useState({
    location: 'Central Park',
    latitude: '40.785091',
    longitude: '-73.968285',
    time: new Date().toISOString().slice(0, 16), // Trenutno vreme formatirano za `datetime-local` input
    distance: '5',
  });

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

  const handleInputChange = (e) => {
    setNewPlan({
      ...newPlan,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Izvucite token iz session storage-a
      const token = sessionStorage.getItem('auth_token');
  
      // Konvertujemo `time` u format `Y-m-d H:i:s`
      const formattedTime = new Date(newPlan.time).toISOString().slice(0, 19).replace('T', ' ');
  
      const response = await axios.post(
        'http://127.0.0.1:8000/api/run-plans',
        {
          ...newPlan,
          time: formattedTime, // Postavimo pravilno formatirano vreme
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Ažuriramo stanje korisnika sa novim planom
      setUser(prevState => ({
        ...prevState,
        run_plans: [...prevState.run_plans, response.data.data],
      }));
  
      setModalIsOpen(false);
      setNewPlan({ location: '', latitude: '', longitude: '', time: '', distance: '' });
    } catch (err) {
      console.error('Error adding plan:', err);
    }
  };
  

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
            <button onClick={() => setModalIsOpen(true)} className="add-plan-button">
              Dodaj Plan Trčanja
            </button>
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

            {/* Modal za dodavanje novog plana trčanja */}
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={() => setModalIsOpen(false)}
              contentLabel="Dodaj Plan Trčanja"
              className="modal-content"
              overlayClassName="modal-overlay"
            >
              <h2>Dodaj Novi Plan Trčanja</h2>
              <form onSubmit={handleSubmit} className="form">
                <label>
                  Lokacija:
                  <input type="text" name="location" value={newPlan.location} onChange={handleInputChange} required />
                </label>
                <label>
                  Latitude:
                  <input type="text" name="latitude" value={newPlan.latitude} onChange={handleInputChange} required />
                </label>
                <label>
                  Longitude:
                  <input type="text" name="longitude" value={newPlan.longitude} onChange={handleInputChange} required />
                </label>
                <label>
                  Datum i Vreme:
                  <input type="datetime-local" name="time" value={newPlan.time} onChange={handleInputChange} required />
                </label>
                <label>
                  Distanca (km):
                  <input type="number" name="distance" value={newPlan.distance} onChange={handleInputChange} required />
                </label>
                <button type="submit">Dodaj Plan</button>
                <button type="button" onClick={() => setModalIsOpen(false)}>
                  Zatvori
                </button>
              </form>
            </Modal>
          </div>
        ) : (
          <p>Nema dostupnih podataka o korisniku.</p>
        )}
      </div>
    </div>
  );
};

export default MojProfil;
