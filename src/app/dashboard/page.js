import { useState } from 'react';

const musicians = [
  { name: 'John Doe', skill: 'Guitar', price: 100 },
  { name: 'Jane Smith', skill: 'Piano', price: 150 },
  { name: 'Mike Johnson', skill: 'Drums', price: 120 },
];

export default function Dashboard() {
  const [search, setSearch] = useState('');
  const [filteredMusicians, setFilteredMusicians] = useState(musicians);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filtered = musicians.filter(
      (musician) =>
        musician.name.toLowerCase().includes(value) ||
        musician.skill.toLowerCase().includes(value) ||
        musician.price.toString().includes(value)
    );
    setFilteredMusicians(filtered);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Musician Search</h1>
      <input
        type="text"
        value={search}
        onChange={handleSearch}
        placeholder="Search by name, skill, or price"
        className="p-2 border rounded w-full mb-4"
      />
      <ul>
        {filteredMusicians.map((musician, index) => (
          <li key={index} className="p-2 border-b">
            {musician.name} - {musician.skill} - ${musician.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
