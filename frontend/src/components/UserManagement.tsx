// frontend/src/components/UserManagement.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  role: string;
}

interface Workspace {
  id: string;
  name: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('gestionnaire');
  const [workspaceId, setWorkspaceId] = useState('');

  useEffect(() => {
  const token = localStorage.getItem('token');
  axios.get('http://backend:3001/api/users', {
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => setUsers(res.data)).catch(err => console.error(err));
  axios.get('http://backend:3001/api/users/workspaces', {
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => setWorkspaces(res.data)).catch(err => console.error(err));
}, []);

const inviteUser = async () => {
  try {
    const token = localStorage.getItem('token');
    await axios.post('http://backend:3001/api/users/invite', { email, role, workspace_id: workspaceId }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert('Invitation envoyée');
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Gestion des utilisateurs</h2>
      <div className="mb-4">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email de l'invité"
          className="p-2 border rounded mr-2"
        />
        <select value={role} onChange={e => setRole(e.target.value)} className="p-2 border rounded mr-2">
          <option value="gestionnaire">Gestionnaire</option>
          <option value="spectateur">Spectateur</option>
        </select>
        <select value={workspaceId} onChange={e => setWorkspaceId(e.target.value)} className="p-2 border rounded mr-2">
          <option value="">Aucun espace de travail</option>
          {workspaces.map(ws => (
            <option key={ws.id} value={ws.id}>{ws.name}</option>
          ))}
        </select>
        <button onClick={inviteUser} className="bg-blue-500 text-white p-2 rounded">Inviter</button>
      </div>
      <h3 className="text-xl mb-2">Utilisateurs</h3>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Email</th>
            <th className="border p-2">Rôle</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">{user.role}</td>
              <td className="border p-2">
                <button className="bg-red-500 text-white p-1 rounded">Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;