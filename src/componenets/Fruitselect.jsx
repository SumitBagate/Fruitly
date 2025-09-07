import React, { useEffect, useState } from 'react';
import Card from './cards';
import axios from 'axios';

const FruitList = () => {
  const [fruits, setFruits] = useState([]);
  const [selectedFruits, setSelectedFruits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [recipeLoading, setRecipeLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch fruits from backend
  useEffect(() => {
    axios
      .get(`${API_URL}/api/fruits/external`)
      .then((res) => setFruits(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        console.error('Error fetching fruit data:', err);
        setFruits([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Toggle selected fruits
  const handleSelectFruit = (fruit) => {
    setSelectedFruits((prev) =>
      prev.find((f) => f.id === fruit.id)
        ? prev.filter((f) => f.id !== fruit.id)
        : [...prev, fruit]
    );
  };

  // Generate recipes
  const handleFindRecipes = async () => {
    if (!selectedFruits.length) return;

    setRecipeLoading(true);
    const fruitNames = selectedFruits.map((f) => f.name);

    try {
      const res = await axios.post(`${API_URL}/api/recipes/generate`, { fruits: fruitNames });
      console.log('Generated recipes:', res.data);

      // Ensure we have an array
      setRecipes(Array.isArray(res.data) ? res.data : [{ text: res.data }]);
    } catch (err) {
      console.error('Failed to fetch recipes:', err);
      setRecipes([{ text: 'Failed to generate recipes. Try again.' }]);
    } finally {
      setRecipeLoading(false);
    }
  };

  if (loading) return <p>Loading fruits...</p>;
  if (!fruits.length) return <p>No fruits available.</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Fruit Selection</h1>

      {/* Fruits Grid */}
      <div className="flex flex-wrap gap-4">
        {fruits.map((fruit) => (
          <div
            key={fruit.id}
            onClick={() => handleSelectFruit(fruit)}
            className={`cursor-pointer border rounded p-2 ${
              selectedFruits.find((f) => f.id === fruit.id)
                ? 'border-green-500'
                : 'border-gray-300'
            }`}
          >
            <Card
              image={`https://source.unsplash.com/400x300/?${fruit.name},fruit`}
              name={fruit.name}
              calories={fruit.nutritions?.calories}
              sugar={fruit.nutritions?.sugar}
              fiber={fruit.nutritions?.fiber}
            />
          </div>
        ))}
      </div>

      {/* Selected Fruits List */}
      {selectedFruits.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Selected Fruits:</h2>
          <ul className="list-disc list-inside">
            {selectedFruits.map((fruit) => (
              <li key={fruit.id}>{fruit.name}</li>
            ))}
          </ul>

          <button
            onClick={handleFindRecipes}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={recipeLoading}
          >
            {recipeLoading ? 'Generating Recipes...' : 'Find Recipes'}
          </button>
        </div>
      )}

      {/* Display Recipes */}
      {recipes.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Generated Recipes:</h2>
          {recipes.map((r, i) => (
            <div key={i} className="border p-4 rounded mb-4">
              {r.name ? (
                <>
                  <h3 className="font-bold text-lg">
                    {r.name} - {r.calories} kcal
                  </h3>
                  <p>
                    <strong>Ingredients:</strong> {r.ingredients.join(', ')}
                  </p>
                  <p>
                    <strong>Instructions:</strong> {r.instructions}
                  </p>
                  <p>
                    <strong>Benefits:</strong>
                  </p>
                  <ul className="list-disc list-inside ml-4">
                    {r.benefits.map((b, idx) => (
                      <li key={idx}>{b}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>{r.text}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FruitList;
