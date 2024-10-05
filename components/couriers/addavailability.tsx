import React, { useState } from 'react';

const AddAvailability: React.FC = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [vehicles, setVehicles] = useState<string[]>([]);

  const vehicleOptions = ['Car', 'Motorcycle', 'Bicycle', 'Van', 'Truck'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // For now, we'll just log the data instead of sending it to Firebase
    console.log('Availability data:', { startDate, endDate, vehicles });
    alert('Availability updated successfully!');
    // Reset form fields
    setStartDate('');
    setEndDate('');
    setVehicles([]);
  };

  const handleVehicleChange = (vehicle: string) => {
    setVehicles((prev) =>
      prev.includes(vehicle)
        ? prev.filter((v) => v !== vehicle)
        : [...prev, vehicle]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      <div>
        <label htmlFor="startDate" className="block mb-1 text-base sm:text-lg text-gray-800">
          Start Date:
        </label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-lg text-base sm:text-lg"
        />
      </div>
      <div>
        <label htmlFor="endDate" className="block mb-1 text-base sm:text-lg text-gray-800">
          End Date:
        </label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-lg text-base sm:text-lg"
        />
      </div>
      <div>
        <label className="block mb-1 text-base sm:text-lg text-gray-800">Available Vehicles:</label>
        <div className="space-y-2">
          {vehicleOptions.map((vehicle) => (
            <label key={vehicle} className="flex items-center">
              <input
                type="checkbox"
                checked={vehicles.includes(vehicle)}
                onChange={() => handleVehicleChange(vehicle)}
                className="mr-2"
              />
              <span className="text-base sm:text-lg text-gray-800">{vehicle}</span>
            </label>
          ))}
        </div>
      </div>
      <button
        type="submit"
        className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg text-base sm:text-lg"
      >
        Update Availability
      </button>
    </form>
  );
};

export default AddAvailability;
