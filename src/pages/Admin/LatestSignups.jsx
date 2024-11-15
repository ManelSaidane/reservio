// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import emailIcon from '../../assets/gmail.png';
// import avatar from '../../assets/utilisateur.png';
// import './LatestSignups.css';

// const LatestSignups = () => {
//   const [latestUsers, setLatestUsers] = useState([]);

//   useEffect(() => {
//     const fetchLatestSignups = async () => {
//       try {
//         const token = localStorage.getItem('jwt');
//         if (token) {
//           const response = await axios.get('http://localhost:3000/users/latest-signups', {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });
//           setLatestUsers(response.data);
//         }
//       } catch (error) {
//         console.error('Erreur lors de la récupération des derniers utilisateurs inscrits :', error);
//       }
//     };

//     fetchLatestSignups();
//   }, []);

//   const handleSendEmail = (email) => {
//     window.open(`mailto:${email}`);
//   };

//   return (
//     <div className="latest-signups">
//       <h2>New Customers</h2>
//       <table className="signup-table">
//         <thead>
//           <tr>
//             <th>Avatar</th>
//             <th>Nom</th>
//             <th>Email</th>
//             <th>Contact</th>
//           </tr>
//         </thead>
//         <tbody>
//           {latestUsers.map(user => (
//             <tr key={user.ID}>
//               <td><img src={avatar} alt="Avatar" className="avatar"/></td>
//               <td>{`${user.Nom} ${user.Prenom}`}</td>
//               <td>{user.Email}</td>
//               <td>
//                 <img src={emailIcon} alt="Email Icon" className="email-icon" onClick={() => handleSendEmail(user.Email)} />
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default LatestSignups;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import avatar from '../../assets/utilisateur.png'; // Assurez-vous que le chemin de l'avatar est correct
import './LatestSignups.css'; // Fichier CSS pour styliser le composant

const LatestSignups = () => {
  const [latestSignups, setLatestSignups] = useState([]);

  useEffect(() => {
    fetchLatestSignups();
  }, []);

  const fetchLatestSignups = async () => {
    try {
      const token = localStorage.getItem('jwt');
      const response = await axios.get('http://localhost:3000/users/latestsignups', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLatestSignups(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des dernières inscriptions:', error);
    }
  };

  return (
    <div className="latest-signups">
      <h2>Dernières inscriptions</h2>
      <table className="signups-table">
        <thead>
          <tr>
            <th>Avatar</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Numéro</th>
            <th>Inscrit le</th>
          </tr>
        </thead>
        <tbody>
          {latestSignups.map(user => (
            <tr key={user.ID}>
              <td>
                <img src={avatar} alt="Avatar" className="signup-avatar" />
              </td>
              <td>{user.Nom}</td>
              <td>{user.Email}</td>
              <td>{user.Num}</td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LatestSignups;
