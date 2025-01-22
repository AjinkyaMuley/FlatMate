import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { User, DollarSign, Briefcase, MapPin, Search as SearchIcon, Sparkles, X, Calendar } from 'lucide-react';

const Search = () => {
    const [budgetRange, setBudgetRange] = useState([500, 3000]);
    const [activeFilters, setActiveFilters] = useState([]);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Store all filter values in a single state object
    const [filters, setFilters] = useState({
        city: '',
        state: '',
        minBudget: 500,
        maxBudget: 3000,
        moveInDate: '',
        smokingPreference: '',
        cleanlinessLevel: '',
        sleepSchedule: '',
        guestPreference: '',
        age: '',
        gender: ''
    });

    const addFilter = (type, value) => {
        const existingFilterIndex = activeFilters.findIndex(filter => filter.type === type);
        if (existingFilterIndex !== -1) {
            const newFilters = [...activeFilters];
            newFilters[existingFilterIndex] = { type, value };
            setActiveFilters(newFilters);
        } else {
            setActiveFilters([...activeFilters, { type, value }]);
        }

        // Update filters state
        setFilters(prev => ({
            ...prev,
            [type]: value
        }));
    };

    const removeFilter = (index) => {
        const removedFilter = activeFilters[index];
        setActiveFilters(activeFilters.filter((_, i) => i !== index));

        // Reset the removed filter in filters state
        setFilters(prev => ({
            ...prev,
            [removedFilter.type]: ''
        }));
    };

    // Manual search handler
    const handleManualSearch = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                city: filters.city,
                state: filters.state,
                minBudget: filters.minBudget,
                maxBudget: filters.maxBudget,
                moveInDate: filters.moveInDate,
                smokingPreference: filters.smokingPreference,
                cleanlinessLevel: filters.cleanlinessLevel,
                page: currentPage,
                limit: 10
            });

            const response = await fetch(`https://flatmate-c9up.onrender.com/api/recommendations/getRoommatesBySearch/?${queryParams}`);
            const data = await response.json();

            console.log(data)

            if (response.ok) {
                setSearchResults(data.data.users);
                setTotalPages(data.pagination.totalPages);
            } else {
                console.error('Search failed:', data.error);
            }
        } catch (error) {
            console.error('Error during search:', error);
        } finally {
            setLoading(false);
        }
    };

    console.log(searchResults)

    // Smart match handler
    const handleSmartMatch = async () => {
        setLoading(true);
        try {
            // Assuming we have the current user's ID stored somewhere
            const userId = 2; // Or however you store the current user's ID

            const response = await fetch('https://flatmate-c9up.onrender.com/api/recommendations/getRommatesByRecommendations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    limit: 10
                })
            });

            const data = await response.json();

            if (response.ok) {
                setSearchResults(data.recommendations);
            } else {
                console.error('Recommendations failed:', data.error);
            }
        } catch (error) {
            console.error('Error getting recommendations:', error);
        } finally {
            setLoading(false);
        }
    };

    // Update search when page changes
    useEffect(() => {
        if (searchResults.length > 0) {
            handleManualSearch();
        }
    }, [currentPage]);

    // Rest of your component remains the same, just update the handlers in the buttons
    return (
        <div className="container mx-auto p-6 max-w-6xl">
            {/* Existing JSX remains the same until the Search Actions buttons */}

            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-2">Find Your Perfect Roommate</h1>
                <p className="text-gray-600">Search through verified roommates in your area</p>
            </div>

            <Card className="mb-8">
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {/* Location Search - Using UserLocation fields */}
                        <div className="space-y-2">
                            <Select onValueChange={(value) => addFilter('state', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select State" />
                                </SelectTrigger>
                                <SelectContent className="bg-white shadow-md rounded-md">
                                    <SelectItem value="CA">California</SelectItem>
                                    <SelectItem value="NY">New York</SelectItem>
                                    <SelectItem value="TX">Texas</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select onValueChange={(value) => addFilter('city', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select City" />
                                </SelectTrigger>
                                <SelectContent className="bg-white shadow-md rounded-md">
                                    <SelectItem value="San Francisco">San Francisco</SelectItem>
                                    <SelectItem value="New York">New York</SelectItem>
                                    <SelectItem value="Los Angeles">Los Angeles</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Budget Input - Using UserPreferences fields */}
                        <div>
                            <Label className="text-sm mb-2 block">
                                Budget Range: ${budgetRange[0]} - ${budgetRange[1]}
                            </Label>
                            <Slider
                                min={0}
                                max={5000}
                                step={100}
                                value={budgetRange}
                                onValueChange={(value) => {
                                    setBudgetRange(value);
                                    addFilter('budget', `$${value[0]}-$${value[1]}`);
                                }}
                                className="mt-2"
                            />
                        </div>

                        {/* Move-in Date - Using UserPreferences.moveInDate */}
                        <div>
                            <Label className="text-sm mb-2 block">Preferred Move-in Date</Label>
                            <Input
                                type="date"
                                className="h-10"
                                onChange={(e) => addFilter('moveInDate', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Active Filters */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {activeFilters.map((filter, index) => (
                            <Badge key={index} variant="secondary" className="px-3 py-1">
                                {filter.type}: {filter.value}
                                <X
                                    className="ml-2 h-4 w-4 cursor-pointer inline-block"
                                    onClick={() => removeFilter(index)}
                                />
                            </Badge>
                        ))}
                    </div>

                    {/* Advanced Filters Toggle */}
                    <div className="border-t pt-4">
                        <Button
                            variant="ghost"
                            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                            className="w-full"
                        >
                            {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
                        </Button>
                    </div>

                    {/* Advanced Filters - Based on UserPreferences model */}
                    {showAdvancedFilters && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <Select onValueChange={(value) => addFilter('smokingPreference', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Smoking Preference" />
                                </SelectTrigger>
                                <SelectContent className="bg-white shadow-md rounded-md">
                                    <SelectItem value="Non-Smoker">Non-Smoker</SelectItem>
                                    <SelectItem value="Smoker">Smoker</SelectItem>
                                    <SelectItem value="Outdoor">Outdoor Only</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select onValueChange={(value) => addFilter('cleanlinessLevel', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Cleanliness Level" />
                                </SelectTrigger>
                                <SelectContent className="bg-white shadow-md rounded-md">
                                    <SelectItem value="Very Clean">Very Clean</SelectItem>
                                    <SelectItem value="Clean">Clean</SelectItem>
                                    <SelectItem value="Moderate">Moderate</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select onValueChange={(value) => addFilter('sleepSchedule', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sleep Schedule" />
                                </SelectTrigger>
                                <SelectContent className="bg-white shadow-md rounded-md">
                                    <SelectItem value="Early Bird">Early Bird</SelectItem>
                                    <SelectItem value="Night Owl">Night Owl</SelectItem>
                                    <SelectItem value="Flexible">Flexible</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select onValueChange={(value) => addFilter('guestPreference', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Guest Preference" />
                                </SelectTrigger>
                                <SelectContent className="bg-white shadow-md rounded-md">
                                    <SelectItem value="No Guests">No Guests</SelectItem>
                                    <SelectItem value="Occasional">Occasional Guests</SelectItem>
                                    <SelectItem value="Flexible">Flexible</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select onValueChange={(value) => addFilter('age', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Age Range" />
                                </SelectTrigger>
                                <SelectContent className="bg-white shadow-md rounded-md">
                                    <SelectItem value="18-25">18-25</SelectItem>
                                    <SelectItem value="26-35">26-35</SelectItem>
                                    <SelectItem value="36+">36+</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select onValueChange={(value) => addFilter('gender', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Gender" />
                                </SelectTrigger>
                                <SelectContent className="bg-white shadow-md rounded-md">
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                    <SelectItem value="Non-Binary">Non-Binary</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Update the Search Actions buttons with the new handlers */}
            <div className="flex gap-4 mb-8">
                <Button
                    className="flex-1"
                    onClick={handleManualSearch}
                    disabled={loading}
                >
                    <SearchIcon className="mr-2 h-4 w-4" />
                    {loading ? 'Searching...' : 'Search Manually'}
                </Button>
                <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={handleSmartMatch}
                    disabled={loading || localStorage.getItem('user_login') != true}
                >
                    <Sparkles className="mr-2 h-4 w-4" />
                    {loading ? 'Matching...' : 'Match with My Preferences'}
                </Button>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Matching Roommates</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.map((roommate) => (
                        <Card key={roommate.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                                            <User className="h-6 w-6" />
                                        </div>
                                        <div className="ml-3">
                                            <CardTitle className="text-lg">{roommate.name}</CardTitle>
                                            <p className="text-sm text-gray-500">
                                                {roommate.age} • {roommate.occupation}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant="secondary">Verified</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center text-sm">
                                    <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                                    {roommate.location?.city}, {roommate.location?.state}
                                </div>
                                <div className="flex items-center text-sm">
                                    <DollarSign className="mr-2 h-4 w-4 text-gray-500" />
                                    Budget: ${roommate.preferences?.budgetMin} - ${roommate.preferences?.budgetMax}
                                </div>
                                <div className="flex items-center text-sm">
                                    <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                                    Available: {new Date(roommate.preferences?.moveInDate).toLocaleDateString()}
                                </div>
                                <div className="flex items-center text-sm">
                                    <Briefcase className="mr-2 h-4 w-4 text-gray-500" />
                                    {roommate.occupation}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="outline">{roommate.preferences?.smokingPreference}</Badge>
                                    <Badge variant="outline">{roommate.preferences?.sleepSchedule}</Badge>
                                    <Badge variant="outline">{roommate.preferences?.cleanlinessLevel}</Badge>
                                    <Badge variant="outline">{roommate.preferences?.guestPreference}</Badge>
                                </div>
                                <Button className="w-full">View Profile</Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Search;