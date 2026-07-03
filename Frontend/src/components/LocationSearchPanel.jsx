import React, { useEffect, useState } from "react";

const LocationSearchPanel = ({
  setConfirmOrderPanel,
  setPanelopen,
  setSelectedLocation,
}) => {
  const [userLocation, setUserLocation] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);

  const [manualAddress, setManualAddress] = useState({
    house: "",
    building: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
  });

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported.");
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );

          const data = await res.json();

          const address = data.display_name;

          setUserLocation(address);

          setSelectedLocation(address);

          setPanelopen(false);
          setConfirmOrderPanel(true);
        } catch (err) {
          console.log(err);
        } finally {
          setLoadingLocation(false);
        }
      },
      () => {
        alert("Unable to fetch location.");
        setLoadingLocation(false);
      }
    );
  };

  const handleManualSubmit = () => {
    const address = `${manualAddress.house}, ${manualAddress.building}, ${manualAddress.area}, ${manualAddress.city}, ${manualAddress.state} - ${manualAddress.pincode}`;

    setSelectedLocation(address);

    setPanelopen(false);

    setConfirmOrderPanel(true);
  };

  return (
    <div className="bg-white rounded-t-3xl p-6">

      {/* Header */}

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold">
          Delivery Address
        </h2>

        <button
          onClick={() => setPanelopen(false)}
          className="text-3xl"
        >
          ✕
        </button>

      </div>

      {/* Current Location */}

      <div
        onClick={getCurrentLocation}
        className="border rounded-xl p-5 cursor-pointer hover:bg-green-50 mb-8"
      >

        <div className="flex items-center gap-4">

          <div className="bg-green-100 w-12 h-12 rounded-full flex justify-center items-center">

            <i className="ri-navigation-fill text-green-600 text-xl"></i>

          </div>

          <div>

            <h3 className="font-bold text-lg">
              Use Current Location
            </h3>

            <p className="text-gray-500 text-sm">

              {loadingLocation
                ? "Detecting your location..."
                : "Automatically detect your current address"}

            </p>

          </div>

        </div>

      </div>

      <div className="flex items-center my-6">

        <div className="flex-1 h-px bg-gray-300"></div>

        <span className="px-4 text-gray-500 font-medium">
          OR
        </span>

        <div className="flex-1 h-px bg-gray-300"></div>

      </div>

      <h3 className="font-bold text-xl mb-4">
        Add Address Manually
      </h3>

      <div className="space-y-3">

        <input
          className="w-full border rounded-lg p-3"
          placeholder="House / Flat No."
          value={manualAddress.house}
          onChange={(e) =>
            setManualAddress({
              ...manualAddress,
              house: e.target.value,
            })
          }
        />

        <input
          className="w-full border rounded-lg p-3"
          placeholder="Building / Society"
          value={manualAddress.building}
          onChange={(e) =>
            setManualAddress({
              ...manualAddress,
              building: e.target.value,
            })
          }
        />

        <input
          className="w-full border rounded-lg p-3"
          placeholder="Area / Landmark"
          value={manualAddress.area}
          onChange={(e) =>
            setManualAddress({
              ...manualAddress,
              area: e.target.value,
            })
          }
        />

        <input
          className="w-full border rounded-lg p-3"
          placeholder="City"
          value={manualAddress.city}
          onChange={(e) =>
            setManualAddress({
              ...manualAddress,
              city: e.target.value,
            })
          }
        />

        <input
          className="w-full border rounded-lg p-3"
          placeholder="State"
          value={manualAddress.state}
          onChange={(e) =>
            setManualAddress({
              ...manualAddress,
              state: e.target.value,
            })
          }
        />

        <input
          className="w-full border rounded-lg p-3"
          placeholder="Pincode"
          value={manualAddress.pincode}
          onChange={(e) =>
            setManualAddress({
              ...manualAddress,
              pincode: e.target.value,
            })
          }
        />

      </div>

      <button
        onClick={handleManualSubmit}
        className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold"
      >
        Save Address
      </button>

    </div>
  );
};

export default LocationSearchPanel;