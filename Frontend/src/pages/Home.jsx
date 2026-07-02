import React, { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import 'remixicon/fonts/remixicon.css';
import LocationSearchPanel from '../components/LocationSearchPanel';
import ConfirmOrder from '../components/ConfirmOrder';
import LookingForAdminAcceptance from '../components/LookingForAdminAcceptance';
import OrderAccepted from '../components/OrderAccepted';
import OrderRejected from '../components/OrderRejected';

const Home = () => {
  const [panelopen, setPanelopen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmOrderPanel, setConfirmOrderPanel] = useState(false);
  const [acceptedOrderPanel, setAcceptedOrderPanel] = useState(false);
  const [rejectedOrderPanel, setRejectedOrderPanel] = useState(false);
  const [lookingForAcceptancePanel, setLookingForAcceptancePanel] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [orderId, setOrderId] = useState(null);

  const confirmOrderPanelRef = useRef(null);
  const acceptedOrderPanelRef = useRef(null);
  const rejectedOrderPanelRef = useRef(null);
  const lookingForAcceptancePanelRef = useRef(null);
  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);

  const submitHandler = (e) => {
    e.preventDefault();
  };

  useGSAP(() => {
    if (panelopen) {
      gsap.to(panelRef.current, { height: '75%', padding: 24 });
      gsap.to(panelCloseRef.current, { opacity: 1 });
    } else {
      gsap.to(panelRef.current, { height: '0%', padding: 0 });
      gsap.to(panelCloseRef.current, { opacity: 0 });
    }
  }, [panelopen]);

  useGSAP(() => {
    if (confirmOrderPanel) {
      gsap.to(confirmOrderPanelRef.current, { transform: 'translateY(0)' });
    } else {
      gsap.to(confirmOrderPanelRef.current, { transform: 'translateY(100%)' });
    }
  }, [confirmOrderPanel]);

  useGSAP(() => {
    if (acceptedOrderPanel) {
      gsap.to(acceptedOrderPanelRef.current, { transform: 'translateY(0)' });
    } else {
      gsap.to(acceptedOrderPanelRef.current, { transform: 'translateY(100%)' });
    }
  }, [acceptedOrderPanel]);

  useGSAP(() => {
    if (rejectedOrderPanel) {
      gsap.to(rejectedOrderPanelRef.current, { transform: 'translateY(0)' });
    } else {
      gsap.to(rejectedOrderPanelRef.current, { transform: 'translateY(100%)' });
    }
  }, [rejectedOrderPanel]);

  useGSAP(() => {
    if (lookingForAcceptancePanel) {
      gsap.to(lookingForAcceptancePanelRef.current, {
        transform: 'translateY(-20px)',
        opacity: 1,
      });
    } else {
      gsap.to(lookingForAcceptancePanelRef.current, {
        transform: 'translateY(100%)',
        opacity: 0,
      });
    }
  }, [lookingForAcceptancePanel]);

  useEffect(() => {}, [orderId]);

  return (
    <div className="h-screen relative overflow-hidden">
      <img
        className="w-16 ml-8 inset-0 top-5 absolute"
        src="https://cdn-icons-png.flaticon.com/128/3063/3063822.png"
        alt=""
      />

      <div className="h-screen w-screen">
        <img
          className="h-full w-full object-cover"
          src="https://i.pinimg.com/originals/d7/ae/01/d7ae0170d3d5ffcbaa7f02fdda387a3b.gif"
          alt=""
        />
      </div>

      <div className="flex flex-col justify-end h-screen absolute top-0 w-full">
        <div className="h-[25%] p-6 bg-white relative pb-20">
          <h5
            ref={panelCloseRef}
            onClick={() => setPanelopen(false)}
            className="absolute top-3 opacity-0 right-2 text-2xl"
          >
            <i className="ri-arrow-down-wide-line"></i>
          </h5>

          <h4 className="text-3xl font-semibold">Choose your location</h4>

          <form onSubmit={submitHandler}>
            <input
              type="text"
              value={searchQuery}
              onClick={() => setPanelopen(true)}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a location..."
              className="bg-[#eee] px-5 py-2 text-base w-full rounded-lg mt-5"
            />
          </form>
        </div>

        <div ref={panelRef} className="bg-white h-0">
          <LocationSearchPanel
            setPanelopen={setPanelopen}
            setConfirmOrderPanel={setConfirmOrderPanel}
            setSelectedLocation={setSelectedLocation}
            searchQuery={searchQuery}
          />
        </div>
      </div>

      <div
        ref={confirmOrderPanelRef}
        className="fixed z-10 bottom-0 px-3 py-6 translate-y-full bg-white w-full"
      >
        <ConfirmOrder
          setConfirmOrderPanel={setConfirmOrderPanel}
          setLookingForAcceptancePanel={setLookingForAcceptancePanel}
          setOrderId={setOrderId}
          selectedLocation={selectedLocation}
          setTotalPrice={setTotalPrice}
          totalPrice={totalPrice}
        />
      </div>

      <div
        ref={acceptedOrderPanelRef}
        className="fixed z-10 bottom-0 px-3 py-6 translate-y-full bg-white w-full"
      >
        <OrderAccepted
          selectedLocation={selectedLocation}
          totalPrice={totalPrice}
        />
      </div>

      <div
        ref={rejectedOrderPanelRef}
        className="fixed z-10 bottom-0 px-3 py-6 translate-y-full bg-white w-full"
      >
        <OrderRejected
          selectedLocation={selectedLocation}
          totalPrice={totalPrice}
        />
      </div>

      <div
        ref={lookingForAcceptancePanelRef}
        className="fixed z-10 bottom-0 px-3 py-6 translate-y-full bg-white w-full"
      >
        {orderId && (
          <LookingForAdminAcceptance
            setAcceptedOrderPanel={setAcceptedOrderPanel}
            setRejectedOrderPanel={setRejectedOrderPanel}
            setLookingForAcceptancePanel={setLookingForAcceptancePanel}
            selectedLocation={selectedLocation}
            totalPrice={totalPrice}
            orderId={orderId}
          />
        )}
      </div>
    </div>
  );
};

export default Home;