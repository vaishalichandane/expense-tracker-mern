function ProfilePage() {

  const user =
    JSON.parse(localStorage.getItem('user'));

  return (
    <div>

      <h1>Profile</h1>

      <h2>{user?.name}</h2>

      <h2>{user?.email}</h2>

    </div>
  );
}

export default ProfilePage;