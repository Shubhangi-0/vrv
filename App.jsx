import React, { useState, useEffect } from 'react';

// Mock data for users and roles
const mockUsers = [
  { id: 1, name: 'VRV', email: 'vrvsecurity@gmail.com', role: 'Admin', status: 'Active' },
];

const mockRoles = [
  { id: 1, name: 'Admin' },
  { id: 2, name: 'Manager' },
  { id: 3, name: 'Intern' },
  { id: 4, name: 'Developer' },
  { id: 5, name: 'Editor' },
  { id: 6, name: 'Viewer' },
];

// Simulated API functions (mock)
const getUsers = () => Promise.resolve(mockUsers);
const getRoles = () => Promise.resolve(mockRoles);
const updateUser = (userId, updates) => {
  const user = mockUsers.find(u => u.id === userId);
  if (user) {
    Object.assign(user, updates);
  }
  return Promise.resolve(user);
};
const createUser = (user) => {
  mockUsers.push(user);
  return Promise.resolve(user);
};
const deleteUser = (userId) => {
  const index = mockUsers.findIndex(u => u.id === userId);
  if (index > -1) mockUsers.splice(index, 1);
  return Promise.resolve();
};

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: '', status: 'Active' });
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const usersData = await getUsers();
      const rolesData = await getRoles();
      setUsers(usersData);
      setRoles(rolesData);
    };
    fetchData();
  }, []);

  const handleAddUser = async () => {
    if (newUser.name && newUser.email && newUser.role) {
      const createdUser = await createUser({ ...newUser, id: users.length + 1 });

      setUsers(prevUsers => {
        const isDuplicate = prevUsers.some(user => user.email === newUser.email || user.name === newUser.name);
        if (!isDuplicate) {
          return [...prevUsers, createdUser];
        }
        return prevUsers;
      });

      setNewUser({ name: '', email: '', role: '', status: 'Active' });
    }
  };

  const handleEditUser = (userId) => {
    const user = users.find(u => u.id === userId);
    setSelectedUser({ ...user });
  };

  const handleUpdateUser = async () => {
    const updatedUser = await updateUser(selectedUser.id, selectedUser);
    setUsers(users.map(u => (u.id === selectedUser.id ? updatedUser : u)));
    setSelectedUser(null);
  };

  const handleDeleteUser = async (userId) => {
    await deleteUser(userId);
    setUsers(users.filter(u => u.id !== userId));
  };

  const handleChangeStatus = async (userId, newStatus) => {
    const updatedUser = await updateUser(userId, { status: newStatus });
    setUsers(users.map(u => (u.id === userId ? updatedUser : u)));
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode', !isDarkMode);
  };

  return (
    <div className={`dashboard ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <button className="btn dark-mode-toggle" onClick={toggleDarkMode}>
        Toggle Dark Mode
      </button>

      <h1>User Management</h1>

      <div className="user-list">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="table-row">
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    className={`btn-status ${user.status === 'Active' ? 'active' : 'inactive'}`}
                    onClick={() => handleChangeStatus(user.id, user.status === 'Active' ? 'Inactive' : 'Active')}
                  >
                    {user.status}
                  </button>
                </td>
                <td>
                  <button className="btn btn-edit" onClick={() => handleEditUser(user.id)}>Edit</button><br></br><br></br>
                  <button className="btn btn-delete" onClick={() => handleDeleteUser(user.id)}>Delete</button><br></br>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="add-user-form">
        <h3>Add New User</h3>
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={e => setNewUser({ ...newUser, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={e => setNewUser({ ...newUser, email: e.target.value })}
        />
        <select
          value={newUser.role}
          onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
          {roles.map(role => (
            <option key={role.id} value={role.name}>{role.name}</option>
          ))}
        </select>
        <button className="btn btn-add" onClick={handleAddUser}>Add User</button>
      </div>

      {/* Edit User Modal */}
      {selectedUser && (
        <div className="edit-user-modal">
          <h3>Edit User</h3><br></br>
          <input
            type="text"
            value={selectedUser.name}
            onChange={e => setSelectedUser({ ...selectedUser, name: e.target.value })}
          />
          <input
            type="email"
            value={selectedUser.email}
            onChange={e => setSelectedUser({ ...selectedUser, email: e.target.value })}
          />
          <select
            value={selectedUser.role}
            onChange={e => setSelectedUser({ ...selectedUser, role: e.target.value })}>
            {roles.map(role => (
              <option key={role.id} value={role.name}>{role.name}</option>
            ))}
          </select>
          <button className="btn btn-edit" onClick={handleUpdateUser}>Update</button><br></br>
          <button className="btn btn-cancel" onClick={() => setSelectedUser(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;






// import React, { useState, useEffect } from 'react';

// // Mock data for users and roles
// const mockUsers = [
//   { id: 1, name: 'VRV', email: 'vrvsecurity@gmail.com', role: 'Admin', status: 'Active' },
// ];

// const mockRoles = [
//   { id: 1, name: 'Admin' },
//   { id: 2, name: 'Manager' },
//   { id: 3, name: 'Intern' },
//   { id: 4, name: 'Developer' },
//   { id: 5, name: 'Editor' },
//   { id: 6, name: 'Viewer' },
// ];

// // Simulated API functions (mock)
// const getUsers = () => Promise.resolve(mockUsers);
// const getRoles = () => Promise.resolve(mockRoles);
// const updateUser = (userId, updates) => {
//   const user = mockUsers.find(u => u.id === userId);
//   if (user) {
//     Object.assign(user, updates);
//   }
//   return Promise.resolve(user);
// };
// const createUser = (user) => {
//   mockUsers.push(user);
//   return Promise.resolve(user);
// };
// const deleteUser = (userId) => {
//   const index = mockUsers.findIndex(u => u.id === userId);
//   if (index > -1) mockUsers.splice(index, 1);
//   return Promise.resolve();
// };

// const AdminDashboard = () => {
//   const [users, setUsers] = useState([]);
//   const [roles, setRoles] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [newUser, setNewUser] = useState({ name: '', email: '', role: '', status: 'Active' });
//   const [isDarkMode, setIsDarkMode] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       const usersData = await getUsers();
//       const rolesData = await getRoles();
//       setUsers(usersData);
//       setRoles(rolesData);
//     };
//     fetchData();
//   }, []);

//   const handleAddUser = async () => {
//     if (newUser.name && newUser.email && newUser.role) {
//       const createdUser = await createUser({ ...newUser, id: users.length + 1 });

//       setUsers(prevUsers => {
//         const isDuplicate = prevUsers.some(user => user.email === newUser.email || user.name === newUser.name);
//         if (!isDuplicate) {
//           return [...prevUsers, createdUser];
//         }
//         return prevUsers;
//       });

//       setNewUser({ name: '', email: '', role: '', status: 'Active' });
//     }
//   };

//   const handleEditUser = (userId) => {
//     const user = users.find(u => u.id === userId);
//     setSelectedUser({ ...user });
//   };

//   const handleUpdateUser = async () => {
//     const updatedUser = await updateUser(selectedUser.id, selectedUser);
//     setUsers(users.map(u => (u.id === selectedUser.id ? updatedUser : u)));
//     setSelectedUser(null);
//   };

//   const handleDeleteUser = async (userId) => {
//     await deleteUser(userId);
//     setUsers(users.filter(u => u.id !== userId));
//   };

//   const handleChangeStatus = async (userId, newStatus) => {
//     const updatedUser = await updateUser(userId, { status: newStatus });
//     setUsers(users.map(u => (u.id === userId ? updatedUser : u)));
//   };

//   const toggleDarkMode = () => {
//     setIsDarkMode(!isDarkMode);
//     document.body.classList.toggle('dark-mode', !isDarkMode);
//   };

//   return (
//     <div className={`dashboard ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
//       <button className="btn" onClick={toggleDarkMode}>
//         Toggle Dark Mode
//       </button>

//       <h1>User Management</h1>

//       <div className="user-list">
//         <table>
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Role</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map(user => (
//               <tr key={user.id}>
//                 <td>{user.name}</td>
//                 <td>{user.email}</td>
//                 <td>{user.role}</td>
//                 <td>
//                   <button
//                     className={`btn-status ${user.status === 'Active' ? 'active' : 'inactive'}`}
//                     onClick={() => handleChangeStatus(user.id, user.status === 'Active' ? 'Inactive' : 'Active')}
//                   >
//                     {user.status}
//                   </button>
//                 </td>
//                 <td>
//                   <button className="btn-edit" onClick={() => handleEditUser(user.id)}>Edit</button>
//                   <span style={{ marginRight: '8px' }} />
//                   <button className="btn-delete" onClick={() => handleDeleteUser(user.id)}>Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="add-user">
//         <h3>Add New User</h3>
//         <input
//           type="text"
//           placeholder="Name"
//           value={newUser.name}
//           onChange={e => setNewUser({ ...newUser, name: e.target.value })}
//         />
//         <input
//           type="email"
//           placeholder="Email"
//           value={newUser.email}
//           onChange={e => setNewUser({ ...newUser, email: e.target.value })}
//         />
//         <select
//           value={newUser.role}
//           onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
//           {roles.map(role => (
//             <option key={role.id} value={role.name}>{role.name}</option>
//           ))}
//         </select>
//         <button className="btn-add" onClick={handleAddUser}>Add User</button>
//       </div>

//       {/* Edit User Modal */}
//       {selectedUser && (
//         <div className="edit-user-modal">
//           <h3>Edit User</h3>
//           <input
//             type="text"
//             value={selectedUser.name}
//             onChange={e => setSelectedUser({ ...selectedUser, name: e.target.value })}
//           />
//           <input
//             type="email"
//             value={selectedUser.email}
//             onChange={e => setSelectedUser({ ...selectedUser, email: e.target.value })}
//           />
//           <select
//             value={selectedUser.role}
//             onChange={e => setSelectedUser({ ...selectedUser, role: e.target.value })}>
//             {roles.map(role => (
//               <option key={role.id} value={role.name}>{role.name}</option>
//             ))}
//           </select>
//           <button className="btn-edit" onClick={handleUpdateUser}>Update</button>
//           <button className="btn-cancel" onClick={() => setSelectedUser(null)}>Cancel</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminDashboard;




// import React, { useState, useEffect } from 'react';

// // Mock data for users and roles
// const mockUsers = [
//   { id: 1, name: 'VRV Security', email: 'vrvsecurity@gmail.com', role: 'Admin', status: 'Active' }
// ];

// const mockRoles = [
//   { id: 1, name: 'Admin', permissions: ['Read', 'Write', 'Delete'] },
//   { id: 2, name: 'Editor', permissions: ['Read', 'Write'] },
//   { id: 3, name: 'Viewer', permissions: ['Read'] },
// ];

// // Simulated API functions (mock)
// const getUsers = () => Promise.resolve(mockUsers);
// const getRoles = () => Promise.resolve(mockRoles);
// const updateUser = (userId, updates) => {
//   const user = mockUsers.find(u => u.id === userId);
//   if (user) {
//     Object.assign(user, updates);
//   }
//   return Promise.resolve(user);
// };
// const createUser = (user) => {
//   mockUsers.push(user);
//   return Promise.resolve(user);
// };
// const deleteUser = (userId) => {
//   const index = mockUsers.findIndex(u => u.id === userId);
//   if (index > -1) mockUsers.splice(index, 1);
//   return Promise.resolve();
// };

// const AdminDashboard = () => {
//   const [users, setUsers] = useState([]);
//   const [roles, setRoles] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [newUser, setNewUser] = useState({ name: '', email: '', role: '', status: 'Active' });
//   const [isDarkMode, setIsDarkMode] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       const usersData = await getUsers();
//       const rolesData = await getRoles();
//       setUsers(usersData);
//       setRoles(rolesData);
//     };
//     fetchData();
//   }, []);

//   const handleAddUser = async () => {
//     if (newUser.name && newUser.email && newUser.role) {
//       const createdUser = await createUser({ ...newUser, id: users.length + 1 });

//       setUsers(prevUsers => {
//         const isDuplicate = prevUsers.some(user => user.email === newUser.email || user.name === newUser.name);
//         if (!isDuplicate) {
//           return [...prevUsers, createdUser];
//         }
//         return prevUsers;
//       });

//       setNewUser({ name: '', email: '', role: '', status: 'Active' }); 
//     }
//   };

//   // Open the edit modal with selected user data
//   const handleEditUser = (userId) => {
//     const user = users.find(u => u.id === userId);
//     setSelectedUser({ ...user });  // Create a copy to avoid direct mutation
//   };

//   // Handle user data update
//   const handleUpdateUser = async () => {
//     const updatedUser = await updateUser(selectedUser.id, selectedUser);
//     setUsers(users.map(u => (u.id === selectedUser.id ? updatedUser : u)));
//     setSelectedUser(null);
//   };

//   // Handle user deletion
//   const handleDeleteUser = async (userId) => {
//     await deleteUser(userId);
//     setUsers(users.filter(u => u.id !== userId)); 
//   };

//   const handleChangeStatus = async (userId, newStatus) => {
//     const updatedUser = await updateUser(userId, { status: newStatus });
//     setUsers(users.map(u => (u.id === userId ? updatedUser : u)));
//   };

//   const toggleDarkMode = () => {
//     setIsDarkMode(!isDarkMode);
//     document.body.classList.toggle('dark-mode', !isDarkMode);
//   };

//   return (
//     <div className={`dashboard ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
//       <button className="btn" onClick={toggleDarkMode}>
//         Toggle Dark Mode
//       </button>

//       <h1>User Management</h1>

//       <div className="user-list">
//         <table>
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Role</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map(user => (
//               <tr key={user.id}>
//                 <td>{user.name}</td>
//                 <td>{user.email}</td>
//                 <td>{user.role}</td>
//                 <td>
//                   <button
//                     className={`btn-status ${user.status === 'Active' ? 'active' : 'inactive'}`}
//                     onClick={() => handleChangeStatus(user.id, user.status === 'Active' ? 'Inactive' : 'Active')}
//                   >
//                     {user.status}
//                   </button>
//                 </td>
//                 <td>
//                   <button className="btn-edit" onClick={() => handleEditUser(user.id)}>Edit</button>
//                   <span style={{ marginRight: '8px' }} />
//                   <button className="btn-delete" onClick={() => handleDeleteUser(user.id)}>Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="add-user">
//         <h3>Add New User</h3>
//         <input 
//           type="text" 
//           placeholder="Name" 
//           value={newUser.name} 
//           onChange={e => setNewUser({ ...newUser, name: e.target.value })} 
//         />
//         <input 
//           type="email" 
//           placeholder="Email" 
//           value={newUser.email} 
//           onChange={e => setNewUser({ ...newUser, email: e.target.value })} 
//         />
//         <select 
//           value={newUser.role} 
//           onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
//           {roles.map(role => (
//             <option key={role.id} value={role.name}>{role.name}</option>
//           ))}
//         </select>
//         <button className="btn-add" onClick={handleAddUser}>Add User</button>
//       </div>

//       {/* Edit User Modal */}
//       {selectedUser && (
//         <div className="edit-user-modal">
//           <h3>Edit User</h3>
//           <input 
//             type="text" 
//             value={selectedUser.name} 
//             onChange={e => setSelectedUser({ ...selectedUser, name: e.target.value })} 
//           />
//           <input 
//             type="email" 
//             value={selectedUser.email} 
//             onChange={e => setSelectedUser({ ...selectedUser, email: e.target.value })} 
//           />
//           <select 
//             value={selectedUser.role} 
//             onChange={e => setSelectedUser({ ...selectedUser, role: e.target.value })}>
//             {roles.map(role => (
//               <option key={role.id} value={role.name}>{role.name}</option>
//             ))}
//           </select>
//           <button className="btn-edit" onClick={handleUpdateUser}>Update</button>
//           <button className="btn-cancel" onClick={() => setSelectedUser(null)}>Cancel</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminDashboard;



