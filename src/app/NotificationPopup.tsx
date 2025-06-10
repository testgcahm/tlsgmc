'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotificationPopup() {
  const [show, setShow] = useState(false);
  const [enlarged, setEnlarged] = useState(false);
  let display = true;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('hideEventNotification') !== '1' && display) {
        setShow(true);
      }
    }
  }, []);

  if (!show) return null;

  return (
    <>
      {enlarged && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80" onClick={() => setEnlarged(false)}>
          <Image
            src="/delay.jpg"
            alt="Event Postponed"
            sizes="fill"
            className="max-w-[90vw] max-h-[90vh] rounded-xl shadow-2xl border-4 border-white"
            onClick={e => e.stopPropagation()}
          />
          <button
            className="absolute top-6 right-8 text-white text-3xl font-bold bg-black/60 rounded-full px-3 py-1 hover:bg-black/80 transition"
            onClick={() => setEnlarged(false)}
            aria-label="Close image preview"
          >
            &times;
          </button>
        </div>
      )}
      <div className="fixed inset-0 z-[70] mb-5 flex items-start justify-center min-h-screen bg-black/50 bg-opacity-60 overflow-auto">
        <div className="relative bg-white rounded-lg shadow-lg max-w-lg w-full p-8 border border-gray-200 flex flex-col items-center my-8">
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
            onClick={() => setShow(false)}
            aria-label="Close notification"
          >
            &times;
          </button>
          <div className="flex flex-col items-center w-full">
            <Image
              src="/delay.jpg"
              alt="Event Postponed"
              width={600}
              height={300}
              className="rounded mb-4 object-contain cursor-zoom-in"
              onClick={() => setEnlarged(true)}
              priority
            />
            <h2 className="text-lg font-bold text-center mb-2 text-primary">Greetings Literary Enthusiasts!</h2>
            <p className="text-center text-base mb-2 font-bold">Literary Excellence Through Perseverance</p>
            <p className="text-center text-sm mb-2">{`"The pen is mightier than the sword" - Every challenge brings new opportunities for literary growth`}</p>
            <p className="text-sm">
              Last night, all our preparations were completed and we were very excited, thinking we are going to host this mega literary event tomorrow in the GMCTH Auditorium. But then, all of a sudden... everything changed, and we couldn't even understand how the situation turned out this way.
              <br />
              Although we — the executive cabinet of the Takhayul Literary Society GMC — are still quite uncertain about the future of our event, we will strive our best to figure things out as soon as the country's situation stabilizes, and we'll make sure that the hard work the Takhayul Literary Society has put into Literary Fiesta '25 for the past two months does not go to waste.
              <br />
              Every setback is a setup for a comeback, and surely, there must be some hidden opportunity for literary growth in this too.
            </p>
            <p className="text-center text-sm mb-2">May literature guide us through these times <br />With hope and determination.<br />Thank you for your support.</p>
            <Link href="/events/literary-fiesta" className="mt-3 inline-block px-4 py-2 bg-primary hover:bg-primary-700 text-white rounded hover:bg-primary-dark transition">View Event</Link>
            <div className="flex flex-row max-[414px]:flex-col items-center min-[414px]:gap-4">
              <button
              className=" bg-secondary hover:bg-secondary-700 text-white font-semibold rounded mt-4 px-4 py-2 transition"
              onClick={() => setShow(false)}
              aria-label="Close notification"
            >
              Close Popup
            </button>
              <button
                className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-700 font-semibold rounded text-white transition"
                onClick={() => {
                  setShow(false);
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('hideEventNotification', '1');
                  }
                }}
              >
                Don't display again
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
