import React from "react";

const MobileAppComingSoon: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-white to-gray-50 py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Mobile App Coming Soon</h2>
          <p className="text-lg text-gray-600 mb-8">
            We're working on bringing the full power of our invoicing platform
            to your mobile device. Stay tuned for updates!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full sm:w-64">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="font-semibold mb-2">iOS App</h3>
              <p className="text-sm text-gray-600">
                Coming soon to the App Store
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg w-full sm:w-64">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="font-semibold mb-2">Android App</h3>
              <p className="text-sm text-gray-600">
                Coming soon to Google Play
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileAppComingSoon;
