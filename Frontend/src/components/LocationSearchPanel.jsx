import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LocationSearchPanel = ({
  setConfirmOrderPanel,
  setPanelopen,
  setSelectedLocation,
  searchQuery,
}) => {
  const [locations, setLocations] = useState([
    "Room‑315, Nutan College, Talegaon Dabhade, Pune",
    "Sec‑26 near Petrol Morya Petrol Pump, Pooja Classic Apartment, Pune",
    "Sec‑27 near Abhi's Cafe, Pooja Classic Apartment, Pune",
    "22B, near Kapoor's Cafe, Pooja Classic Apartment, Pune",
    "18A, near Dehuroad, Pooja Classic Apartment, Pune",
    "At Post Varale, Near Talegaon Station, Dr D Y Patil Seamedu School Of Media Management, Talegaon Dabhade, Pune",
    "Sr No 124 & 126, A/P Ambi, MIDC Road, D Y Patil Polytechnic, Talegaon Dabhade, Pune",
    "Talegaon Chakan Road, Indrayani Institute Of Pharmaceutical Education & Research, Talegaon Dabhade, Pune",
    "Talegaon Chakan Road, Indrayani Institute Of Pharmacy, Talegaon Dabhade, Pune",
    "Yashwant Nagar Road, MIMER Medical College, Talegaon Dabhade, Pune",
    "Yashwant Nagar Road, Vaidyakiya Mahavidyalaya And Rugnalaya, Talegaon Dabhade, Pune",
    "Near Talegaon Station, MAEER’s Physiotherapy College, Talegaon Dabhade, Pune",
    "Vishnupuri, Nutan Maharashtra Vidya Polytechnic, Talegaon Dabhade, Pune",
    "Vishnupuri, Samarth Vidya Sankul, Nutan Maharashtra Institute of Engineering and Technology, Talegaon Dabhade, Pune",
    "Bhegade Aali, Adarsh Vidya Mandir School and College, Talegaon Dabhade, Pune",
    "Talegaon Dhabhade Road, Nutan Maharashtra Vidya Polytechnic's Workshop, Talegaon Dabhade, Pune",
    "Talegaon Dabhade Road, Kaivlya Infotech, Talegaon Dabhade, Pune",
    "Pune‑Mumbai Highway, NIPHT's Horticulture Training Centre, Talegaon Dabhade, Pune",
    "Bank Of Maharashtra, Sujeet Paliwal's Maths Academy, Talegaon Dabhade, Pune",
    "Talegaon Railway Station, Dr D Y Patil Education Academy School of Architecture, Talegaon Dabhade, Pune",
    "Talegaon – Chakan Road, Indrayani Mahavidyalaya, Talegaon Dabhade, Pune",
    "Near HP Service Station, Dr D Y Patil Educational Federation, Talegaon Dabhade, Pune",
    "Mumbai‑Pune Highway, Bai Dhunmai Cawasji High School & Jr College, Khandala (near Talegaon), Pune",
    "Off Sinhgad Road, Sinhgad College Of Education, Vadgaon (Bk), Talegaon Dabhade, Pune",
    "Near Tahasil Office, Shri Sant Tukaram Shikshan Prasarak Mandals College of Education, Vadgaon Maval, Talegaon Dabhade, Pune",
    "Little Hearts Society, Padmavayi Jr College, Urse (near Talegaon), Pune",
    "Yashwant Nagar Approach Road, MIT Junior College, Talegaon Dabhade, Pune",
    "Bhandara Darshan Colony, Polling Booth, Talegaon Dabhade, Pune",
    "Tapodham Colony, Polling Booth, Talegaon Dabhade, Pune",
    "Anand Nagar, Polling Booth, Talegaon Dabhade, Pune",
    "Yashwant Nagar, Punjab National Bank ATM, Talegaon Dabhade, Pune",
    "Pratik Nagar, Indira Supermarket, Talegaon Dabhade, Pune",
    "Pratik Nagar, Kajal Supermarket, Talegaon Dabhade, Pune",
    "Shivaji Chowk, Punjab National Bank ATM, Talegaon Dabhade, Pune",
    "Maglwar Peth, Traffic Police Chowky, Talegaon Dabhade, Pune",
    "Yashwant Nagar, Apurva Garden, Talegaon Dabhade, Pune",
    "Yashwant Nagar, Indrayani Garden, Talegaon Dabhade, Pune",
    "Yashwant Nagar, Nana Nani Park, Talegaon Dabhade, Pune",
    "Talegaon Chakan Road, Municipal School (Polling Booth), Talegaon Dabhade, Pune",
    "Talegaon Chakan Road, Indrayani High School (Polling Booth), Talegaon Dabhade, Pune",
    "Yashwant Nagar, JD Fitness, Talegaon Dabhade, Pune",
    "Shop No 7, Neha InfoTech, near Talegaon Railway Station, Talegaon Dabhade, Pune",
    "Mawal TAL, Birla Ganpati Temple (tourist spot), Shirgaon near Talegaon, Pune",
    "Old Mumbai‑Pune Highway, Kund Mala Falls, near Talegaon, Pune",
    "Lohgad Fort Area near Talegaon, Fort‑base settlement, Talegaon Dabhade, Pune",
    "Vitandgad (Tikona Fort), foothill base settlement, near Talegaon, Pune",
    "Durgadi Fort area, settlement, Talegaon Dabhade, Pune",
    "Durgadi Lake area, settlement, Talegaon Dabhade, Pune",
    "Talegaon Cantonment area, residential quarter, Talegaon Dabhade, Pune",
    "CRPF Camp area, Talegaon Dabhade, Pune",
    "CRPF Camp, Police Station (nearby), Talegaon Dabhade, Pune",
    "Shaher Vikas Samiti, Yashwant Nagar, Talegaon Dabhade, Pune",
    "Yashodham Hall, Yashwant Nagar, Talegaon Dabhade, Pune",
    "Bramhanwadi Road area primary school vicinity, Talegaon Dabhade, Pune",
    "Gavthan area Government Health Center, Ambi, Talegaon Dabhade, Pune"
  ]);
  const [userLocation, setUserLocation] = useState(null);
  const [filteredLocations, setFilteredLocations] = useState([]);

  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const response = await axios.get('https://ipapi.co/json/');
        const { city, region, country_name } = response.data;
        const location = `${city}, ${region}, ${country_name}`;
        setUserLocation(location);
      } catch (error) {
        setUserLocation('Unable to fetch location', error);
      }
    };
    fetchUserLocation();
  }, []);

  useEffect(() => {
    const results = locations.filter((location) =>
      location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredLocations(results);
  }, [searchQuery, locations]);

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
    setConfirmOrderPanel(true);
    setPanelopen(false);
  };

  return (
    <div>
      {userLocation && (
        <div
          onClick={() => handleLocationClick(userLocation)}
          className="flex border-2 p-3 rounded-xl border-gray-200 active:border-black items-center my-2 gap-4 cursor-pointer"
        >
          <h2 className="bg-[#eee] h-8 w-12 flex items-center justify-center rounded-full">
            <i className="ri-map-pin-fill"></i>
          </h2>
          <h4 className="font-medium">{userLocation} (Your Location)</h4>
        </div>
      )}
      <div className="max-h-64 overflow-y-auto mt-2">
        {filteredLocations.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No locations found.</p>
        ) : (
          filteredLocations.map((location, idx) => (
            <div
              key={idx}
              onClick={() => handleLocationClick(location)}
              className="flex flex-wrap border-2 p-3 rounded-xl border-gray-200 active:border-black items-center my-2 gap-4 cursor-pointer"
            >
              <h2 className="bg-[#eee] h-8 w-12 flex items-center justify-center rounded-full">
                <i className="ri-map-pin-fill"></i>
              </h2>
              <h4 className="font-medium">{location}</h4>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LocationSearchPanel;
