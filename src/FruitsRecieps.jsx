import React, { useState, useEffect } from "react";
import axios from "axios";

const fruitsList = ["Apple", "Banana", "Mango", "Orange", "Strawberry", "Pineapple"];
const DATABASE_ID = "YOUR_DATABASE_ID"; // Appwrite database
const COLLECTION_ID = "YOUR_COLLECTION_ID"; // Collection for saved recipes

const FruitRecipeWithSave = () => {
  const [selectedFruits, setSelectedFruits] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalRecipe, setModalRecipe] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDetails = await account.get();
        setUser(userDetails);
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const toggleFruit = (fruit) => {
    if (selectedFruits.includes(fruit)) {
      setSelectedFruits(selectedFruits.filter((f) => f !== fruit));
    } else {
      setSelectedFruits([...selectedFruits, fruit]);
    }
  };

  const fetchRecipes = async () => {
    if (selectedFruits.length === 0) return alert("Select at least one fruit!");
    setLoading(true);
    try {
      const response = await axios.post("https://your-api.com/getRecipes", {
        fruits: selectedFruits,
      });
      setRecipes(response.data.recipes || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const saveRecipe = async (recipe) => {
    if (!user) return alert("Please login to save recipes!");
    try {
      await databases.createDocument(DATABASE_ID, COLLECTION_ID, `${Date.now()}`, {
        userId: user.$id,
        recipe,
      });
      alert("Recipe saved!");
    } catch (err) {
      console.error(err);
      alert("Failed to save recipe.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Fruit Recipe Finder</h2>

      {/* Fruit selection */}
      <div className="flex flex-wrap gap-2 mb-4">
        {fruitsList.map((fruit) => (
          <button
            key={fruit}
            className={`px-4 py-2 rounded border ${
              selectedFruits.includes(fruit)
                ? "bg-green-500 text-white"
                : "bg-white border-gray-300"
            }`}
            onClick={() => toggleFruit(fruit)}
          >
            {fruit}
          </button>
        ))}
      </div>

      <div className="text-center mb-4">
        <button
          onClick={fetchRecipes}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          {loading ? "Fetching..." : "Get Recipes"}
        </button>
      </div>

      {/* Recipes list */}
      {recipes.length > 0 && (
        <>
          <h3 className="text-xl font-semibold mb-2 text-center">Recipes:</h3>
          <ul className="space-y-2">
            {recipes.map((recipe, idx) => (
              <li
                key={idx}
                className="p-2 border rounded hover:bg-gray-100 cursor-pointer flex justify-between items-center"
              >
                <span onClick={() => setModalRecipe(recipe)}>
                  {recipe.name}
                </span>
                <button
                  onClick={() => saveRecipe(recipe)}
                  className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                >
                  Save
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Modal */}
      {modalRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={() => setModalRecipe(null)}
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold mb-2">{modalRecipe.name}</h3>
            <p>{modalRecipe.description}</p>
            {modalRecipe.ingredients && (
              <>
                <h4 className="font-semibold mt-2">Ingredients:</h4>
                <ul className="list-disc list-inside">
                  {modalRecipe.ingredients.map((ing, i) => (
                    <li key={i}>{ing}</li>
                  ))}
                </ul>
              </>
            )}
            {modalRecipe.steps && (
              <>
                <h4 className="font-semibold mt-2">Steps:</h4>
                <ol className="list-decimal list-inside">
                  {modalRecipe.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FruitRecipeWithSave;
