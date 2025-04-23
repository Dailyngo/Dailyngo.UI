import UserProfile from "@/components/profile/userProfile";

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <UserProfile userId={null} />
    </div>
  );
};

export default ProfilePage;