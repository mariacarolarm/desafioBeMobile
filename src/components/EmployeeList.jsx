import React, { useEffect, useState } from 'react';
import '../EmployeeList.css';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/employees')
      .then(response => response.json())
      .then(data => {
        setEmployees(data);
        setFilteredEmployees(data);
      });
  }, []);

  const handleSearch = () => {
    if (!searchTerm) {
      return setFilteredEmployees(employees)
    }
    const filtered = employees.filter(employee => {
      return (
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.job.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.phone.includes(searchTerm)
      );
    });
    setFilteredEmployees(filtered);
  };

  const handleRowClick = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatPhone = (phone) => {
      const country = phone.slice(0, 2);
      const area = phone.slice(2, 4);
      const firstPart = phone.slice(4, 9);
      const secondPart = phone.slice(9);
      return `+${country} (${area}) ${firstPart}-${secondPart}`;
  };

  return (
    <div className="container">
      <div className="headerTitle">
        <h1>Funcionários</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Pesquisar"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyUp={handleSearch}
          />
          <button onClick={handleSearch}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_1_111)">
                <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="#F0F0F0"/>
              </g>
              <defs>
                <clipPath id="clip0_1_111">
                  <rect width="24" height="24" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </button>
        </div>
      </div>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nome</th>
              {!isMobile && (
                <>
                  <th>Cargo</th>
                  <th>Data de Admissão</th>
                  <th>Telefone</th>
                </>
              )}
              {isMobile && <th></th>}
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map(employee => (
              <React.Fragment key={employee.id}>
                <tr onClick={isMobile ? () => handleRowClick(employee.id) : undefined}>
                  <td><img src={employee.image} alt={employee.name} /></td>
                  <td>{employee.name}</td>
                  {!isMobile && (
                    <>
                      <td>{employee.job}</td>
                      <td>{formatDate(employee.admission_date)}</td>
                      <td>{formatPhone(employee.phone)}</td>
                    </>
                  )}
                  {isMobile && <td>{expandedRows[employee.id] ? '▲' : '▼'}</td>}
                </tr>
                {isMobile && expandedRows[employee.id] && (
                  <tr className="expanded-row">
                    <td colSpan="3">
                      <div>Cargo: {employee.job}</div>
                      <div>Data de admissão: {formatDate(employee.admission_date)}</div>
                      <div>Telefone: {formatPhone(employee.phone)}</div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;
