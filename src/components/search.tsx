import React, { useState, useEffect } from "react";
import { Search, Filter, X, ChevronDown } from "lucide-react";

interface FilterOptions {
  states: string[];
  countries: string[];
  cities: string[];
}

interface SearchFilterUIProps {
  onResultsChange: (results: any[]) => void;
  onLoadingChange: (loading: boolean) => void;
}

const SearchFilterUI: React.FC<SearchFilterUIProps> = ({
  onResultsChange,
  onLoadingChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    states: [],
    countries: [],
    cities: [],
  });
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({
    state: [],
    country: [],
    city: [],
  });
  const [totalRecords, setTotalRecords] = useState(0);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showFilters && !target.closest(".filter-dropdown")) {
        setShowFilters(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFilters]);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/filters");
      const data = await response.json();
      setFilterOptions({
        states: data.states || [],
        countries: data.countries || [],
        cities: data.cities || [],
      });
    } catch (error) {
      console.error("Error fetching filter options:", error);
    }
  };

  const fetchResults = async () => {
    onLoadingChange(true);
    try {
      const queryParams = new URLSearchParams();

      if (searchTerm) {
        queryParams.append("search", searchTerm);
      }

      if (selectedFilters.state.length > 0) {
        queryParams.append("state", selectedFilters.state.join(","));
      }

      if (selectedFilters.country.length > 0) {
        queryParams.append("country", selectedFilters.country.join(","));
      }

      if (selectedFilters.city.length > 0) {
        queryParams.append("city", selectedFilters.city.join(","));
      }

      const response = await fetch(
        `http://localhost:4000/api/hackathons/search?${queryParams.toString()}`
      );
      const result = await response.json();

      onResultsChange(result.data || []);
      setTotalRecords(result.pagination?.totalRecords || 0);
    } catch (error) {
      console.error("Error fetching results:", error);
      onResultsChange([]);
    } finally {
      onLoadingChange(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchTerm, selectedFilters]);

  const handleFilterChange = (groupId: string, value: string) => {
    setSelectedFilters((prev) => {
      const current = prev[groupId] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];

      return { ...prev, [groupId]: updated };
    });
  };

  const clearFilters = () => {
    setSelectedFilters({
      state: [],
      country: [],
      city: [],
    });
  };

  const activeFilterCount = Object.values(selectedFilters).flat().length;

  return (
    <div className="flex justify-center">
      <div>
        {/* Search Bar */}
        <div className="dark bg-black p-4 rounded-2xl shadow-sm mb-2 border border-gray-800 w-[660px]">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search hackathons by name or location..."
                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#62ed05] focus:border-transparent placeholder-gray-500"
              />
            </div>

            {/* Filter Dropdown Button */}
            <div className="relative filter-dropdown">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors whitespace-nowrap ${
                  showFilters || activeFilterCount > 0
                    ? "bg-[#43a600] text-white border-[#43a600]"
                    : "bg-gray-900 text-gray-300 border-gray-700 hover:bg-gray-800"
                }`}
              >
                <Filter className="w-5 h-5" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="bg-[#62ed05] text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {showFilters && (
                <div className="absolute top-full right-0 mt-2 w-[600px] max-w-[90vw] bg-black rounded-2xl shadow-2xl border border-gray-800 z-50">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold text-white">
                        Filters
                      </h2>
                      {activeFilterCount > 0 && (
                        <button
                          onClick={clearFilters}
                          className="text-sm text-[#43a600] hover:text-[#62ed05] font-medium"
                        >
                          Clear all
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* State Filter */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-300 mb-3">
                          State/Region
                        </h3>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                          {filterOptions.states.map((state) => (
                            <label
                              key={state}
                              className="flex items-center gap-2 cursor-pointer hover:bg-gray-900 p-1 rounded"
                            >
                              <input
                                type="checkbox"
                                checked={
                                  selectedFilters.state?.includes(state) ||
                                  false
                                }
                                onChange={() =>
                                  handleFilterChange("state", state)
                                }
                                className="w-4 h-4 text-[#43a600] bg-gray-800 border-gray-600 rounded focus:ring-[#43a600]"
                              />
                              <span className="text-sm text-gray-300">
                                {state}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Country Filter */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-300 mb-3">
                          Country
                        </h3>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                          {filterOptions.countries.map((country) => (
                            <label
                              key={country}
                              className="flex items-center gap-2 cursor-pointer hover:bg-gray-900 p-1 rounded"
                            >
                              <input
                                type="checkbox"
                                checked={
                                  selectedFilters.country?.includes(country) ||
                                  false
                                }
                                onChange={() =>
                                  handleFilterChange("country", country)
                                }
                                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-300">
                                {country}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* City Filter */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-300 mb-3">
                          City
                        </h3>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                          {filterOptions.cities.slice(0, 20).map((city) => (
                            <label
                              key={city}
                              className="flex items-center gap-2 cursor-pointer hover:bg-gray-900 p-1 rounded"
                            >
                              <input
                                type="checkbox"
                                checked={
                                  selectedFilters.city?.includes(city) || false
                                }
                                onChange={() =>
                                  handleFilterChange("city", city)
                                }
                                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-300">
                                {city}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Active Filters Tags */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {Object.entries(selectedFilters).map(([groupId, values]) =>
              values.map((value) => (
                <span
                  key={`${groupId}-${value}`}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-[#43a600] text-white text-sm rounded-full"
                >
                  {value}
                  <button
                    onClick={() => handleFilterChange(groupId, value)}
                    className="hover:bg-[#62ed05] rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilterUI;
