import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();

  // Ensure authUser exists before accessing its properties
  const [selectedImg, setSelectedImg] = useState(authUser?.profilePic || null);
  const [name, setName] = useState(authUser?.fullName || "");
  const [user, setUser] = useState(authUser || null);
  const [isEditingName, setIsEditingName] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  const handleNameUpdate = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }
    setIsEditingName(false);
    await updateProfile({ fullName: name });
  };

  // Ensure authUser exists for profile info
  if (!authUser) {
    return <div>Loading...</div>; // Or any loading state you prefer
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 overflow-hidden">
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white shadow-md rounded-lg p-6 space-y-8 overflow-hidden">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-800">Profile</h1>
            <p className="mt-2 text-gray-600">Your profile information</p>
          </div>

          {/* Avatar upload section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-300"
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 
                  bg-blue-600 hover:bg-blue-700
                  p-3 rounded-full cursor-pointer 
                  transition-transform duration-200
                  ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }`}
              >
                <Camera className="w-5 h-5 text-white" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-gray-500">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/* Editable name section */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="px-4 py-2 bg-gray-100 rounded-lg border focus:outline-blue-500 w-full"
                  />
                  <button
                    onClick={handleNameUpdate}
                    className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    disabled={isUpdatingProfile}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setName(authUser?.fullName || "");
                      setIsEditingName(false);
                    }}
                    className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div
                  className="flex items-center justify-between px-4 py-2 bg-gray-100 rounded-lg border cursor-pointer"
                  onClick={() => setIsEditingName(true)}
                >
                  <span>{name || authUser?.fullName || "Your Name"}</span>
                  <button className="text-blue-500 hover:underline">
                    Edit
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2 bg-gray-100 rounded-lg border">
                {user.email || authUser?.email || "Your Email"}
              </p>
            </div>
          </div>

          {/* Account information section */}
          <div className="mt-6 bg-gray-100 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              Account Information
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-gray-300">
                <span>Member Since</span>
                <span>{user.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
