
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Search } from "lucide-react";

export interface FilterOptions {
  category: string;
  maxPrice: string;
  searchTerm: string;
  status: string;
}

interface FilterBarProps {
  initialFilters: FilterOptions;
  categories: { value: string; label: string }[];
  onApplyFilters: (filters: FilterOptions) => void;
  onResetFilters: () => void;
}

const FilterBar = ({
  initialFilters,
  categories,
  onApplyFilters,
  onResetFilters,
}: FilterBarProps) => {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    onApplyFilters(filters);
  };

  const handleResetFilters = () => {
    setFilters({
      category: "",
      maxPrice: "",
      searchTerm: "",
      status: "",
    });
    onResetFilters();
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-1 md:col-span-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search tasks..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
              className="pl-10"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
        </div>
        
        <div>
          <Select
            value={filters.category || "all"}
            onValueChange={(value) => handleFilterChange("category", value === "all" ? "" : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Select
            value={filters.maxPrice}
            onValueChange={(value) => handleFilterChange("maxPrice", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Max Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Price</SelectItem>
              <SelectItem value="200">Under KSh 200</SelectItem>
              <SelectItem value="500">Under KSh 500</SelectItem>
              <SelectItem value="1000">Under KSh 1000</SelectItem>
              <SelectItem value="2000">Under KSh 2000</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Select
            value={filters.status}
            onValueChange={(value) => handleFilterChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in progress">In Progress</SelectItem>
              <SelectItem value="finished">Finished</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="col-span-1 md:col-span-4 flex space-x-2">
          <Button onClick={handleSearch} className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Apply Filters
          </Button>
          <Button variant="outline" onClick={handleResetFilters}>
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
