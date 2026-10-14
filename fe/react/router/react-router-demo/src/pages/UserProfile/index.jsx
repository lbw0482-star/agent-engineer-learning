import {
  useParams
} from 'react-router-dom';

function UserProfile() {
  // params ? 
  // hooks 思想 召之即来
  let { id } = useParams();
  console.log(id, '////');
  return (
    <>
      <h2>User Profile: {id}</h2>
    </>
  )
}

export default UserProfile